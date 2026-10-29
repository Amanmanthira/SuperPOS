const crypto=require('crypto'),{shell}=require('electron');
const hash=p=>crypto.createHash('sha256').update(p+'pos').digest('hex');
let cur='System';
const D2="CAST(s.created AS date) BETWEEN @f AND @t AND s.status='Completed'",RG=c=>`CAST(${c} AS date) BETWEEN @f AND @t`;
const REP={
daily:['Daily sales',`SELECT CAST(s.created AS date) [Date],COUNT(*) Bills,SUM(subtotal) Gross,SUM(discount) Discount,SUM(vat) Tax,SUM(total) Net FROM Sales s WHERE ${D2} GROUP BY CAST(s.created AS date) ORDER BY 1`],
weekly:['Weekly sales',`SELECT YEAR(s.created) [Year],DATEPART(week,s.created) [Week],COUNT(*) Bills,SUM(total) Net FROM Sales s WHERE ${D2} GROUP BY YEAR(s.created),DATEPART(week,s.created) ORDER BY 1,2`],
monthly:['Monthly sales',`SELECT FORMAT(s.created,'yyyy-MM') [Month],COUNT(*) Bills,SUM(total) Net FROM Sales s WHERE ${D2} GROUP BY FORMAT(s.created,'yyyy-MM') ORDER BY 1`],
detail:['Sales detail (invoices)',`SELECT s.invoice_no Invoice,s.created [Date],s.cashier Cashier,c.name Customer,s.method Method,s.discount Discount,s.vat Tax,s.total Total FROM Sales s LEFT JOIN Customers c ON c.id=s.customer_id WHERE ${D2} ORDER BY s.id DESC`],
voids:['Voided sales',`SELECT invoice_no Invoice,created [Date],cashier Cashier,total Total FROM Sales s WHERE status='Void' AND ${RG('created')}`],
profit:['Profit & gross margin',`SELECT i.name Product,SUM(i.qty) Qty,SUM(i.qty*i.price) Revenue,SUM(i.qty*ISNULL(i.cost,0)) Cost,SUM(i.qty*(i.price-ISNULL(i.cost,0))) Profit,CASE WHEN SUM(i.qty*i.price)=0 THEN 0 ELSE ROUND(100.0*SUM(i.qty*(i.price-ISNULL(i.cost,0)))/SUM(i.qty*i.price),1) END [Margin %] FROM SaleItems i JOIN Sales s ON s.id=i.sale_id WHERE ${D2} GROUP BY i.name ORDER BY Profit DESC`],
best:['Best-selling products',`SELECT TOP 50 i.name Product,SUM(i.qty) Qty,SUM(i.qty*i.price) Revenue FROM SaleItems i JOIN Sales s ON s.id=i.sale_id WHERE ${D2} GROUP BY i.name ORDER BY Qty DESC`],
slow:['Slow-moving products',`SELECT p.name Product,p.stock Stock,ISNULL(SUM(i.qty),0) Sold FROM Products p LEFT JOIN SaleItems i ON i.product_id=p.id AND i.sale_id IN(SELECT s.id FROM Sales s WHERE ${D2}) WHERE p.active=1 GROUP BY p.name,p.stock ORDER BY Sold,p.stock DESC`],
pay:['Payment method summary',`SELECT p.method Method,COUNT(*) [Count],SUM(p.amount) Amount FROM Payments p JOIN Sales s ON s.id=p.sale_id WHERE ${D2} GROUP BY p.method`],
tax:['Tax report',`SELECT CAST(s.created AS date) [Date],SUM(total-vat) [Sales excl. tax],SUM(vat) Tax,SUM(total) [Sales incl. tax] FROM Sales s WHERE ${D2} GROUP BY CAST(s.created AS date) ORDER BY 1`],
cashier:['Cashier performance',`SELECT s.cashier Cashier,COUNT(*) Bills,SUM(total) Sales,AVG(total) [Avg bill],SUM(discount) Discounts,(SELECT COUNT(*) FROM Sales v WHERE v.cashier=s.cashier AND v.status='Void' AND CAST(v.created AS date) BETWEEN @f AND @t) Voids,(SELECT ISNULL(SUM(total),0) FROM SaleReturns r WHERE r.user_name=s.cashier AND CAST(r.created AS date) BETWEEN @f AND @t) Refunds FROM Sales s WHERE ${D2} GROUP BY s.cashier ORDER BY Sales DESC`],
branches:['Sales by branch',`SELECT ISNULL(b.name,'-') Branch,COUNT(*) Bills,SUM(s.total) Net FROM Sales s LEFT JOIN Branches b ON b.id=s.branch_id WHERE ${D2} GROUP BY b.name`],
grn:['GRN (goods received)',`SELECT g.grn_no GRN,g.created [Date],sp.name Supplier,g.invoice_ref [Invoice ref],g.total Total,g.paid Paid,g.total-g.paid Due,g.user_name [By] FROM GRN g LEFT JOIN Suppliers sp ON sp.id=g.supplier_id WHERE ${RG('g.created')} ORDER BY g.id DESC`],
grni:['GRN items',`SELECT g.grn_no GRN,i.name Product,i.qty Qty,i.cost Cost,i.batch_no Batch,i.expiry Expiry FROM GRNItems i JOIN GRN g ON g.id=i.grn_id WHERE ${RG('g.created')}`],
po:['Purchase orders',`SELECT o.po_no PO,o.created [Date],sp.name Supplier,o.status Status,o.total Total FROM PurchaseOrders o LEFT JOIN Suppliers sp ON sp.id=o.supplier_id WHERE ${RG('o.created')}`],
returns:['Returns & refunds',`SELECT r.return_no [Return],r.created [Date],s.invoice_no Invoice,r.refund_method [Refund as],r.total Total,r.reason Reason,r.user_name [By] FROM SaleReturns r LEFT JOIN Sales s ON s.id=r.sale_id WHERE ${RG('r.created')}`],
stock:['Stock & valuation',`SELECT sku SKU,barcode Barcode,name Product,category Category,stock Stock,cost Cost,price Price,stock*cost [Stock value] FROM Products WHERE active=1 ORDER BY name`],
low:['Low stock',`SELECT name Product,stock Stock,reorder [Reorder level] FROM Products WHERE active=1 AND stock<=reorder ORDER BY stock`],
expiry:['Expiry (next 30 days / expired)',`SELECT p.name Product,b.batch_no Batch,b.expiry Expiry,b.qty Qty FROM Batches b JOIN Products p ON p.id=b.product_id WHERE b.qty>0 AND b.expiry IS NOT NULL AND b.expiry<=DATEADD(day,30,GETDATE()) ORDER BY b.expiry`],
moves:['Stock movements',`SELECT m.created [Date],p.name Product,m.type Type,m.qty Qty,m.ref Ref,m.note Note,m.user_name [By] FROM StockMoves m JOIN Products p ON p.id=m.product_id WHERE ${RG('m.created')} ORDER BY m.id DESC`],
suppliers:['Supplier balances',`SELECT name Supplier,phone Phone,balance [Amount owed] FROM Suppliers WHERE active=1 ORDER BY balance DESC`],
customers:['Customer purchases & loyalty',`SELECT c.name Customer,c.phone Phone,c.tier Tier,c.points Points,c.credit [Store credit],COUNT(s.id) Visits,ISNULL(SUM(s.total),0) Spent FROM Customers c LEFT JOIN Sales s ON s.customer_id=c.id AND ${D2} WHERE c.active=1 GROUP BY c.name,c.phone,c.tier,c.points,c.credit ORDER BY Spent DESC`],
expenses:['Expenses',`SELECT created [Date],category Category,amount Amount,note Note FROM Expenses WHERE ${RG('created')} ORDER BY id DESC`],
shifts:['Shifts & cash reconciliation',`SELECT opened Opened,closed Closed,user_name Cashier,opening Opening,expected Expected,counted Counted,diff [Over/Short],status Status FROM Shifts WHERE ${RG('opened')} ORDER BY id DESC`],
audit:['Audit log',`SELECT created [Date],user_name [User],action Action,detail Detail FROM Audit WHERE ${RG('created')} ORDER BY id DESC`],
pnl:['Profit & loss summary',`SELECT [Sales],[Returns],COGS,Expenses,[Sales]-[Returns]-COGS-Expenses [Net profit] FROM (SELECT (SELECT ISNULL(SUM(total),0) FROM Sales s WHERE ${D2}) [Sales],(SELECT ISNULL(SUM(total),0) FROM SaleReturns WHERE ${RG('created')}) [Returns],(SELECT ISNULL(SUM(i.qty*ISNULL(i.cost,0)),0) FROM SaleItems i JOIN Sales s ON s.id=i.sale_id WHERE ${D2}) COGS,(SELECT ISNULL(SUM(amount),0) FROM Expenses WHERE ${RG('created')}) Expenses) x`]};
const T={categories:['Categories',['name'],0],suppliers:['Suppliers',['name','phone','email','address'],1],expenses:['Expenses',['category','amount','note'],0],coupons:['Coupons',['code','type','value','min_total','expires','active'],0],branches:['Branches',['name','address','phone'],1],customers:['Customers',['name','phone','email','address','tier','discount_pct','credit'],1]};
module.exports=(H,q,db,sql)=>{
 const audit=(a,d)=>q('INSERT Audit(user_name,action,detail)VALUES(@u,@a,@d)',{u:cur,a,d});
 const tx=async f=>{const t=new sql.Transaction(await db());await t.begin();const r=(x,o={})=>{const rq=new sql.Request(t);for(const k in o)rq.input(k,o[k]);return rq.query(x).then(z=>z.recordset||[])};try{const v=await f(r);await t.commit();return v}catch(e){await t.rollback();throw e}};
 const mv=(r,p,type,qty,ref)=>r('INSERT StockMoves(product_id,type,qty,ref,user_name)VALUES(@p,@t,@q,@ref,@u)',{p,t:type,q:qty,ref:ref||'',u:cur});
 for(const k in T){const[tb,cols,soft]=T[k];
  H[k+'.list']=()=>q(`SELECT * FROM ${tb} ${soft?'WHERE active=1':''} ORDER BY id DESC`);
  H[k+'.save']=async o=>{const p={id:o.id};cols.forEach(c=>p[c]=o[c]===''?null:o[c]);
   await q(o.id?`UPDATE ${tb} SET ${cols.map(c=>c+'=@'+c)} WHERE id=@id`:`INSERT ${tb}(${cols})VALUES(${cols.map(c=>'@'+c)})`,p);await audit('SAVE '+k,JSON.stringify(p).slice(0,200))};
  H[k+'.del']=async id=>{await q(soft?`UPDATE ${tb} SET active=0 WHERE id=@id`:`DELETE ${tb} WHERE id=@id`,{id});await audit('DELETE '+k,'#'+id)}}
 H['auth.login']=async o=>{const u=(await q('SELECT id,username,fullname,role,branch_id FROM Users WHERE username=@u AND password=@p AND active=1',{u:o.username,p:hash(o.password)}))[0];if(!u)throw new Error('Invalid username or password');cur=u.fullname;await audit('LOGIN','');return u};
 H['users.list']=()=>q('SELECT id,username,fullname,role,branch_id FROM Users WHERE active=1 ORDER BY id');
 H['users.save']=async u=>{const p={...u,h:u.password?hash(u.password):null};if(u.id)await q('UPDATE Users SET username=@username,fullname=@fullname,role=@role,branch_id=@branch_id'+(p.h?',password=@h':'')+' WHERE id=@id',p);else await q('INSERT Users(username,password,fullname,role,branch_id)VALUES(@username,@h,@fullname,@role,@branch_id)',p)};
 H['users.del']=id=>q('UPDATE Users SET active=0 WHERE id=@id AND username<>\'admin\'',{id});
 H['products.save']=async p=>{if(p.id){const o=(await q('SELECT price FROM Products WHERE id=@id',p))[0];
   await q('UPDATE Products SET sku=@sku,barcode=@barcode,name=@name,category=@category,price=@price,cost=@cost,stock=@stock,reorder=@reorder,taxable=@taxable WHERE id=@id',p);
   if(o&&+o.price!==+p.price)await audit('PRICE CHANGE',`${p.name}: ${o.price} -> ${p.price}`)}
  else{const r=await q('INSERT Products(sku,barcode,name,category,price,cost,stock,reorder,taxable)OUTPUT INSERTED.id VALUES(@sku,@barcode,@name,@category,@price,@cost,@stock,@reorder,@taxable)',p);
   if(+p.stock)await q("INSERT StockMoves(product_id,type,qty,note,user_name)VALUES(@i,'OPENING',@s,'Opening stock',@u)",{i:r[0].id,s:p.stock,u:cur})}};
 H['stock.adjust']=o=>tx(async r=>{await r('UPDATE Products SET stock=stock+@qty WHERE id=@pid',o);await r('INSERT StockMoves(product_id,type,qty,note,user_name)VALUES(@pid,@type,@qty,@note,@u)',{...o,u:cur});await r("INSERT Audit(user_name,action,detail)VALUES(@u,'STOCK ADJUST',@d)",{u:cur,d:`#${o.pid} ${o.qty} ${o.note}`})});
 H['stock.transfer']=o=>q("INSERT StockMoves(product_id,type,qty,branch_id,note,user_name)VALUES(@pid,'TRANSFER_OUT',-@qty,@from,'To branch '+CAST(@to AS NVARCHAR),@u),(@pid,'TRANSFER_IN',@qty,@to,'From branch '+CAST(@from AS NVARCHAR),@u)",{...o,u:cur});
 H['sale.items']=id=>q('SELECT i.*,ISNULL((SELECT SUM(ri.qty) FROM ReturnItems ri JOIN SaleReturns r ON r.id=ri.return_id WHERE r.sale_id=i.sale_id AND ri.product_id=i.product_id),0) returned FROM SaleItems i WHERE sale_id=@id',{id});
 H['sale.pay']=id=>q('SELECT method m,amount a FROM Payments WHERE sale_id=@id',{id});
 H['customer.history']=id=>q('SELECT TOP 100 invoice_no,created,total,status FROM Sales WHERE customer_id=@id ORDER BY id DESC',{id});
 H['coupon.check']=async code=>(await q('SELECT * FROM Coupons WHERE code=@code AND active=1 AND (expires IS NULL OR expires>=CAST(GETDATE() AS date))',{code}))[0]||null;
 H['sale.create']=s=>tx(async r=>{const{items,prefix,payments,...h}=s;
  const id=(await r('INSERT Sales(customer_id,subtotal,discount,vat,total,paid,change_due,method,cashier,user_id,branch_id,shift_id,coupon,points_used,points_earned)OUTPUT INSERTED.id VALUES(@customer_id,@subtotal,@discount,@vat,@total,@paid,@change_due,@method,@cashier,@user_id,@branch_id,@shift_id,@coupon,@points_used,@points_earned)',h))[0].id;
  const inv=(prefix||'INV-')+String(id).padStart(6,'0');await r('UPDATE Sales SET invoice_no=@inv WHERE id=@id',{inv,id});
  for(const i of items){await r('INSERT SaleItems(sale_id,product_id,name,qty,price,taxable,cost)SELECT @id,@pid,@name,@qty,@price,@tax,cost FROM Products WHERE id=@pid',{id,pid:i.id,name:i.name,qty:i.qty,price:i.price,tax:i.taxable?1:0});
   await r('UPDATE Products SET stock=stock-@qty WHERE id=@pid',{qty:i.qty,pid:i.id});await mv(r,i.id,'SALE',-i.qty,inv);
   let left=i.qty;for(const b of await r('SELECT id,qty FROM Batches WHERE product_id=@pid AND qty>0 ORDER BY ISNULL(expiry,\'9999-12-31\')',{pid:i.id})){const d=Math.min(left,b.qty);await r('UPDATE Batches SET qty=qty-@d WHERE id=@b',{d,b:b.id});left-=d;if(left<=0)break}}
  let ch=+h.change_due;for(const x of payments){let a=+x.a;if(x.m==='Cash'&&ch>0){const d=Math.min(ch,a);a-=d;ch-=d}
   if(a>0)await r('INSERT Payments(sale_id,method,amount)VALUES(@id,@m,@a)',{id,m:x.m,a});if(x.m==='Credit'&&h.customer_id)await r('UPDATE Customers SET credit=credit-@a WHERE id=@c',{a,c:h.customer_id})}
  if(h.customer_id)await r('UPDATE Customers SET points=points-@pu+@pe WHERE id=@c',{pu:h.points_used||0,pe:h.points_earned||0,c:h.customer_id});
  return{id,invoice_no:inv,created:new Date()}});
 H['sale.void']=o=>tx(async r=>{const s=(await r('SELECT * FROM Sales WHERE id=@id',o))[0];if(s.status==='Void')throw new Error('Already void');
  await r("UPDATE Sales SET status='Void' WHERE id=@id",o);
  for(const i of await r('SELECT * FROM SaleItems WHERE sale_id=@id',o)){await r('UPDATE Products SET stock=stock+@q WHERE id=@p',{q:i.qty,p:i.product_id});await mv(r,i.product_id,'VOID',i.qty,s.invoice_no)}
  if(s.customer_id){const cr=(await r("SELECT ISNULL(SUM(amount),0) a FROM Payments WHERE sale_id=@id AND method='Credit'",o))[0].a;await r('UPDATE Customers SET points=points+@pu-@pe,credit=credit+@cr WHERE id=@c',{pu:s.points_used||0,pe:s.points_earned||0,cr,c:s.customer_id})}
  await r("INSERT Audit(user_name,action,detail)VALUES(@u,'VOID SALE',@d)",{u:cur,d:s.invoice_no+' '+(o.reason||'')})});
 H['return.create']=o=>tx(async r=>{const s=(await r('SELECT * FROM Sales WHERE id=@id',{id:o.sale_id}))[0];
  const id=(await r('INSERT SaleReturns(sale_id,customer_id,refund_method,total,reason,user_name,shift_id)OUTPUT INSERTED.id VALUES(@sid,@c,@m,@t,@re,@u,@sh)',{sid:o.sale_id,c:s.customer_id,m:o.method,t:o.total,re:o.reason||'',u:cur,sh:o.shift_id||null}))[0].id;
  const no='RET-'+String(id).padStart(6,'0');await r('UPDATE SaleReturns SET return_no=@no WHERE id=@id',{no,id});
  for(const i of o.items){await r('INSERT ReturnItems(return_id,product_id,name,qty,price)VALUES(@id,@p,@n,@q,@pr)',{id,p:i.product_id,n:i.name,q:i.qty,pr:i.price});
   await r('UPDATE Products SET stock=stock+@q WHERE id=@p',{q:i.qty,p:i.product_id});await mv(r,i.product_id,'RETURN',i.qty,no)}
  if(o.method==='Store Credit'&&s.customer_id)await r('UPDATE Customers SET credit=credit+@t WHERE id=@c',{t:o.total,c:s.customer_id});
  await r("INSERT Audit(user_name,action,detail)VALUES(@u,'RETURN',@d)",{u:cur,d:no+' '+o.total});return{id,return_no:no,created:new Date()}});
 H['po.list']=()=>q('SELECT o.*,sp.name supplier FROM PurchaseOrders o LEFT JOIN Suppliers sp ON sp.id=o.supplier_id ORDER BY o.id DESC');
 H['po.items']=id=>q('SELECT product_id,name,qty,cost FROM POItems WHERE po_id=@id',{id});
 H['po.create']=o=>tx(async r=>{const tot=o.items.reduce((a,i)=>a+i.qty*i.cost,0),id=(await r("INSERT PurchaseOrders(supplier_id,status,total)OUTPUT INSERTED.id VALUES(@s,'Open',@t)",{s:o.supplier_id,t:tot}))[0].id;
  await r('UPDATE PurchaseOrders SET po_no=@n WHERE id=@id',{n:'PO-'+String(id).padStart(6,'0'),id});
  for(const i of o.items)await r('INSERT POItems(po_id,product_id,name,qty,cost)VALUES(@id,@p,@n,@q,@c)',{id,p:i.product_id,n:i.name,q:i.qty,c:i.cost});return{id}});
 H['grn.list']=()=>q('SELECT g.*,sp.name supplier FROM GRN g LEFT JOIN Suppliers sp ON sp.id=g.supplier_id ORDER BY g.id DESC');
 H['grn.create']=o=>tx(async r=>{const tot=o.items.reduce((a,i)=>a+i.qty*i.cost,0),paid=+o.paid||0;
  const id=(await r('INSERT GRN(supplier_id,po_id,invoice_ref,total,paid,user_name)OUTPUT INSERTED.id VALUES(@s,@po,@ref,@tot,@paid,@u)',{s:o.supplier_id,po:o.po_id||null,ref:o.invoice_ref||'',tot,paid,u:cur}))[0].id;
  const no='GRN-'+String(id).padStart(6,'0');await r('UPDATE GRN SET grn_no=@no WHERE id=@id',{no,id});
  for(const i of o.items){await r('INSERT GRNItems(grn_id,product_id,name,qty,cost,batch_no,expiry)VALUES(@id,@p,@n,@q,@c,@b,@e)',{id,p:i.product_id,n:i.name,q:i.qty,c:i.cost,b:i.batch_no||null,e:i.expiry||null});
   await r('UPDATE Products SET stock=stock+@q,cost=@c WHERE id=@p',{q:i.qty,c:i.cost,p:i.product_id});await mv(r,i.product_id,'GRN',i.qty,no);
   if(i.batch_no||i.expiry)await r('INSERT Batches(product_id,batch_no,expiry,qty)VALUES(@p,@b,@e,@q)',{p:i.product_id,b:i.batch_no||null,e:i.expiry||null,q:i.qty})}
  await r('UPDATE Suppliers SET balance=balance+@d WHERE id=@s',{d:tot-paid,s:o.supplier_id});
  if(o.po_id)await r("UPDATE PurchaseOrders SET status='Received' WHERE id=@po",{po:o.po_id});return{id,grn_no:no}});
 H['supplier.pay']=o=>tx(async r=>{await r('UPDATE Suppliers SET balance=balance-@a WHERE id=@s',o);await r('INSERT SupPay(supplier_id,amount)VALUES(@s,@a)',o)});
 const sum=async id=>{const s=(await q(`SELECT s.*,ISNULL((SELECT SUM(p.amount) FROM Payments p JOIN Sales x ON x.id=p.sale_id WHERE x.shift_id=s.id AND x.status='Completed' AND p.method='Cash'),0) cash_sales,ISNULL((SELECT SUM(amount) FROM CashMoves WHERE shift_id=s.id AND type='IN'),0) cin,ISNULL((SELECT SUM(amount) FROM CashMoves WHERE shift_id=s.id AND type='OUT'),0) cout,ISNULL((SELECT SUM(total) FROM SaleReturns rr WHERE rr.shift_id=s.id AND rr.refund_method='Cash'),0) cash_ref,(SELECT COUNT(*) FROM Sales x WHERE x.shift_id=s.id AND x.status='Completed') bills,ISNULL((SELECT SUM(total) FROM Sales x WHERE x.shift_id=s.id AND x.status='Completed'),0) sales FROM Shifts s WHERE s.id=@id`,{id}))[0];s.expected=+s.opening+ +s.cash_sales+ +s.cin- +s.cout- +s.cash_ref;return s};
 H['shift.current']=async uid=>(await q("SELECT TOP 1 * FROM Shifts WHERE user_id=@uid AND status='Open'",{uid}))[0]||null;
 H['shift.open']=async o=>{await q("INSERT Shifts(user_id,user_name,opening,status)VALUES(@uid,@u,@op,'Open')",{uid:o.uid,u:cur,op:o.opening});return H['shift.current'](o.uid)};
 H['shift.cash']=o=>q('INSERT CashMoves(shift_id,type,amount,note)VALUES(@sid,@type,@amount,@note)',o);
 H['shift.summary']=sum;
 H['shift.close']=async o=>{const s=await sum(o.id);await q("UPDATE Shifts SET closed=GETDATE(),expected=@e,counted=@c,diff=@d,status='Closed' WHERE id=@id",{e:s.expected,c:o.counted,d:o.counted-s.expected,id:o.id});await audit('SHIFT CLOSE',`#${o.id} expected ${s.expected} counted ${o.counted}`);return{expected:s.expected,counted:o.counted,diff:o.counted-s.expected}};
 H['report.list']=()=>Object.entries(REP).map(([k,v])=>({k,title:v[0]}));
 H['report']=o=>q(REP[o.k][1],{f:o.f,t:o.t});
 H.open=u=>/^(mailto|sms):/.test(u)&&shell.openExternal(u)};
module.exports.schema=[`
IF OBJECT_ID('Users') IS NULL CREATE TABLE Users(id INT IDENTITY PRIMARY KEY,username NVARCHAR(50) UNIQUE,password NVARCHAR(100),fullname NVARCHAR(100),role NVARCHAR(20),branch_id INT NULL,active BIT DEFAULT 1);
IF OBJECT_ID('Branches') IS NULL CREATE TABLE Branches(id INT IDENTITY PRIMARY KEY,name NVARCHAR(100),address NVARCHAR(300),phone NVARCHAR(50),active BIT DEFAULT 1);
IF OBJECT_ID('Categories') IS NULL CREATE TABLE Categories(id INT IDENTITY PRIMARY KEY,name NVARCHAR(100));
IF OBJECT_ID('Suppliers') IS NULL CREATE TABLE Suppliers(id INT IDENTITY PRIMARY KEY,name NVARCHAR(200),phone NVARCHAR(50),email NVARCHAR(100),address NVARCHAR(300),balance DECIMAL(18,2) DEFAULT 0,active BIT DEFAULT 1);
IF OBJECT_ID('Expenses') IS NULL CREATE TABLE Expenses(id INT IDENTITY PRIMARY KEY,category NVARCHAR(100),amount DECIMAL(18,2),note NVARCHAR(300),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('Coupons') IS NULL CREATE TABLE Coupons(id INT IDENTITY PRIMARY KEY,code NVARCHAR(50),type NVARCHAR(10),value DECIMAL(18,2),min_total DECIMAL(18,2) DEFAULT 0,expires DATE NULL,active BIT DEFAULT 1);
IF OBJECT_ID('Payments') IS NULL CREATE TABLE Payments(id INT IDENTITY PRIMARY KEY,sale_id INT,method NVARCHAR(30),amount DECIMAL(18,2));
IF OBJECT_ID('SaleReturns') IS NULL CREATE TABLE SaleReturns(id INT IDENTITY PRIMARY KEY,return_no NVARCHAR(50),sale_id INT,customer_id INT NULL,refund_method NVARCHAR(30),total DECIMAL(18,2),reason NVARCHAR(300),user_name NVARCHAR(100),shift_id INT NULL,created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('ReturnItems') IS NULL CREATE TABLE ReturnItems(id INT IDENTITY PRIMARY KEY,return_id INT,product_id INT,name NVARCHAR(200),qty DECIMAL(18,2),price DECIMAL(18,2));
IF OBJECT_ID('StockMoves') IS NULL CREATE TABLE StockMoves(id INT IDENTITY PRIMARY KEY,product_id INT,type NVARCHAR(20),qty DECIMAL(18,2),ref NVARCHAR(50),branch_id INT NULL,user_name NVARCHAR(100),note NVARCHAR(300),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('Batches') IS NULL CREATE TABLE Batches(id INT IDENTITY PRIMARY KEY,product_id INT,batch_no NVARCHAR(50),expiry DATE NULL,qty DECIMAL(18,2));
IF OBJECT_ID('PurchaseOrders') IS NULL CREATE TABLE PurchaseOrders(id INT IDENTITY PRIMARY KEY,po_no NVARCHAR(50),supplier_id INT,status NVARCHAR(20),total DECIMAL(18,2),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('POItems') IS NULL CREATE TABLE POItems(id INT IDENTITY PRIMARY KEY,po_id INT,product_id INT,name NVARCHAR(200),qty DECIMAL(18,2),cost DECIMAL(18,2));
IF OBJECT_ID('GRN') IS NULL CREATE TABLE GRN(id INT IDENTITY PRIMARY KEY,grn_no NVARCHAR(50),supplier_id INT,po_id INT NULL,invoice_ref NVARCHAR(100),total DECIMAL(18,2),paid DECIMAL(18,2),user_name NVARCHAR(100),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('GRNItems') IS NULL CREATE TABLE GRNItems(id INT IDENTITY PRIMARY KEY,grn_id INT,product_id INT,name NVARCHAR(200),qty DECIMAL(18,2),cost DECIMAL(18,2),batch_no NVARCHAR(50),expiry DATE NULL);
IF OBJECT_ID('SupPay') IS NULL CREATE TABLE SupPay(id INT IDENTITY PRIMARY KEY,supplier_id INT,amount DECIMAL(18,2),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('Shifts') IS NULL CREATE TABLE Shifts(id INT IDENTITY PRIMARY KEY,user_id INT,user_name NVARCHAR(100),opened DATETIME DEFAULT GETDATE(),closed DATETIME NULL,opening DECIMAL(18,2),expected DECIMAL(18,2) NULL,counted DECIMAL(18,2) NULL,diff DECIMAL(18,2) NULL,status NVARCHAR(10));
IF OBJECT_ID('CashMoves') IS NULL CREATE TABLE CashMoves(id INT IDENTITY PRIMARY KEY,shift_id INT,type NVARCHAR(5),amount DECIMAL(18,2),note NVARCHAR(200),created DATETIME DEFAULT GETDATE());
IF OBJECT_ID('Audit') IS NULL CREATE TABLE Audit(id INT IDENTITY PRIMARY KEY,user_name NVARCHAR(100),action NVARCHAR(50),detail NVARCHAR(400),created DATETIME DEFAULT GETDATE());
IF NOT EXISTS(SELECT 1 FROM Users) INSERT Users(username,password,fullname,role)VALUES('admin','${hash('admin')}','Administrator','Admin');
IF NOT EXISTS(SELECT 1 FROM Branches) INSERT Branches(name)VALUES('Main Branch');`,`
IF COL_LENGTH('Products','sku') IS NULL ALTER TABLE Products ADD sku NVARCHAR(100) NULL;
IF COL_LENGTH('Customers','points') IS NULL ALTER TABLE Customers ADD points INT NOT NULL DEFAULT 0;
IF COL_LENGTH('Customers','credit') IS NULL ALTER TABLE Customers ADD credit DECIMAL(18,2) NOT NULL DEFAULT 0;
IF COL_LENGTH('Customers','tier') IS NULL ALTER TABLE Customers ADD tier NVARCHAR(20) NULL;
IF COL_LENGTH('Customers','discount_pct') IS NULL ALTER TABLE Customers ADD discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0;
IF COL_LENGTH('Sales','status') IS NULL ALTER TABLE Sales ADD status NVARCHAR(20) NOT NULL DEFAULT 'Completed';
IF COL_LENGTH('Sales','user_id') IS NULL ALTER TABLE Sales ADD user_id INT NULL;
IF COL_LENGTH('Sales','branch_id') IS NULL ALTER TABLE Sales ADD branch_id INT NULL;
IF COL_LENGTH('Sales','shift_id') IS NULL ALTER TABLE Sales ADD shift_id INT NULL;
IF COL_LENGTH('Sales','coupon') IS NULL ALTER TABLE Sales ADD coupon NVARCHAR(50) NULL;
IF COL_LENGTH('Sales','points_used') IS NULL ALTER TABLE Sales ADD points_used INT NULL;
IF COL_LENGTH('Sales','points_earned') IS NULL ALTER TABLE Sales ADD points_earned INT NULL;
IF COL_LENGTH('SaleItems','cost') IS NULL ALTER TABLE SaleItems ADD cost DECIMAL(18,2) NULL;`];
