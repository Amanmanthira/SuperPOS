const { app, BrowserWindow, ipcMain } = require('electron');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const X = require('./server-ext');
const { createFallbackDb } = require('./fallback-db');

let pool = null;
let mockDb = null;
let mainWindow = null;

const SCHEMA = `
IF OBJECT_ID('Settings') IS NULL CREATE TABLE Settings(k NVARCHAR(100) PRIMARY KEY,v NVARCHAR(MAX));
IF OBJECT_ID('Products') IS NULL CREATE TABLE Products(id INT IDENTITY PRIMARY KEY,barcode NVARCHAR(100),name NVARCHAR(200) NOT NULL,category NVARCHAR(100),price DECIMAL(18,2) DEFAULT 0,cost DECIMAL(18,2) DEFAULT 0,stock DECIMAL(18,2) DEFAULT 0,reorder DECIMAL(18,2) DEFAULT 5,taxable BIT DEFAULT 1,active BIT DEFAULT 1);
IF OBJECT_ID('Customers') IS NULL CREATE TABLE Customers(id INT IDENTITY PRIMARY KEY,name NVARCHAR(200) NOT NULL,phone NVARCHAR(50),email NVARCHAR(100),address NVARCHAR(300),active BIT DEFAULT 1);
IF OBJECT_ID('Sales') IS NULL CREATE TABLE Sales(id INT IDENTITY PRIMARY KEY,invoice_no NVARCHAR(50),customer_id INT NULL,subtotal DECIMAL(18,2),discount DECIMAL(18,2),vat DECIMAL(18,2),total DECIMAL(18,2),paid DECIMAL(18,2),change_due DECIMAL(18,2),method NVARCHAR(30),cashier NVARCHAR(100),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('SaleItems') IS NULL CREATE TABLE SaleItems(id INT IDENTITY PRIMARY KEY,sale_id INT,product_id INT,name NVARCHAR(200),qty DECIMAL(18,2),price DECIMAL(18,2),taxable BIT);`;

async function db() {
  if (pool) return pool;
  const cfgPath = path.join(app.isPackaged ? path.dirname(process.execPath) : __dirname, 'dbconfig.json');
  if (!fs.existsSync(cfgPath)) {
    throw new Error('dbconfig.json not found');
  }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  
  // Try to connect to master to check/create database
  const mc = await new sql.ConnectionPool({ ...cfg, database: 'master', connectionTimeout: 2500 }).connect();
  await mc.request().query(`IF DB_ID('${cfg.database}') IS NULL CREATE DATABASE [${cfg.database}]`);
  await mc.close();

  pool = await new sql.ConnectionPool({ ...cfg, connectionTimeout: 3000 }).connect();
  await pool.request().query(SCHEMA);
  for (const x of X.schema) {
    try { await pool.request().query(x); } catch (e) { /* ignore existing constraint/schema */ }
  }
  return pool;
}

async function q(s, p = {}) {
  const r = (await db()).request();
  for (const k in p) {
    if (p[k] !== undefined) r.input(k, p[k]);
  }
  return (await r.query(s)).recordset || [];
}

const safeQ = async (sqlStr, p = {}, def = []) => {
  try { return await q(sqlStr, p); } catch (e) { return def; }
};

// Handlers mapping
const H = {};

function setupSqlHandlers() {
  H['settings.get'] = async () => Object.fromEntries((await q('SELECT k,v FROM Settings')).map(r => [r.k, r.v]));
  H['settings.set'] = async o => {
    for (const k in o) {
      await q('MERGE Settings t USING(SELECT @k k)s ON t.k=s.k WHEN MATCHED THEN UPDATE SET v=@v WHEN NOT MATCHED THEN INSERT(k,v)VALUES(@k,@v);', { k, v: String(o[k] ?? '') });
    }
  };
  H['products.list'] = () => q('SELECT * FROM Products WHERE active=1 ORDER BY name');
  H['products.save'] = p => p.id
    ? q('UPDATE Products SET barcode=@barcode,name=@name,category=@category,price=@price,cost=@cost,stock=@stock,reorder=@reorder,taxable=@taxable WHERE id=@id', p)
    : q('INSERT Products(barcode,name,category,price,cost,stock,reorder,taxable)VALUES(@barcode,@name,@category,@price,@cost,@stock,@reorder,@taxable)', p);
  H['products.del'] = id => q('UPDATE Products SET active=0 WHERE id=@id', { id });
  H['customers.list'] = () => q('SELECT * FROM Customers WHERE active=1 ORDER BY name');
  H['customers.save'] = p => p.id
    ? q('UPDATE Customers SET name=@name,phone=@phone,email=@email,address=@address WHERE id=@id', p)
    : q('INSERT Customers(name,phone,email,address)VALUES(@name,@phone,@email,@address)', p);
  H['customers.del'] = id => q('UPDATE Customers SET active=0 WHERE id=@id', { id });
  H['sales.list'] = () => q('SELECT TOP 300 s.*,c.name customer FROM Sales s LEFT JOIN Customers c ON c.id=s.customer_id ORDER BY s.id DESC');
  H['sale.items'] = id => q('SELECT * FROM SaleItems WHERE sale_id=@id', { id });
  H['sale.create'] = async s => {
    const p = await db(), t = new sql.Transaction(p);
    await t.begin();
    const r = (x, o) => {
      const rq = new sql.Request(t);
      for (const k in o) rq.input(k, o[k]);
      return rq.query(x);
    };
    try {
      const { items, prefix, ...h } = s;
      const id = (await r('INSERT Sales(customer_id,subtotal,discount,vat,total,paid,change_due,method,cashier)OUTPUT INSERTED.id VALUES(@customer_id,@subtotal,@discount,@vat,@total,@paid,@change_due,@method,@cashier)', h)).recordset[0].id;
      const inv = (prefix || 'INV-') + String(id).padStart(6, '0');
      await r('UPDATE Sales SET invoice_no=@inv WHERE id=@id', { inv, id });
      for (const i of items) {
        await r('INSERT SaleItems(sale_id,product_id,name,qty,price,taxable)VALUES(@id,@pid,@name,@qty,@price,@tax)', { id, pid: i.id, name: i.name, qty: i.qty, price: i.price, tax: i.taxable ? 1 : 0 });
        await r('UPDATE Products SET stock=stock-@qty WHERE id=@pid', { qty: i.qty, pid: i.id });
      }
      await t.commit();
      return { id, invoice_no: inv, created: new Date() };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  // Enterprise Dashboard analytics query
  H['dash'] = async () => {
    const today = (await safeQ("SELECT ISNULL(SUM(total),0) t, COUNT(*) c FROM Sales WHERE status<>'Void' AND CAST(created AS date)=CAST(GETDATE() AS date)"))[0] || { t: 0, c: 0 };
    const yesterday = (await safeQ("SELECT ISNULL(SUM(total),0) t, COUNT(*) c FROM Sales WHERE status<>'Void' AND CAST(created AS date)=DATEADD(day,-1,CAST(GETDATE() AS date))"))[0] || { t: 0, c: 0 };
    const month = (await safeQ("SELECT ISNULL(SUM(total),0) t, COUNT(*) c FROM Sales WHERE status<>'Void' AND YEAR(created)=YEAR(GETDATE()) AND MONTH(created)=MONTH(GETDATE())"))[0] || { t: 0, c: 0 };
    const low = (await safeQ("SELECT COUNT(*) c FROM Products WHERE active=1 AND stock<=reorder"))[0]?.c || 0;
    const days = await safeQ("SELECT FORMAT(CAST(created AS date),'MM-dd') d, ISNULL(SUM(total),0) t, COUNT(*) c FROM Sales WHERE status<>'Void' AND created>=DATEADD(day,-6,CAST(GETDATE() AS date)) GROUP BY CAST(created AS date) ORDER BY CAST(created AS date)");
    const top = await safeQ("SELECT TOP 6 name, SUM(qty) q, ISNULL(SUM(qty*price),0) rev FROM SaleItems WHERE sale_id IN(SELECT id FROM Sales WHERE status<>'Void') GROUP BY name ORDER BY SUM(qty) DESC");
    const profitToday = (await safeQ("SELECT ISNULL(SUM(i.qty*(i.price - ISNULL(i.cost,0))),0) p FROM SaleItems i JOIN Sales s ON s.id=i.sale_id WHERE s.status<>'Void' AND CAST(s.created AS date)=CAST(GETDATE() AS date)"))[0]?.p || 0;
    const recent = await safeQ("SELECT TOP 8 s.id, s.invoice_no, s.created, s.total, s.method, s.cashier, c.name customer, (SELECT COUNT(*) FROM SaleItems i WHERE i.sale_id=s.id) items_count FROM Sales s LEFT JOIN Customers c ON c.id=s.customer_id WHERE s.status<>'Void' ORDER BY s.id DESC");
    const payments = await safeQ("SELECT p.method m, ISNULL(SUM(p.amount),0) t, COUNT(*) c FROM Payments p JOIN Sales s ON s.id=p.sale_id WHERE s.status<>'Void' AND CAST(s.created AS date)>=DATEADD(day,-7,CAST(GETDATE() AS date)) GROUP BY p.method");
    const lowItems = await safeQ("SELECT TOP 6 id, sku, name, category, stock, reorder, price, cost FROM Products WHERE active=1 AND stock<=reorder ORDER BY stock ASC");
    const expiryCount = (await safeQ("SELECT COUNT(*) c FROM Batches WHERE qty>0 AND expiry IS NOT NULL AND expiry<=DATEADD(day,30,GETDATE())"))[0]?.c || 0;
    const productCount = (await safeQ("SELECT COUNT(*) c FROM Products WHERE active=1"))[0]?.c || 0;
    const stockValue = (await safeQ("SELECT ISNULL(SUM(stock*cost),0) v FROM Products WHERE active=1"))[0]?.v || 0;
    const customers = (await safeQ("SELECT COUNT(*) c FROM Customers WHERE active=1"))[0]?.c || 0;
    const newCustomers = (await safeQ("SELECT COUNT(DISTINCT customer_id) c FROM Sales WHERE status<>'Void' AND customer_id IS NOT NULL AND CAST(created AS date)=CAST(GETDATE() AS date)"))[0]?.c || 0;
    const expensesMonth = (await safeQ("SELECT ISNULL(SUM(amount),0) v FROM Expenses WHERE YEAR(created)=YEAR(GETDATE()) AND MONTH(created)=MONTH(GETDATE())"))[0]?.v || 0;
    const openPOs = (await safeQ("SELECT COUNT(*) c FROM PurchaseOrders WHERE status='Open'"))[0]?.c || 0;
    const openPOValue = (await safeQ("SELECT ISNULL(SUM(total),0) v FROM PurchaseOrders WHERE status='Open'"))[0]?.v || 0;
    const supplierDebt = (await safeQ("SELECT ISNULL(SUM(balance),0) v FROM Suppliers WHERE active=1"))[0]?.v || 0;
    const monthProfit = (await safeQ("SELECT ISNULL(SUM(i.qty*(i.price - ISNULL(i.cost,0))),0) p FROM SaleItems i JOIN Sales s ON s.id=i.sale_id WHERE s.status<>'Void' AND YEAR(s.created)=YEAR(GETDATE()) AND MONTH(s.created)=MONTH(GETDATE())"))[0]?.p || 0;
    const monthDays = (await safeQ("SELECT COUNT(DISTINCT CAST(created AS date)) c FROM Sales WHERE status<>'Void' AND YEAR(created)=YEAR(GETDATE()) AND MONTH(created)=MONTH(GETDATE())"))[0]?.c || 1;
    const prevMonth = (await safeQ("SELECT ISNULL(SUM(total),0) t, COUNT(*) c FROM Sales WHERE status<>'Void' AND YEAR(created)=YEAR(DATEADD(month,-1,GETDATE())) AND MONTH(created)=MONTH(DATEADD(month,-1,GETDATE()))"))[0] || { t: 0, c: 0 };
    const monthProfitMargin = month.t ? +(100 * monthProfit / month.t).toFixed(1) : 0;
    const topCategory = (await safeQ("SELECT TOP 1 ISNULL(p.category,'Uncategorized') c FROM SaleItems i JOIN Sales s ON s.id=i.sale_id LEFT JOIN Products p ON p.id=i.product_id WHERE s.status<>'Void' AND YEAR(s.created)=YEAR(GETDATE()) AND MONTH(s.created)=MONTH(GETDATE()) GROUP BY p.category ORDER BY SUM(i.qty) DESC"))[0]?.c || '-';
    const lastSale = (await safeQ("SELECT TOP 1 created c FROM Sales WHERE status<>'Void' ORDER BY id DESC"))[0]?.c || null;

    return {
      today,
      yesterday,
      month: month.t,
      month_count: month.c,
      profit_today: profitToday,
      low,
      days,
      top,
      recent,
      payments,
      low_items: lowItems,
      expiry_count: expiryCount,
      // Extended business overview numbers (defensive: defaults keep the dashboard alive)
      product_count: productCount,
      stock_value: stockValue,
      customers,
      cust_today: newCustomers,
      expenses_month: expensesMonth,
      open_pos: openPOs,
      open_po_value: openPOValue,
      supplier_debt: supplierDebt,
      month_profit: monthProfit,
      month_margin: monthProfitMargin,
      avg_month_bill: month.c ? +(month.t / month.c).toFixed(2) : 0,
      days_in_month: monthDays,
      prev_month: prevMonth.t,
      prev_month_count: prevMonth.c,
      top_category: topCategory,
      last_sale: lastSale,
      isDemo: false
    };
  };

  X(H, q, db, sql);
}

function setupMockHandlers() {
  mockDb = createFallbackDb();
  console.log('✓ Initialized Enterprise Fallback Data Store (MSSQL offline mode)');

  H['settings.get'] = async () => ({ ...mockDb.settings });
  H['settings.set'] = async o => { Object.assign(mockDb.settings, o); return true; };

  H['products.list'] = async () => mockDb.products.filter(p => p.active !== 0);
  H['products.save'] = async p => {
    if (p.id) {
      const idx = mockDb.products.findIndex(x => x.id === p.id);
      if (idx !== -1) mockDb.products[idx] = { ...mockDb.products[idx], ...p };
    } else {
      const newId = Math.max(...mockDb.products.map(x => x.id), 0) + 1;
      mockDb.products.unshift({ id: newId, active: 1, ...p });
    }
    return true;
  };
  H['products.del'] = async id => {
    const p = mockDb.products.find(x => x.id === id);
    if (p) p.active = 0;
    return true;
  };

  H['customers.list'] = async () => mockDb.customers.filter(c => c.active !== 0);
  H['customers.save'] = async c => {
    if (c.id) {
      const idx = mockDb.customers.findIndex(x => x.id === c.id);
      if (idx !== -1) mockDb.customers[idx] = { ...mockDb.customers[idx], ...c };
    } else {
      const newId = Math.max(...mockDb.customers.map(x => x.id), 0) + 1;
      mockDb.customers.unshift({ id: newId, active: 1, points: 0, credit: 0, ...c });
    }
    return true;
  };
  H['customers.del'] = async id => {
    const c = mockDb.customers.find(x => x.id === id);
    if (c) c.active = 0;
    return true;
  };

  H['sales.list'] = async () => mockDb.sales.slice(0, 300);
  H['sale.items'] = async id => mockDb.saleItems.filter(i => i.sale_id === id);
  H['sale.pay'] = async id => mockDb.payments.filter(p => p.sale_id === id).map(p => ({ m: p.method, a: p.amount }));

  H['sale.create'] = async s => {
    const newId = Math.max(...mockDb.sales.map(x => x.id), 0) + 1;
    const inv = (s.prefix || 'INV-') + String(newId).padStart(6, '0');
    const cust = mockDb.customers.find(c => c.id === s.customer_id);

    const saleRecord = {
      id: newId,
      invoice_no: inv,
      customer_id: s.customer_id || null,
      customer: cust ? cust.name : 'Walk-in Customer',
      subtotal: s.subtotal,
      discount: s.discount || 0,
      vat: s.vat || 0,
      total: s.total,
      paid: s.paid,
      change_due: s.change_due,
      method: s.method || 'Cash',
      cashier: s.cashier || 'Alexander Vance',
      user_id: s.user_id || 1,
      branch_id: s.branch_id || 1,
      shift_id: s.shift_id || 101,
      status: 'Completed',
      created: new Date()
    };
    mockDb.sales.unshift(saleRecord);

    for (const item of s.items) {
      const itId = Math.max(...mockDb.saleItems.map(x => x.id), 0) + 1;
      mockDb.saleItems.push({
        id: itId,
        sale_id: newId,
        product_id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        cost: item.cost || (item.price * 0.6),
        taxable: item.taxable
      });

      // Deduct stock
      const prod = mockDb.products.find(p => p.id === item.id);
      if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
    }

    if (s.payments && s.payments.length) {
      s.payments.forEach(p => {
        mockDb.payments.push({ id: mockDb.payments.length + 1, sale_id: newId, method: p.m, amount: p.a });
      });
    } else {
      mockDb.payments.push({ id: mockDb.payments.length + 1, sale_id: newId, method: s.method || 'Cash', amount: s.total });
    }

    if (cust) {
      if (s.points_used) cust.points = Math.max(0, cust.points - s.points_used);
      if (s.points_earned) cust.points = (cust.points || 0) + s.points_earned;
    }

    return { id: newId, invoice_no: inv, created: new Date() };
  };

  H['sale.void'] = async o => {
    const s = mockDb.sales.find(x => x.id === o.id);
    if (!s) throw new Error('Sale not found');
    if (s.status === 'Void') throw new Error('Already void');
    s.status = 'Void';
    // restore stock
    const items = mockDb.saleItems.filter(i => i.sale_id === o.id);
    items.forEach(i => {
      const p = mockDb.products.find(x => x.id === i.product_id);
      if (p) p.stock += i.qty;
    });
    return true;
  };

  H['return.create'] = async o => {
    const s = mockDb.sales.find(x => x.id === o.sale_id);
    const newId = 1000 + Math.floor(Math.random() * 9000);
    const retNo = 'RET-' + String(newId).padStart(6, '0');
    for (const item of o.items) {
      const p = mockDb.products.find(x => x.id === item.product_id);
      if (p) p.stock += item.qty;
    }
    return { id: newId, return_no: retNo, created: new Date() };
  };

  H['customer.history'] = async id => mockDb.sales.filter(s => s.customer_id === id).slice(0, 50);
  H['coupon.check'] = async code => mockDb.coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.active) || null;

  H['categories.list'] = async () => mockDb.categories;
  H['categories.save'] = async o => {
    if (o.id) {
      const idx = mockDb.categories.findIndex(c => c.id === o.id);
      if (idx !== -1) mockDb.categories[idx] = { ...mockDb.categories[idx], ...o };
    } else {
      mockDb.categories.push({ id: mockDb.categories.length + 1, name: o.name });
    }
    return true;
  };
  H['categories.del'] = async id => {
    mockDb.categories = mockDb.categories.filter(c => c.id !== id);
    return true;
  };

  H['suppliers.list'] = async () => mockDb.suppliers.filter(s => s.active !== 0);
  H['suppliers.save'] = async o => {
    if (o.id) {
      const idx = mockDb.suppliers.findIndex(s => s.id === o.id);
      if (idx !== -1) mockDb.suppliers[idx] = { ...mockDb.suppliers[idx], ...o };
    } else {
      mockDb.suppliers.push({ id: mockDb.suppliers.length + 1, balance: 0, active: 1, ...o });
    }
    return true;
  };
  H['suppliers.del'] = async id => {
    const s = mockDb.suppliers.find(x => x.id === id);
    if (s) s.active = 0;
    return true;
  };
  H['supplier.pay'] = async o => {
    const s = mockDb.suppliers.find(x => x.id === o.s);
    if (s) s.balance = Math.max(0, s.balance - (+o.a || 0));
    return true;
  };

  H['expenses.list'] = async () => mockDb.expenses;
  H['expenses.save'] = async o => {
    mockDb.expenses.unshift({ id: mockDb.expenses.length + 1, created: new Date(), ...o });
    return true;
  };
  H['expenses.del'] = async id => {
    mockDb.expenses = mockDb.expenses.filter(e => e.id !== id);
    return true;
  };

  H['coupons.list'] = async () => mockDb.coupons.filter(c => c.active !== 0);
  H['coupons.save'] = async o => {
    if (o.id) {
      const idx = mockDb.coupons.findIndex(c => c.id === o.id);
      if (idx !== -1) mockDb.coupons[idx] = { ...mockDb.coupons[idx], ...o };
    } else {
      mockDb.coupons.push({ id: mockDb.coupons.length + 1, active: 1, ...o });
    }
    return true;
  };
  H['coupons.del'] = async id => {
    mockDb.coupons = mockDb.coupons.filter(c => c.id !== id);
    return true;
  };

  H['branches.list'] = async () => mockDb.branches.filter(b => b.active !== 0);
  H['branches.save'] = async o => {
    if (o.id) {
      const idx = mockDb.branches.findIndex(b => b.id === o.id);
      if (idx !== -1) mockDb.branches[idx] = { ...mockDb.branches[idx], ...o };
    } else {
      mockDb.branches.push({ id: mockDb.branches.length + 1, active: 1, ...o });
    }
    return true;
  };
  H['branches.del'] = async id => {
    const b = mockDb.branches.find(x => x.id === id);
    if (b) b.active = 0;
    return true;
  };

  H['users.list'] = async () => mockDb.users.filter(u => u.active !== 0);
  H['users.save'] = async o => {
    if (o.id) {
      const idx = mockDb.users.findIndex(u => u.id === o.id);
      if (idx !== -1) mockDb.users[idx] = { ...mockDb.users[idx], ...o };
    } else {
      mockDb.users.push({ id: mockDb.users.length + 1, active: 1, ...o });
    }
    return true;
  };
  H['users.del'] = async id => {
    const u = mockDb.users.find(x => x.id === id);
    if (u && u.username !== 'admin') u.active = 0;
    return true;
  };

  H['auth.login'] = async o => {
    const u = mockDb.users.find(x => x.username.toLowerCase() === (o.username || '').toLowerCase() && x.active !== 0);
    if (!u) throw new Error('Invalid username or password');
    return u;
  };

  H['stock.adjust'] = async o => {
    const p = mockDb.products.find(x => x.id === o.pid);
    if (p) p.stock = Math.max(0, p.stock + (+o.qty || 0));
    return true;
  };

  H['stock.transfer'] = async o => {
    return true;
  };

  H['po.list'] = async () => mockDb.purchaseOrders;
  H['po.items'] = async id => [
    { product_id: 1, name: 'Organic Whole Milk 1L', qty: 30, cost: 2.10 },
    { product_id: 2, name: 'Artisan Sourdough Bread', qty: 20, cost: 2.20 }
  ];
  H['po.create'] = async o => {
    const newId = mockDb.purchaseOrders.length + 1;
    const sup = mockDb.suppliers.find(s => s.id === o.supplier_id);
    const tot = o.items.reduce((a, i) => a + i.qty * i.cost, 0);
    mockDb.purchaseOrders.unshift({
      id: newId,
      po_no: 'PO-' + String(newId).padStart(6, '0'),
      supplier_id: o.supplier_id,
      supplier: sup ? sup.name : 'Supplier',
      status: 'Open',
      total: tot,
      created: new Date()
    });
    return { id: newId };
  };

  H['grn.list'] = async () => mockDb.grn;
  H['grn.create'] = async o => {
    const newId = mockDb.grn.length + 1;
    const sup = mockDb.suppliers.find(s => s.id === o.supplier_id);
    const tot = o.items.reduce((a, i) => a + i.qty * i.cost, 0);
    mockDb.grn.unshift({
      id: newId,
      grn_no: 'GRN-' + String(newId).padStart(6, '0'),
      supplier_id: o.supplier_id,
      supplier: sup ? sup.name : 'Supplier',
      invoice_ref: o.invoice_ref || '',
      total: tot,
      paid: o.paid || 0,
      user_name: 'Alexander Vance',
      created: new Date()
    });
    // add stock
    o.items.forEach(i => {
      const p = mockDb.products.find(x => x.id === i.product_id);
      if (p) {
        p.stock += i.qty;
        p.cost = i.cost;
      }
    });
    return { id: newId, grn_no: 'GRN-' + String(newId).padStart(6, '0') };
  };

  H['shift.current'] = async uid => mockDb.shifts.find(s => s.user_id === uid && s.status === 'Open') || null;
  H['shift.open'] = async o => {
    const newId = mockDb.shifts.length + 101;
    const s = {
      id: newId,
      user_id: o.uid,
      user_name: 'Alexander Vance',
      opened: new Date(),
      closed: null,
      opening: +o.opening || 0,
      expected: +o.opening || 0,
      counted: null,
      diff: null,
      status: 'Open'
    };
    mockDb.shifts.unshift(s);
    return s;
  };
  H['shift.cash'] = async o => {
    mockDb.cashMoves.push({ id: mockDb.cashMoves.length + 1, shift_id: o.sid, type: o.type, amount: +o.amount, note: o.note, created: new Date() });
    return true;
  };
  H['shift.summary'] = async id => {
    const sh = mockDb.shifts.find(s => s.id === id) || mockDb.shifts[0];
    const cashSales = mockDb.sales.filter(s => s.status === 'Completed' && s.method.includes('Cash')).reduce((a, s) => a + s.total, 0);
    const cin = mockDb.cashMoves.filter(m => m.shift_id === id && m.type === 'IN').reduce((a, m) => a + m.amount, 0);
    const cout = mockDb.cashMoves.filter(m => m.shift_id === id && m.type === 'OUT').reduce((a, m) => a + m.amount, 0);
    return {
      ...sh,
      cash_sales: cashSales,
      cin,
      cout,
      bills: mockDb.sales.filter(s => s.status === 'Completed').length,
      sales: mockDb.sales.filter(s => s.status === 'Completed').reduce((a, s) => a + s.total, 0),
      expected: sh.opening + cashSales + cin - cout
    };
  };
  H['shift.close'] = async o => {
    const sum = await H['shift.summary'](o.id);
    const sh = mockDb.shifts.find(s => s.id === o.id);
    if (sh) {
      sh.closed = new Date();
      sh.counted = +o.counted;
      sh.expected = sum.expected;
      sh.diff = (+o.counted) - sum.expected;
      sh.status = 'Closed';
    }
    return { expected: sum.expected, counted: +o.counted, diff: (+o.counted) - sum.expected };
  };

  H['report.list'] = () => [
    { k: 'daily', title: 'Daily sales breakdown' },
    { k: 'profit', title: 'Profit & gross margin' },
    { k: 'best', title: 'Best-selling products' },
    { k: 'low', title: 'Low stock alerts' },
    { k: 'expiry', title: 'Expiring batches (30 days)' },
    { k: 'cashier', title: 'Cashier performance' },
    { k: 'pay', title: 'Payment methods' },
    { k: 'customers', title: 'Customer loyalty' }
  ];

  H['report'] = async o => {
    if (o.k === 'low') {
      return mockDb.products.filter(p => p.stock <= p.reorder).map(p => ({ Product: p.name, Stock: p.stock, Reorder: p.reorder, Value: p.stock * p.cost }));
    }
    if (o.k === 'expiry') {
      return mockDb.batches.map(b => {
        const p = mockDb.products.find(x => x.id === b.product_id);
        return { Product: p ? p.name : 'Unknown', Batch: b.batch_no, Expiry: b.expiry, Qty: b.qty };
      });
    }
    if (o.k === 'best') {
      return mockDb.products.slice(0, 10).map((p, idx) => ({ Product: p.name, Sold: 40 - idx * 3, Revenue: (40 - idx * 3) * p.price }));
    }
    // Default sales rows
    return mockDb.sales.slice(0, 20).map(s => ({
      Invoice: s.invoice_no,
      Date: s.created instanceof Date ? s.created.toISOString().slice(0, 10) : String(s.created),
      Customer: s.customer,
      Method: s.method,
      Total: s.total
    }));
  };

  H['open'] = () => {};

  // Rich Enterprise Dashboard API for Mock Mode
  H['dash'] = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = mockDb.sales.filter(s => s.status !== 'Void' && new Date(s.created).toISOString().slice(0, 10) === today);
    const todayTotal = todaySales.reduce((a, s) => a + s.total, 0);

    // Yesterday
    const yestDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const yestSales = mockDb.sales.filter(s => s.status !== 'Void' && new Date(s.created).toISOString().slice(0, 10) === yestDate);
    const yestTotal = yestSales.reduce((a, s) => a + s.total, 0);

    // Month
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthSales = mockDb.sales.filter(s => s.status !== 'Void' && new Date(s.created).toISOString().slice(0, 7) === thisMonth);
    const monthTotal = monthSales.reduce((a, s) => a + s.total, 0);

    // Days past 7
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toISOString().slice(0, 10);
      const dayLabel = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const daySales = mockDb.sales.filter(s => s.status !== 'Void' && new Date(s.created).toISOString().slice(0, 10) === ds);
      days.push({
        d: dayLabel,
        t: Number(daySales.reduce((a, s) => a + s.total, 0).toFixed(2)),
        c: daySales.length
      });
    }

    // Top products
    const itemMap = {};
    mockDb.saleItems.forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = { name: item.name, q: 0, rev: 0 };
      itemMap[item.name].q += item.qty;
      itemMap[item.name].rev += item.qty * item.price;
    });
    const top = Object.values(itemMap).sort((a, b) => b.q - a.q).slice(0, 6);

    // Payment breakdown
    const payMap = { Cash: 0, Card: 0, Digital: 0, Credit: 0 };
    mockDb.sales.slice(0, 50).forEach(s => {
      if (s.method.includes('Cash')) payMap.Cash += s.total;
      else if (s.method.includes('Card')) payMap.Card += s.total;
      else if (s.method.includes('Digital') || s.method.includes('Online')) payMap.Digital += s.total;
      else payMap.Credit += s.total;
    });
    const payTotal = Object.values(payMap).reduce((a, b) => a + b, 0) || 1;
    const payments = Object.entries(payMap).map(([m, t]) => ({
      m,
      t: Number(t.toFixed(2)),
      pct: Number((t / payTotal * 100).toFixed(1))
    }));

    // Low stock items
    const lowItems = mockDb.products.filter(p => p.stock <= p.reorder).slice(0, 6);
    const low = lowItems.length;

    // Recent sales
    const recent = mockDb.sales.slice(0, 8).map(s => ({
      id: s.id,
      invoice_no: s.invoice_no,
      created: s.created,
      total: s.total,
      method: s.method,
      cashier: s.cashier,
      customer: s.customer,
      items_count: mockDb.saleItems.filter(i => i.sale_id === s.id).length || 2
    }));

    // Profit today
    const profitToday = Number((todayTotal * 0.38).toFixed(2));

    // Inventory & catalogue health
    const products = mockDb.products.filter(p => p.active !== 0);
    const productCount = products.length;
    const stockValue = Number(products.reduce((a, p) => a + (p.stock || 0) * (p.cost || 0), 0).toFixed(2));
    const customers = mockDb.customers.filter(c => c.active !== 0).length;
    const custToday = new Set(todaySales.map(s => s.customer_id).filter(Boolean)).size;

    // Expenses this month
    const thisMonthKey = new Date().toISOString().slice(0, 7);
    const expensesMonth = Number((mockDb.expenses || [])
      .filter(e => new Date(e.created).toISOString().slice(0, 7) === thisMonthKey)
      .reduce((a, e) => a + (+e.amount || 0), 0).toFixed(2));

    // Purchasing commitments & supplier balances
    const openPOsList = (mockDb.purchaseOrders || []).filter(o => (o.status || '').toLowerCase() === 'open');
    const openPOs = openPOsList.length;
    const openPOValue = Number(openPOsList.reduce((a, o) => a + (+o.total || 0), 0).toFixed(2));
    const supplierDebt = Number((mockDb.suppliers || []).reduce((a, s) => a + (+s.balance || 0), 0).toFixed(2));

    // Month profit / margin / averages
    const monthProfit = Number((monthTotal * 0.38).toFixed(2));
    const monthMargin = monthTotal ? +(100 * monthProfit / monthTotal).toFixed(1) : 0;
    const avgMonthBill = monthSales.length ? +(monthTotal / monthSales.length).toFixed(2) : 0;
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevKey = prevDate.toISOString().slice(0, 7);
    const prevSales = mockDb.sales.filter(s => s.status !== 'Void' && new Date(s.created).toISOString().slice(0, 7) === prevKey);
    const prevMonth = Number(prevSales.reduce((a, s) => a + s.total, 0).toFixed(2));

    // Best category this month (via product lookup)
    const catMap = {};
    mockDb.saleItems.forEach(i => {
      const prod = mockDb.products.find(p => p.id === i.product_id);
      const cat = (prod && prod.category) || 'Uncategorized';
      catMap[cat] = (catMap[cat] || 0) + (+i.qty || 0);
    });
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    const lastSale = mockDb.sales[0] ? mockDb.sales[0].created : null;

    return {
      today: { t: Number(todayTotal.toFixed(2)), c: todaySales.length },
      yesterday: { t: Number(yestTotal.toFixed(2)), c: yestSales.length },
      month: Number(monthTotal.toFixed(2)),
      month_count: monthSales.length,
      profit_today: profitToday,
      low,
      days,
      top,
      recent,
      payments,
      low_items: lowItems,
      expiry_count: mockDb.batches.length,
      product_count: productCount,
      stock_value: stockValue,
      customers,
      cust_today: custToday,
      expenses_month: expensesMonth,
      open_pos: openPOs,
      open_po_value: openPOValue,
      supplier_debt: supplierDebt,
      month_profit: monthProfit,
      month_margin: monthMargin,
      avg_month_bill: avgMonthBill,
      days_in_month: daysInMonth,
      prev_month: prevMonth,
      prev_month_count: prevSales.length,
      top_category: topCategory,
      last_sale: lastSale,
      isDemo: true
    };
  };
}

// Initialize database with graceful fallback (guaranteed to complete before IPC or Window load)
let initPromise = null;
function initDb() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      console.log('Attempting MSSQL connection...');
      await db();
      setupSqlHandlers();
      console.log('✓ Successfully connected to MSSQL Database');
    } catch (err) {
      console.warn('MSSQL connection not available (' + err.message + '). Switching to Enterprise Fallback Store.');
      setupMockHandlers();
    }
  })();
  return initPromise;
}

H['printers.list'] = async () => {
  let list = [];
  if (mainWindow && mainWindow.webContents && typeof mainWindow.webContents.getPrintersAsync === 'function') {
    try {
      list = await mainWindow.webContents.getPrintersAsync();
    } catch (err) {
      console.error('Error getting printers:', err);
    }
  }
  if (!list || !list.length) {
    list = [
      { name: 'System Default Printer', displayName: 'System Default Printer', isDefault: true },
      { name: 'POS Thermal Printer (80mm)', displayName: 'POS Thermal Printer (80mm)', isDefault: false },
      { name: 'Generic Receipt Printer (58mm)', displayName: 'Generic Receipt Printer (58mm)', isDefault: false },
      { name: 'Save as PDF', displayName: 'Save as PDF', isDefault: false }
    ];
  }
  return list;
};

H['receipt.print'] = async (options = {}) => {
  if (mainWindow && mainWindow.webContents && typeof mainWindow.webContents.print === 'function') {
    return new Promise((resolve) => {
      const opts = {
        silent: !!options.silent,
        printBackground: true
      };
      if (options.deviceName && options.deviceName !== 'System Default' && options.deviceName !== 'System Default Printer') {
        opts.deviceName = options.deviceName;
      }
      mainWindow.webContents.print(opts, (success, failureReason) => {
        resolve({ success, failureReason });
      });
    });
  }
  return { success: false, failureReason: 'Direct printing unavailable' };
};

ipcMain.handle('api', async (e, n, a) => {
  await initDb();
  if (typeof H[n] === 'function') {
    return H[n](a);
  }
  throw new Error(`Unknown API endpoint: ${n}`);
});

app.whenReady().then(async () => {
  await initDb();

  const w = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    autoHideMenuBar: true,
    title: 'Amectar Enterprise POS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow = w;
  w.maximize();
  w.loadFile('renderer/index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
