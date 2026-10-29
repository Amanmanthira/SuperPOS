// Enterprise Fallback / Offline Mock Database
// Provides realistic supermarket demo data when MSSQL server is offline

const crypto = require('crypto');
const hash = p => crypto.createHash('sha256').update(p + 'pos').digest('hex');

function createFallbackDb() {
  const now = new Date();
  const dStr = offsetDays => {
    const d = new Date(now);
    d.setDate(d.getDate() - offsetDays);
    return d;
  };

  const categories = [
    { id: 1, name: 'Dairy & Eggs' },
    { id: 2, name: 'Bakery' },
    { id: 3, name: 'Beverages' },
    { id: 4, name: 'Fresh Produce' },
    { id: 5, name: 'Pantry' },
    { id: 6, name: 'Meat & Seafood' },
    { id: 7, name: 'Snacks & Confectionery' }
  ];

  const products = [
    { id: 1, sku: 'PROD-001', barcode: '8901001', name: 'Organic Whole Milk 1L', category: 'Dairy & Eggs', price: 3.50, cost: 2.10, stock: 45, reorder: 15, taxable: 1, active: 1 },
    { id: 2, sku: 'PROD-002', barcode: '8901002', name: 'Artisan Sourdough Bread', category: 'Bakery', price: 4.80, cost: 2.20, stock: 28, reorder: 10, taxable: 0, active: 1 },
    { id: 3, sku: 'PROD-003', barcode: '8901003', name: 'Fair Trade Espresso Beans 500g', category: 'Beverages', price: 16.50, cost: 8.90, stock: 32, reorder: 10, taxable: 1, active: 1 },
    { id: 4, sku: 'PROD-004', barcode: '8901004', name: 'Extra Virgin Olive Oil 750ml', category: 'Pantry', price: 18.90, cost: 11.20, stock: 22, reorder: 8, taxable: 1, active: 1 },
    { id: 5, sku: 'PROD-005', barcode: '8901005', name: 'Greek Strained Yogurt 500g', category: 'Dairy & Eggs', price: 5.20, cost: 2.90, stock: 4, reorder: 12, taxable: 1, active: 1 }, // Low stock!
    { id: 6, sku: 'PROD-006', barcode: '8901006', name: 'Organic Hass Avocados (3pk)', category: 'Fresh Produce', price: 4.50, cost: 2.30, stock: 38, reorder: 15, taxable: 0, active: 1 },
    { id: 7, sku: 'PROD-007', barcode: '8901007', name: 'Dark Chocolate 72% 100g', category: 'Snacks & Confectionery', price: 3.80, cost: 1.90, stock: 3, reorder: 15, taxable: 1, active: 1 }, // Low stock!
    { id: 8, sku: 'PROD-008', barcode: '8901008', name: 'Sparkling Mineral Water 1L', category: 'Beverages', price: 2.40, cost: 1.10, stock: 54, reorder: 20, taxable: 1, active: 1 },
    { id: 9, sku: 'PROD-009', barcode: '8901009', name: 'Fresh Atlantic Salmon Fillet 300g', category: 'Meat & Seafood', price: 14.50, cost: 9.20, stock: 16, reorder: 8, taxable: 1, active: 1 },
    { id: 10, sku: 'PROD-010', barcode: '8901010', name: 'Free Range Large Brown Eggs 12pk', category: 'Dairy & Eggs', price: 5.90, cost: 3.40, stock: 26, reorder: 10, taxable: 1, active: 1 },
    { id: 11, sku: 'PROD-011', barcode: '8901011', name: 'Cold-Pressed Orange Juice 1L', category: 'Beverages', price: 5.50, cost: 3.10, stock: 5, reorder: 12, taxable: 1, active: 1 }, // Low stock!
    { id: 12, sku: 'PROD-012', barcode: '8901012', name: 'Organic Rolled Oats 1kg', category: 'Pantry', price: 6.20, cost: 3.50, stock: 30, reorder: 10, taxable: 0, active: 1 }
  ];

  const customers = [
    { id: 1, name: 'Sarah Jenkins', phone: '+1 555-0192', email: 'sarah.j@example.com', address: '742 Evergreen Terr', tier: 'Gold', points: 480, credit: 65.00, discount_pct: 5, active: 1 },
    { id: 2, name: 'David Miller', phone: '+1 555-0144', email: 'david.m@example.com', address: '124 Conch St', tier: 'Platinum', points: 1250, credit: 140.00, discount_pct: 8, active: 1 },
    { id: 3, name: 'Elena Rostova', phone: '+1 555-0177', email: 'elena.r@example.com', address: '456 Elm Way', tier: 'Silver', points: 210, credit: 0, discount_pct: 2, active: 1 },
    { id: 4, name: 'Marcus Chen', phone: '+1 555-0123', email: 'marcus.c@example.com', address: '88 Oakridge Blvd', tier: 'Regular', points: 85, credit: 20.00, discount_pct: 0, active: 1 }
  ];

  const suppliers = [
    { id: 1, name: 'Apex Wholesale Distribution', phone: '+1 800-555-0101', email: 'orders@apexwholesale.com', address: '100 Logistics Blvd, Chicago', balance: 1420.00, active: 1 },
    { id: 2, name: 'FarmFresh Organic Growers', phone: '+1 800-555-0102', email: 'supply@farmfresh.org', address: '42 Valley View Rd, Salinas', balance: 650.00, active: 1 },
    { id: 3, name: 'Artisan Heritage Bakeries', phone: '+1 800-555-0103', email: 'sales@heritagebake.com', address: '15 Millstone Lane, Portland', balance: 320.00, active: 1 },
    { id: 4, name: 'Global Beverage & Roasters', phone: '+1 800-555-0104', email: 'accounts@globalbev.net', address: '80 Harbor Way, Seattle', balance: 0.00, active: 1 }
  ];

  const coupons = [
    { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min_total: 20, expires: '2027-12-31', active: 1 },
    { id: 2, code: 'SAVE5', type: 'fixed', value: 5, min_total: 30, expires: '2027-12-31', active: 1 },
    { id: 3, code: 'VIP15', type: 'percent', value: 15, min_total: 50, expires: '2027-12-31', active: 1 }
  ];

  const branches = [
    { id: 1, name: 'Main Flagship Store', address: '100 Downtown Plaza, Suite 1A', phone: '+1 555-0100', active: 1 },
    { id: 2, name: 'Northside Express Outlet', address: '420 North Metro Ave', phone: '+1 555-0200', active: 1 }
  ];

  const users = [
    { id: 1, username: 'admin', fullname: 'Alexander Vance', role: 'Admin', branch_id: 1, active: 1 },
    { id: 2, username: 'manager', fullname: 'Victoria Sterling', role: 'Manager', branch_id: 1, active: 1 },
    { id: 3, username: 'cashier', fullname: 'James Walker', role: 'Cashier', branch_id: 1, active: 1 }
  ];

  const batches = [
    { id: 1, product_id: 5, batch_no: 'B24-091', expiry: new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10), qty: 4 },
    { id: 2, product_id: 11, batch_no: 'B24-098', expiry: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), qty: 5 },
    { id: 3, product_id: 1, batch_no: 'B24-112', expiry: new Date(Date.now() + 18 * 86400000).toISOString().slice(0, 10), qty: 25 }
  ];

  const shifts = [
    { id: 101, user_id: 1, user_name: 'Alexander Vance', opened: new Date(Date.now() - 4 * 3600000), closed: null, opening: 250.00, expected: 1845.50, counted: null, diff: null, status: 'Open' }
  ];

  const cashMoves = [
    { id: 1, shift_id: 101, type: 'IN', amount: 50.00, note: 'Float change adjustment', created: dStr(0) }
  ];

  const expenses = [
    { id: 1, category: 'Utilities', amount: 185.00, note: 'Store electricity & cooling', created: dStr(2) },
    { id: 2, category: 'Supplies', amount: 48.50, note: 'Thermal receipt paper & bags', created: dStr(1) },
    { id: 3, category: 'Maintenance', amount: 120.00, note: 'Barcode scanner servicing', created: dStr(4) }
  ];

  const purchaseOrders = [
    { id: 1, po_no: 'PO-000101', supplier_id: 1, status: 'Received', total: 640.00, created: dStr(4), supplier: 'Apex Wholesale Distribution' },
    { id: 2, po_no: 'PO-000102', supplier_id: 2, status: 'Open', total: 320.00, created: dStr(1), supplier: 'FarmFresh Organic Growers' }
  ];

  const grn = [
    { id: 1, grn_no: 'GRN-000085', supplier_id: 1, po_id: 1, invoice_ref: 'APX-98214', total: 640.00, paid: 640.00, user_name: 'Alexander Vance', created: dStr(3), supplier: 'Apex Wholesale Distribution' }
  ];

  // Generate 7 days of realistic sales history
  const sales = [];
  const saleItems = [];
  const payments = [];
  let saleIdCounter = 1;
  let itemIdCounter = 1;

  const pastDays = [
    { offset: 6, bills: 28, baseRev: 1420.50 },
    { offset: 5, bills: 34, baseRev: 1890.00 },
    { offset: 4, bills: 31, baseRev: 1650.75 },
    { offset: 3, bills: 42, baseRev: 2310.20 },
    { offset: 2, bills: 46, baseRev: 2580.40 },
    { offset: 1, bills: 39, baseRev: 2150.90 },
    { offset: 0, bills: 32, baseRev: 1745.50 }
  ];

  const methodsList = ['Card', 'Cash', 'Digital', 'Card', 'Cash'];

  pastDays.forEach(day => {
    const saleDate = dStr(day.offset);
    for (let i = 0; i < day.bills; i++) {
      const sId = saleIdCounter++;
      const isVoid = (sId % 37 === 0);
      const cust = (i % 3 === 0) ? customers[i % customers.length] : null;
      const method = methodsList[i % methodsList.length];
      const p1 = products[i % products.length];
      const p2 = products[(i + 3) % products.length];
      const qty1 = (i % 2) + 1;
      const qty2 = (i % 3) + 1;

      const subtotal = Number((p1.price * qty1 + p2.price * qty2).toFixed(2));
      const discount = cust && cust.discount_pct ? Number((subtotal * cust.discount_pct / 100).toFixed(2)) : 0;
      const taxableSub = (p1.taxable ? p1.price * qty1 : 0) + (p2.taxable ? p2.price * qty2 : 0);
      const vat = Number((taxableSub * 0.08).toFixed(2));
      const total = Number((subtotal - discount + vat).toFixed(2));
      const paid = method === 'Cash' ? Math.ceil(total / 10) * 10 : total;
      const change_due = Number((paid - total).toFixed(2));

      const invNo = 'INV-' + String(sId).padStart(6, '0');
      const saleRecord = {
        id: sId,
        invoice_no: invNo,
        customer_id: cust ? cust.id : null,
        customer: cust ? cust.name : 'Walk-in Customer',
        subtotal,
        discount,
        vat,
        total,
        paid,
        change_due,
        method,
        cashier: 'Alexander Vance',
        user_id: 1,
        branch_id: 1,
        shift_id: 101,
        status: isVoid ? 'Void' : 'Completed',
        created: new Date(saleDate.getTime() + (i * 18 * 60000))
      };
      sales.unshift(saleRecord);

      saleItems.push({
        id: itemIdCounter++,
        sale_id: sId,
        product_id: p1.id,
        name: p1.name,
        qty: qty1,
        price: p1.price,
        cost: p1.cost,
        taxable: p1.taxable
      });

      saleItems.push({
        id: itemIdCounter++,
        sale_id: sId,
        product_id: p2.id,
        name: p2.name,
        qty: qty2,
        price: p2.price,
        cost: p2.cost,
        taxable: p2.taxable
      });

      payments.push({
        id: sId,
        sale_id: sId,
        method,
        amount: total
      });
    }
  });

  const settingsStore = {
    name: 'Amectar POS',
    tagline: 'Enterprise Retail & Supermarket Management',
    address: '100 Downtown Plaza, Suite 1A, Metro City',
    phone: '+1 (800) 555-8899',
    email: 'contact@amectarpos.com',
    website: 'https://amectarpos.com',
    vatLabel: 'Sales Tax',
    vatNo: 'TX-94029-US',
    vatRate: '8',
    vatInclusive: '0',
    currency: 'LKR',
    prefix: 'INV-',
    paper: '80mm',
    returnPolicy: 'Goods accepted for refund or exchange within 14 days with receipt.',
    footer: 'Thank you for shopping with us!',
    showVat: '1',
    showCashier: '1',
    showCustomer: '1',
    primary: '#008b7a',
    sidebar: '#008b7a',
    outerBg: '#d8f2ee',
    accent: '#fcc233',
    chartBar: '#c1eef5',
    dark: '0',
    logo: '',
    cashier: 'Johathan Stinson',
    loyaltyEarn: '1',
    loyaltyValue: '0.10',
    tierDisc: 'Silver:2,Gold:5,Platinum:8'
  };

  return {
    isMock: true,
    settings: settingsStore,
    products,
    categories,
    customers,
    suppliers,
    coupons,
    branches,
    users,
    batches,
    shifts,
    cashMoves,
    expenses,
    purchaseOrders,
    grn,
    sales,
    saleItems,
    payments
  };
}

module.exports = { createFallbackDb };

