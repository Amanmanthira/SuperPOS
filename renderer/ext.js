// Enterprise POS System - Extended Business Logic, Security & Operations
let U = null, SH = null, RL = [], RW = [], L = [], BK = '', BP = [], BS = [], BPO = null, RS = null, RI = [], cust = null, cp = null, pu = 0, pays = [{ m: 'Cash', a: 0 }];
const XS = { loyaltyEarn: '1', loyaltyValue: '0.10', tierDisc: 'Silver:2,Gold:5,Platinum:8' };

const ROLE = {
  Manager: ['dashboard', 'pos', 'sales', 'products', 'categories', 'stock', 'suppliers', 'po', 'grn', 'customers', 'coupons', 'register', 'expenses', 'reports', 'settings'],
  Cashier: ['pos', 'sales', 'customers', 'register'],
  Inventory: ['products', 'categories', 'stock', 'suppliers', 'po', 'grn', 'reports']
};

window.can = k => !U || U.role === 'Admin' || (ROLE[U.role] || []).includes(k);
window.mgr = () => !U || U.role === 'Admin' || U.role === 'Manager';

async function boot() {
  S = { ...XS, ...S };
  login();
}

function login() {
  U = null;
  window.U = null;
  window.SH = null;
  $('#sb').style.display = 'none';
  $('#topbar').style.display = 'none';

  $('#main').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:90vh;background:linear-gradient(135deg, rgba(0,139,122,0.06) 0%, rgba(15,23,42,0.02) 100%)">
      <div style="width:420px;max-width:92vw;background:var(--content-bg);padding:40px 36px;box-shadow:0 24px 60px rgba(0,0,0,0.09);border-radius:24px;border:1.5px solid var(--border);position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg, var(--sb-bg), var(--accent))"></div>
        
        <div style="width:56px;height:56px;border-radius:16px;background:var(--sb-bg);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 10px 24px rgba(0,139,122,0.3)">
          ${ICONS.brand || ICONS.dashboard}
        </div>
        <h2 style="font-family:var(--font-display);font-size:22px;font-weight:900;color:var(--text);margin-bottom:4px;letter-spacing:-0.02em">${esc(S.name)}</h2>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:28px">Enterprise Retail & Supermarket Platform</p>

        <form onsubmit="event.preventDefault();doLogin();" style="text-align:left;display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px">Username / Operator ID</label>
            <div style="position:relative">
              <input id="lu" placeholder="Enter operator username" autocomplete="username" autofocus style="margin:0;padding:12px 14px;border-radius:12px;font-size:14px;font-weight:600" onkeydown="if(event.key==='Enter'){event.preventDefault();$('#lp').focus()}">
            </div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <label style="font-size:11.5px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em">Password</label>
              <span style="font-size:11px;color:var(--text-muted)">Press Enter to Sign In</span>
            </div>
            <div style="position:relative;display:flex;align-items:center">
              <input id="lp" type="password" placeholder="Enter password" autocomplete="current-password" style="margin:0;padding:12px 42px 12px 14px;border-radius:12px;font-size:14px" onkeydown="if(event.key==='Enter'){event.preventDefault();doLogin()}">
              <button type="button" onclick="const p=$('#lp');p.type=p.type==='password'?'text':'password';this.textContent=p.type==='password'?'👁':'🔒'" style="position:absolute;right:10px;background:transparent;border:0;cursor:pointer;font-size:16px;color:var(--text-muted);padding:4px" title="Toggle password visibility">👁</button>
            </div>
          </div>

          <button type="submit" id="login-submit-btn" class="btn" style="width:100%;padding:14px;font-size:14.5px;font-weight:800;border-radius:14px;margin-top:8px;box-shadow:0 6px 18px rgba(0,139,122,0.3)">
            Sign In & Open Register ↵
          </button>
        </form>

        <div style="margin-top:24px;text-align:center;font-size:11px;color:var(--text-muted)">
          Authorized Personnel Only • Amectar Retail Security
        </div>
      </div>
    </div>
  `;
}

const doLogin = guard(async () => {
  const u = ($('#lu')?.value || '').trim();
  const p = ($('#lp')?.value || '').trim();
  if (!u) {
    toast.warning('Please enter your username');
    $('#lu')?.focus();
    return;
  }
  const btn = $('#login-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Authenticating...'; }
  try {
    U = await A('auth.login', { username: u, password: p });
    window.U = U;
    $('#sb').style.display = '';
    $('#topbar').style.display = '';
    SH = await A('shift.current', U.id);
    window.SH = SH;
    toast.success(`Welcome back, ${U.fullname}`);
    go(can('dashboard') ? 'dashboard' : 'pos');
  } catch (err) {
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In & Open Register ↵'; }
    toast.error(err.message || 'Invalid username or password');
    $('#lp')?.focus();
  }
});

const TS = 'sel:Regular,Silver,Gold,Platinum';
F.products.splice(1, 0, ['sku', 'SKU Code']);

Object.assign(F, {
  categories: [['name', 'Category Name']],
  suppliers: [
    ['name', 'Supplier Company Name'],
    ['phone', 'Phone Number'],
    ['email', 'Email Address'],
    ['address', 'Office / Warehouse Address']
  ],
  expenses: [
    ['category', 'Expense Category (Rent, Utilities, Maintenance, etc.)'],
    ['amount', 'Amount Spent', 'number'],
    ['note', 'Description / Reference Note']
  ],
  coupons: [
    ['code', 'Coupon Promo Code'],
    ['type', 'Discount Type', 'sel:percent,fixed'],
    ['value', 'Discount Value', 'number'],
    ['min_total', 'Minimum Order Total', 'number'],
    ['expires', 'Expiration Date', 'date'],
    ['active', 'Status Active', 'check']
  ],
  branches: [
    ['name', 'Branch / Outlet Name'],
    ['address', 'Physical Address'],
    ['phone', 'Contact Number']
  ],
  customers: [
    ['name', 'Customer Name'],
    ['phone', 'Mobile Phone'],
    ['email', 'Email Address'],
    ['address', 'Address'],
    ['tier', 'Loyalty Membership Tier', TS],
    ['discount_pct', 'Special Tier Discount %', 'number'],
    ['credit', 'Initial Store Credit Balance', 'number']
  ],
  users: [
    ['username', 'Login Username'],
    ['password', 'Password (leave blank to keep existing)', 'password'],
    ['fullname', 'Full Staff Name'],
    ['role', 'System Role', 'sel:Admin,Manager,Cashier,Inventory'],
    ['branch_id', 'Assigned Branch ID', 'number']
  ]
});

function edit(k, id) {
  const r = (id && R[k]?.find(x => x.id == id)) || { taxable: 1, reorder: 5, active: 1 };
  const reqFields = ['name', 'category', 'price', 'code', 'value', 'username', 'fullname', 'phone', 'amount'];
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">${id ? 'Edit' : 'Add New'} ${k.slice(0, -1)}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <div class="g2">
      ${(F[k] || []).map(([n, l, t = '']) => {
        const v = r[n];
        const isReq = reqFields.includes(n);
        const reqBadge = isReq ? '<span style="color:var(--danger-text);margin-left:3px">*</span>' : '';
        return t === 'check'
          ? `<label class="ck"><input type="checkbox" id="f_${n}" ${v ? 'checked' : ''}> ${l}</label>`
          : t.startsWith('sel')
            ? `<label>${l}${reqBadge}<select id="f_${n}">${t.slice(4).split(',').map(o => `<option ${o == v ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`
            : `<label>${l}${reqBadge}<input id="f_${n}" type="${t || 'text'}" value="${t === 'password' ? '' : esc(t === 'date' && v ? new Date(v).toISOString().slice(0, 10) : v ?? (t === 'number' ? (n === 'reorder' ? 5 : (n === 'stock' || n === 'cost' ? 0 : '')) : ''))}"></label>`;
      }).join('')}
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="saveRow('${k}',${id || 0})">${ICONS.check} Save Record</button>
    </div>
  `);
}

const cl = `
  <div style="margin-top:16px;display:flex;justify-content:flex-end">
    <button class="ghost" onclick="modal()">Close</button>
  </div>
`;

V.products = () => tbl('products', ['sku', 'barcode', 'name', 'category', 'price', 'stock']);
V.categories = () => tbl('categories', ['name']);
V.coupons = () => tbl('coupons', ['code', 'type', 'value', 'min_total', 'expires', 'active']);
V.expenses = () => tbl('expenses', ['created', 'category', 'amount', 'note']);
V.branches = () => tbl('branches', ['id', 'name', 'address', 'phone']);
V.users = () => tbl('users', ['username', 'fullname', 'role', 'branch_id']);

V.customers = async () => {
  const r = await A('customers.list');
  R.customers = r;
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Customer Relationship Management (CRM)</h1>
        <p>Customer accounts, loyalty points, discount tiers, and store credit.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn" onclick="edit('customers')">+ New Customer</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">${ICONS.customers} Registered Accounts (${r.length})</div>
        <div style="width:240px">
          <input placeholder="Search customers..." oninput="filterTable('customers', this.value)" style="margin:0">
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="t" id="tbl-customers">
          <tr>
            <th>Customer Name</th>
            <th>Contact Phone</th>
            <th>Tier</th>
            <th>Loyalty Points</th>
            <th>Store Credit</th>
            <th style="text-align:right">Actions</th>
          </tr>
          ${r.map(c => `
            <tr>
              <td><b>${esc(c.name)}</b></td>
              <td>${esc(c.phone || '-')}</td>
              <td><span class="badge ${c.tier === 'Platinum' ? 'info' : c.tier === 'Gold' ? 'warning' : 'neutral'}">${c.tier || 'Regular'}</span></td>
              <td><span style="font-weight:600;color:var(--primary)">⭐ ${c.points || 0}</span> pts</td>
              <td><b>${money(c.credit || 0)}</b></td>
              <td style="text-align:right">
                <button class="ghost sm" onclick="hist(${c.id})">History</button>
                <button class="ghost sm" onclick="edit('customers',${c.id})">Edit</button>
                <button class="ghost sm" style="color:var(--danger)" onclick="del('customers',${c.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
};

const hist = guard(async id => {
  const h = await A('customer.history', id);
  const c = R.customers?.find(x => x.id === id);
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Purchase History: ${esc(c ? c.name : 'Customer')}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <div style="max-height:360px;overflow-y:auto">
      ${h.map(x => `
        <div class="r2" style="border-bottom:1px solid var(--border-subtle);padding:8px 0">
          <div>
            <code>${x.invoice_no}</code>
            <small style="display:block">${new Date(x.created).toLocaleDateString()} • ${new Date(x.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
          </div>
          <div style="text-align:right">
            <b>${money(x.total)}</b>
            ${x.status === 'Void' ? '<span class="badge danger" style="margin-left:6px">Void</span>' : ''}
          </div>
        </div>
      `).join('') || '<small>No previous transactions recorded</small>'}
    </div>
    ${cl}
  `);
});

V.suppliers = async () => {
  const r = await A('suppliers.list');
  R.suppliers = r;
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Suppliers & Vendor Accounts</h1>
        <p>Supplier contacts, open balances, and payment records.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn" onclick="edit('suppliers')">+ Add Supplier</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">${ICONS.suppliers} Vendor Directory (${r.length})</div>
      </div>
      <table class="t">
        <tr>
          <th>Company Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Outstanding Owed</th>
          <th style="text-align:right">Actions</th>
        </tr>
        ${r.map(c => `
          <tr>
            <td><b>${esc(c.name)}</b></td>
            <td>${esc(c.phone || '-')}</td>
            <td>${esc(c.email || '-')}</td>
            <td style="color:${+c.balance > 0 ? 'var(--danger)' : 'inherit'};font-weight:600">${money(c.balance || 0)}</td>
            <td style="text-align:right">
              <button class="ghost sm" onclick="spay(${c.id})">Record Payment</button>
              <button class="ghost sm" onclick="edit('suppliers',${c.id})">Edit</button>
              <button class="ghost sm" style="color:var(--danger)" onclick="del('suppliers',${c.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
};

const spay = id => {
  const s = R.suppliers?.find(x => x.id === id);
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Record Payment to ${esc(s ? s.name : 'Supplier')}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <p style="color:var(--text-secondary);font-size:13px">Current Balance Owed: <b>${money(s ? s.balance : 0)}</b></p>
    <label>Payment Amount <span style="color:var(--danger-text)">*</span>
      <input id="sa" type="number" step="0.01" autofocus value="${s ? s.balance : ''}">
    </label>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="dospay(${id})">Confirm Payment</button>
    </div>
  `);
};

const dospay = guard(async id => {
  const val = ($('#sa')?.value || '').trim();
  const amt = +val;
  if (!val || isNaN(amt) || amt <= 0) return markInvalid('sa', 'Please enter a valid payment amount greater than zero');
  await A('supplier.pay', { s: id, a: amt });
  modal();
  toast.success('Supplier payment recorded successfully!');
  go('suppliers');
});

V.stock = async () => {
  P = await A('products.list');
  const ex = await A('report', { k: 'expiry', f: '2000-01-01', t: '2100-01-01' });
  const low = P.filter(p => +p.stock <= +p.reorder);
  const totalValuation = P.reduce((a, p) => a + (+p.stock * (+p.cost || 0)), 0);
  const totalUnits = P.reduce((a, p) => a + +p.stock, 0);

  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Inventory & Stock Valuation</h1>
        <p>Monitor real-time warehouse stock, batch expiry schedules, and valuations.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn sm" onclick="go('po')">+ Purchase Order</button>
        <button class="ghost sm" onclick="go('grn')">+ Stock In (GRN)</button>
      </div>
    </div>

    <!-- Stock Valuation KPI Row -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Total Inventory Valuation</span>
        <div class="kpi-value" style="color:var(--primary)">${money(totalValuation)}</div>
        <div class="kpi-footer">Based on product cost prices</div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total Units on Hand</span>
        <div class="kpi-value">${totalUnits.toLocaleString()} <span style="font-size:14px;color:var(--text-muted)">units</span></div>
        <div class="kpi-footer">Across ${P.length} active SKUs</div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Reorder Level Alerts</span>
        <div class="kpi-value" style="color:${low.length ? 'var(--warning)' : 'var(--success)'}">${low.length} <span style="font-size:14px;color:var(--text-muted)">items</span></div>
        <div class="kpi-footer"><span class="badge ${low.length ? 'warning' : 'success'}">${low.length ? 'Low Stock' : 'Adequate'}</span></div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Batches Near Expiry</span>
        <div class="kpi-value" style="color:${ex.length ? 'var(--danger)' : 'var(--success)'}">${ex.length} <span style="font-size:14px;color:var(--text-muted)">batches</span></div>
        <div class="kpi-footer">Expiring within 30 days</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${ICONS.stock} Inventory Stock Roster (${P.length} SKUs)</div>
        <div style="width:240px">
          <input placeholder="Filter stock..." oninput="filterTable('stock', this.value)" style="margin:0">
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="t" id="tbl-stock">
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Stock on Hand</th>
            <th>Reorder Min</th>
            <th>Valuation</th>
            <th style="text-align:right">Stock Actions</th>
          </tr>
          ${P.map(p => {
            const isLow = +p.stock <= +p.reorder;
            const isZero = +p.stock <= 0;
            return `
              <tr>
                <td><code>${esc(p.sku || '-')}</code></td>
                <td><b>${esc(p.name)}</b></td>
                <td><span class="badge neutral">${esc(p.category || 'General')}</span></td>
                <td>
                  <span class="badge ${isZero ? 'danger' : isLow ? 'warning' : 'success'}">
                    ${p.stock} units
                  </span>
                </td>
                <td>${p.reorder}</td>
                <td><b>${money(p.stock * p.cost)}</b></td>
                <td style="text-align:right">
                  <button class="ghost sm" onclick="adj(${p.id})">Adjust</button>
                  <button class="ghost sm" onclick="xfer(${p.id})">Transfer</button>
                </td>
              </tr>
            `;
          }).join('')}
        </table>
      </div>
    </div>
  `;
};

const adj = id => {
  const p = P.find(x => x.id == id);
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Stock Adjustment: ${esc(p.name)}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <p style="color:var(--text-secondary);font-size:13px">Current Stock on Hand: <b>${p.stock} units</b></p>
    <label>Adjustment Quantity <span style="color:var(--danger-text)">*</span>
      <input id="aq" type="number" placeholder="e.g. +10 to add, -5 to reduce" autofocus>
    </label>
    <label>Adjustment Reason
      <select id="ar">
        <option>Physical Count Reconciliation</option>
        <option>Damaged Goods</option>
        <option>Expired Stock Write-off</option>
        <option>Theft / Shrinkage</option>
        <option>Internal Store Use</option>
      </select>
    </label>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="doAdj(${id})">Apply Adjustment</button>
    </div>
  `);
};

const doAdj = guard(async id => {
  const val = ($('#aq')?.value || '').trim();
  const qty = +val;
  if (!val || isNaN(qty) || qty === 0) return markInvalid('aq', 'Please enter a non-zero adjustment quantity');
  await A('stock.adjust', { pid: id, qty, type: 'ADJUST', note: $('#ar').value });
  modal();
  toast.success('Stock adjusted successfully!');
  go('stock');
});

const xfer = guard(async id => {
  const B = await A('branches.list');
  const o = B.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('');
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Branch Stock Transfer</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <label>Transfer Quantity <span style="color:var(--danger-text)">*</span>
      <input id="tq" type="number" min="1" value="1" autofocus>
    </label>
    <div class="g2">
      <label>Source Branch<select id="tf">${o}</select></label>
      <label>Destination Branch<select id="tt2">${o}</select></label>
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="doX(${id})">Dispatch Transfer</button>
    </div>
  `);
});

const doX = guard(async id => {
  const val = ($('#tq')?.value || '').trim();
  const qty = +val;
  if (!val || isNaN(qty) || qty <= 0) return markInvalid('tq', 'Please enter a transfer quantity greater than 0');
  const from = +$('#tf')?.value;
  const to = +$('#tt2')?.value;
  if (from === to) return markInvalid('tt2', 'Source and destination branches cannot be the same');
  await A('stock.transfer', { pid: id, qty, from, to });
  modal();
  toast.success('Stock transfer dispatched!');
  go('stock');
});

async function build(kind, pre) {
  BK = kind;
  [BP, BS] = await Promise.all([A('products.list'), A('suppliers.list')]);
  L = pre ? pre.items : [];
  BPO = pre ? pre.po : null;

  modal(`
    <div class="mb-header">
      <h3 style="margin:0">New ${kind === 'po' ? 'Purchase Order (PO)' : 'Goods Received Note (GRN)'}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <label>Select Vendor / Supplier
      <select id="bs">
        ${BS.map(s => `<option value="${s.id}" ${pre && pre.sid == s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
      </select>
    </label>

    <div id="bl" style="margin:12px 0;background:var(--surface-subtle);border-radius:var(--radius-md);padding:10px"></div>

    <div style="border:1px dashed var(--border);border-radius:var(--radius-md);padding:12px;margin:12px 0">
      <div style="font-weight:600;font-size:12px;margin-bottom:6px">Add Line Item</div>
      <label>Product Item
        <select id="bp">
          ${BP.map(p => `<option value="${p.id}">${esc(p.name)} (${money(p.cost)})</option>`).join('')}
        </select>
      </label>
      <div class="g2">
        <label>Quantity<input id="bq" type="number" min="1" value="1"></label>
        <label>Unit Cost<input id="bc" type="number" step="0.01"></label>
      </div>
      ${kind === 'grn' ? `
        <div class="g2">
          <label>Batch / Lot No<input id="bb" placeholder="e.g. BATCH-01"></label>
          <label>Expiration Date<input id="be" type="date"></label>
        </div>
      ` : ''}
      <button class="ghost sm" style="width:100%" onclick="addL()">+ Add Item Line</button>
    </div>

    ${kind === 'grn' ? `
      <div class="g2">
        <label>Supplier Invoice Ref<input id="br" placeholder="INV-SUP-01"></label>
        <label>Amount Paid Now<input id="bpd" type="number" value="0"></label>
      </div>
    ` : ''}

    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="saveB()">${ICONS.check} Save ${kind === 'po' ? 'Purchase Order' : 'GRN'}</button>
    </div>
  `);
  lineR();
}

function addL() {
  const p = BP.find(x => x.id == $('#bp').value);
  if (!p) return toast.warning('Please select a valid product');
  const qty = +$('#bq')?.value;
  if (!qty || qty <= 0) return markInvalid('bq', 'Quantity must be at least 1');
  const costInput = $('#bc')?.value;
  const cost = costInput !== '' && costInput != null ? +costInput : +p.cost;
  if (isNaN(cost) || cost < 0) return markInvalid('bc', 'Cost price cannot be negative');

  L.push({
    product_id: p.id,
    name: p.name,
    qty,
    cost,
    batch_no: $('#bb') ? $('#bb').value.trim() : '',
    expiry: $('#be') ? $('#be').value : ''
  });
  lineR();
  toast.info(`Added ${p.name} (${qty} units)`);
}

function lineR() {
  const el = $('#bl');
  if (!el) return;
  if (!L.length) {
    el.innerHTML = '<small style="color:var(--text-muted)">No item lines added yet.</small>';
    return;
  }
  const tot = L.reduce((a, l) => a + l.qty * l.cost, 0);
  el.innerHTML = L.map((l, i) => `
    <div class="r2" style="border-bottom:1px solid var(--border-subtle);padding:6px 0">
      <div>
        <b>${esc(l.name)}</b>
        <small style="display:block">${l.qty} units × ${money(l.cost)}</small>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <b>${money(l.qty * l.cost)}</b>
        <button class="ghost sm" style="color:var(--danger);padding:2px 6px" onclick="L.splice(${i},1);lineR()">✕</button>
      </div>
    </div>
  `).join('') + `
    <div class="r2" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
      <b>Total Valuation</b>
      <b style="color:var(--primary);font-size:15px">${money(tot)}</b>
    </div>
  `;
}

const saveB = guard(async () => {
  const sid = +$('#bs')?.value;
  if (!sid) return markInvalid('bs', 'Please select a supplier');
  if (!L.length) return toast.warning('Please add at least one line item to the order');
  const o = { supplier_id: sid, items: L };
  if (BK === 'grn') {
    const ref = ($('#br')?.value || '').trim();
    if (!ref) return markInvalid('br', 'Please enter supplier invoice / delivery reference');
    o.po_id = BPO;
    o.invoice_ref = ref;
    const paid = +$('#bpd')?.value || 0;
    if (paid < 0) return markInvalid('bpd', 'Amount paid cannot be negative');
    o.paid = paid;
  }
  await A(BK + '.create', o);
  modal();
  toast.success(`${BK === 'po' ? 'Purchase Order' : 'GRN'} created successfully!`);
  go(BK);
});

V.po = async () => {
  const r = await A('po.list');
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Purchase Orders (PO)</h1>
        <p>Order stock from suppliers and convert orders into received inventory.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn" onclick="build('po')">+ New Purchase Order</button>
      </div>
    </div>
    <div class="card">
      <table class="t">
        <tr>
          <th>PO Number</th>
          <th>Date Created</th>
          <th>Supplier</th>
          <th>Status</th>
          <th>Order Total</th>
          <th style="text-align:right">Actions</th>
        </tr>
        ${r.map(o => `
          <tr>
            <td><code>${o.po_no}</code></td>
            <td>${new Date(o.created).toLocaleDateString()}</td>
            <td><b>${esc(o.supplier)}</b></td>
            <td><span class="badge ${o.status === 'Received' ? 'success' : 'info'}">${o.status}</span></td>
            <td><b>${money(o.total)}</b></td>
            <td style="text-align:right">
              ${o.status === 'Open' ? `<button class="btn sm" onclick="recv(${o.id},${o.supplier_id})">Receive (GRN)</button>` : '<span style="color:var(--text-muted);font-size:11px">Fulfilled</span>'}
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
};

const recv = guard(async (id, sid) => {
  build('grn', {
    items: (await A('po.items', id)).map(i => ({ ...i, batch_no: '', expiry: '' })),
    po: id,
    sid
  });
});

V.grn = async () => {
  const r = await A('grn.list');
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Goods Received Notes (GRN)</h1>
        <p>Record verified stock deliveries, batch codes, and supplier invoices.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn" onclick="build('grn')">+ New GRN</button>
      </div>
    </div>
    <div class="card">
      <table class="t">
        <tr>
          <th>GRN Number</th>
          <th>Date Received</th>
          <th>Supplier</th>
          <th>Supplier Invoice Ref</th>
          <th>Total Received</th>
          <th>Paid Amount</th>
        </tr>
        ${r.map(o => `
          <tr>
            <td><code>${o.grn_no}</code></td>
            <td>${new Date(o.created).toLocaleDateString()}</td>
            <td><b>${esc(o.supplier)}</b></td>
            <td>${esc(o.invoice_ref || '-')}</td>
            <td><b>${money(o.total)}</b></td>
            <td><span class="badge ${+o.paid >= +o.total ? 'success' : 'warning'}">${money(o.paid)}</span></td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
};

V.register = async () => {
  SH = await A('shift.current', U.id);
  window.SH = SH;
  updateTopbar();

  let h = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Cash Register & Shifts</h1>
        <p>Manage cash drawer reconciliations, floats, petty cash, and daily shift closes.</p>
      </div>
    </div>
  `;

  if (!SH) {
    h += `
      <div class="card" style="max-width:440px;margin:30px auto;text-align:center">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--warning-light);color:var(--warning);margin:0 auto 14px;display:flex;align-items:center;justify-content:center">
          ${ICONS.register}
        </div>
        <h2>Open Cash Register Shift</h2>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px">
          Enter the starting cash drawer float to begin ringing up sales.
        </p>
        <div style="text-align:left">
          <label>Starting Cash Float (${S.currency})
            <input id="oc" type="number" step="0.01" value="200.00" class="big" autofocus>
          </label>
          <button class="btn" style="width:100%;padding:12px;margin-top:10px" onclick="openSh()">
            Open Shift & Unlock Terminal
          </button>
        </div>
      </div>
    `;
  } else {
    const s = await A('shift.summary', SH.id);
    h += `
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Opening Float</span>
          <div class="kpi-value">${money(s.opening)}</div>
          <div class="kpi-footer">Drawer starting amount</div>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Cash Sales</span>
          <div class="kpi-value" style="color:var(--success)">${money(s.cash_sales)}</div>
          <div class="kpi-footer">From ${s.bills} transactions</div>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Cash In (Float)</span>
          <div class="kpi-value">${money(s.cin)}</div>
          <div class="kpi-footer">Added mid-shift</div>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Cash Out (Paid Out)</span>
          <div class="kpi-value" style="color:var(--danger)">${money(s.cout)}</div>
          <div class="kpi-footer">Expenses / Petty cash</div>
        </div>
      </div>

      <div class="g2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">${ICONS.dollar} Drawer Adjustments (Cash In / Out)</div>
          </div>
          <label>Amount (${S.currency})
            <input id="ca" type="number" step="0.01" placeholder="50.00">
          </label>
          <label>Reason / Reference Note
            <input id="cn" placeholder="e.g. Bank change, supplies, float top-up">
          </label>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn" style="flex:1" onclick="cm('IN')">+ Cash In</button>
            <button class="ghost" style="flex:1" onclick="cm('OUT')">− Cash Out</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">${ICONS.register} Shift Reconciliation & Close</div>
            <span class="badge success">Shift #${SH.id} Active</span>
          </div>
          <div style="background:var(--surface-subtle);padding:14px;border-radius:var(--radius-md);margin-bottom:14px">
            <div class="r2"><span>Expected Drawer Cash</span><b>${money(s.expected)}</b></div>
            <div class="r2"><span>Gross Shift Volume</span><b>${money(s.sales)}</b></div>
          </div>
          <label>Actual Physical Counted Cash
            <input id="cc" type="number" step="0.01" class="big" placeholder="Enter counted amount">
          </label>
          <button class="btn danger" style="width:100%;padding:12px;margin-top:10px" onclick="closeSh()">
            Close Shift & Reconcile Drawer
          </button>
        </div>
      </div>
    `;
  }

  $('#main').innerHTML = h;
};

const openSh = guard(async () => {
  const val = ($('#oc')?.value || '').trim();
  const opening = +val;
  if (!val || isNaN(opening) || opening < 0) return markInvalid('oc', 'Please enter a valid starting cash float (0 or higher)');
  SH = await A('shift.open', { uid: U.id, opening });
  window.SH = SH;
  toast.success('Cash register shift opened!');
  go('register');
});

const cm = guard(async t => {
  const val = ($('#ca')?.value || '').trim();
  const amount = +val;
  if (!val || isNaN(amount) || amount <= 0) return markInvalid('ca', 'Please enter a valid cash amount greater than zero');
  const note = ($('#cn')?.value || '').trim();
  if (!note) return markInvalid('cn', 'Please provide a reference note for this cash move');
  await A('shift.cash', { sid: SH.id, type: t, amount, note });
  toast.success(`Recorded Cash ${t} of ${money(amount)}`);
  go('register');
});

const closeSh = guard(async () => {
  const val = ($('#cc')?.value || '').trim();
  const counted = +val;
  if (!val || isNaN(counted) || counted < 0) return markInvalid('cc', 'Please enter counted cash amount in drawer');
  const r = await A('shift.close', { id: SH.id, counted });
  SH = null;
  window.SH = null;
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">${ICONS.check} Shift Closed & Reconciled</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <div class="r2"><span>Expected Cash</span><b>${money(r.expected)}</b></div>
    <div class="r2"><span>Physical Count</span><b>${money(r.counted)}</b></div>
    <div class="r2" style="font-size:15px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
      <span>Difference (${r.diff < 0 ? 'Shortage' : 'Over'})</span>
      <b style="color:${r.diff < 0 ? 'var(--danger-text)' : 'var(--success-text)'}">${money(Math.abs(r.diff))}</b>
    </div>
    ${cl}
  `);
  go('register');
});

V.sales = async () => {
  const r = await A('sales.list');
  R.sales = r;
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Sales Ledger & Returns</h1>
        <p>View transaction receipts, process refunds, and manager voids.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">${ICONS.sales} Invoices Log (${r.length} entries)</div>
        <div style="width:240px">
          <input placeholder="Filter invoices..." oninput="filterTable('sales', this.value)" style="margin:0">
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="t" id="tbl-sales">
          <tr>
            <th>Invoice</th>
            <th>Date & Time</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th style="text-align:right">Actions</th>
          </tr>
          ${r.map(s => `
            <tr style="opacity:${s.status === 'Void' ? 0.5 : 1}">
              <td><code>${s.invoice_no}</code></td>
              <td>${new Date(s.created).toLocaleString()}</td>
              <td>${esc(s.customer || 'Walk-in')}</td>
              <td><span class="badge neutral">${s.method}</span></td>
              <td><b>${money(s.total)}</b></td>
              <td><span class="badge ${s.status === 'Void' ? 'danger' : 'success'}">${s.status || 'Completed'}</span></td>
              <td style="text-align:right">
                <button class="ghost sm" onclick="rePrint(${s.id})">Reprint</button>
                ${s.status === 'Completed' ? `
                  <button class="ghost sm" onclick="retM(${s.id})">Return</button>
                  ${mgr() ? `<button class="ghost sm" style="color:var(--danger)" onclick="voidM(${s.id})">Void</button>` : ''}
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
};

const rePrint = guard(async id => {
  const s = R.sales.find(x => x.id == id);
  const [it, py] = await Promise.all([A('sale.items', id), A('sale.pay', id)]);
  showRc(receipt({ ...s, payments: py }, it));
});

const voidM = id => {
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Void Transaction</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <p style="color:var(--danger-text);font-size:13px;line-height:1.4">
      Warning: Voiding this invoice will restore all product inventory and reverse customer loyalty points & credit.
    </p>
    <label>Reason for Void <span style="color:var(--danger-text)">*</span>
      <input id="vr" placeholder="e.g. Cashier scanning mistake, test invoice" autofocus>
    </label>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn danger" onclick="doVoid(${id})">Confirm Void</button>
    </div>
  `);
};

const doVoid = guard(async id => {
  const reason = ($('#vr')?.value || '').trim();
  if (!reason) return markInvalid('vr', 'Please enter a reason for voiding this transaction');
  await A('sale.void', { id, reason });
  modal();
  toast.success('Sale transaction voided and stock restored.');
  go('sales');
});

const retM = guard(async id => {
  const s = R.sales.find(x => x.id == id);
  const it = await A('sale.items', id);
  RS = s;
  RI = it;
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">Process Return — ${s.invoice_no}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">
      ${it.map((i, n) => `
        <label>${esc(i.name)} (max returnable: ${i.qty - (i.returned || 0)})
          <input id="rq${n}" type="number" min="0" max="${i.qty - (i.returned || 0)}" value="0">
        </label>
      `).join('')}
    </div>
    <div class="g2">
      <label>Refund Tender
        <select id="rm">
          <option>Cash</option>
          <option>Card</option>
          ${s.customer_id ? '<option>Store Credit</option>' : ''}
        </select>
      </label>
      <label>Return Reason <span style="color:var(--danger-text)">*</span>
        <input id="rr" placeholder="Defective / Customer changed mind">
      </label>
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="doRet()">Issue Refund & Restock</button>
    </div>
  `);
});

const doRet = guard(async () => {
  const items = RI.map((i, n) => ({
    ...i,
    qty: Math.min(+$('#rq' + n).value, i.qty - (i.returned || 0))
  })).filter(i => i.qty > 0);

  if (!items.length) return toast.warning('Select at least one item quantity to return');
  const reason = ($('#rr')?.value || '').trim();
  if (!reason) return markInvalid('rr', 'Please specify a reason for this return');
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
  const t = calc(items, RS.subtotal ? sub * RS.discount / RS.subtotal : 0);

  const o = {
    sale_id: RS.id,
    items: items.map(i => ({ product_id: i.product_id, name: i.name, qty: i.qty, price: i.price, taxable: i.taxable })),
    method: $('#rm').value,
    reason,
    total: +m(t.total),
    shift_id: SH && SH.id
  };

  const r = await A('return.create', o);
  modal();
  showRc(receipt({
    ...o,
    ...r,
    title: 'CREDIT NOTE / RETURN',
    invoice_no: r.return_no,
    subtotal: t.sub,
    discount: t.disc,
    vat: t.vat,
    paid: o.total,
    change_due: 0,
    cashier: U.fullname,
    customer: RS.customer,
    method: 'Refund: ' + o.method
  }, o.items));
  toast.success(`Return ${r.return_no} processed!`);
  go('sales');
});

const tierPct = () => {
  if (!cust) return 0;
  const t = Object.fromEntries((S.tierDisc || '').split(',').map(x => x.split(':')));
  return (+t[cust.tier] || 0) + +cust.discount_pct;
};

function totals() {
  const sub = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const cd = cp && sub >= +cp.min_total ? (cp.type === 'percent' ? sub * cp.value / 100 : +cp.value) : 0;
  const D = Math.min(sub, disc + cd + sub * tierPct() / 100 + pu * (+S.loyaltyValue || 0));
  const t = calc(cart, D);
  t.cd = cd;
  t.earn = cust ? Math.floor(t.total / 100 * (+S.loyaltyEarn || 0)) : 0;
  return t;
}

window.setCu = v => {
  cust = C.find(c => c.id == v) || null;
  pu = 0;
  cartR();
};

window.setPu = v => {
  pu = Math.min(Math.floor(+v || 0), cust ? cust.points : 0);
  cartR();
};

window.applyCp = guard(async () => {
  const code = ($('#cpn')?.value || '').trim();
  if (!code) return;
  cp = await A('coupon.check', code);
  window.cp = cp;
  if (!cp) toast.warning('Invalid or expired coupon code');
  else toast.success(`Applied coupon: ${cp.code}`);
  cartR();
});

window.clr = () => {
  cart = [];
  disc = 0;
  cp = null;
  window.cp = null;
  pu = 0;
  pays = [{ m: 'Cash', a: 0 }];
  go('pos');
};

function payR() {
  const py = $('#py');
  if (!py) return;

  const T = totals();
  if (pays.length === 1 && !pays[0].t && T.total > 0) {
    pays[0].a = +m(T.total);
  }

  py.innerHTML = `
    <div style="font-weight:700;font-size:11.5px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;margin:6px 0 4px">Payment Tender</div>
    ${pays.map((p, i) => `
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
        <b style="width:75px;font-size:12.5px;color:var(--primary)">${p.m}</b>
        <input type="number" step="0.01" value="${p.a}" oninput="pays[${i}].a=+this.value;pays[${i}].t=1;sumR()" style="margin:0;font-weight:700">
        ${pays.length > 1 ? `<button class="ghost sm" onclick="pays.splice(${i},1);payR()">✕</button>` : ''}
      </div>
    `).join('')}
    <div style="display:flex;gap:4px;margin:6px 0">
      ${['Cash', 'Card', 'Digital', 'Credit'].map(x => `
        <button class="ghost sm" onclick="pays.push({m:'${x}',a:Math.max(0,+(totals().total-pays.reduce((a,p)=>a+ +p.a,0)).toFixed(2)),t:1});payR()">+${x}</button>
      `).join('')}
    </div>
    <div id="sm"></div>
  `;
  sumR();
}

function sumR() {
  const T = totals();
  const pd = pays.reduce((a, p) => a + +p.a, 0);
  const sm = $('#sm');
  if (!sm) return;
  sm.innerHTML = `
    <div class="r2"><span>Total Paid</span><b>${money(pd)}</b></div>
    <div class="r2" style="font-size:14px;padding-top:4px;border-top:1px solid var(--border)">
      <b>${pd >= T.total ? 'Change Due' : 'Balance Remaining'}</b>
      <b style="color:${pd >= T.total ? 'var(--success-text)' : 'var(--danger-text)'}">${money(Math.abs(pd - T.total))}</b>
    </div>
  `;
}

charge = guard(async () => {
  if (!cart.length) return toast.warning('Your cart is empty');
  if (!SH) return toast.warning('Please open a cash register shift first (Cash Register)');
  const T = totals();

  const cashInput = $('#pos-tender-cash');
  if (cashInput && cashInput.value) {
    pays[0].a = +cashInput.value;
    pays[0].t = 1;
  } else if (pays.length === 1 && !pays[0].t && T.total > 0) {
    pays[0].a = +m(T.total);
  }

  const pd = pays.reduce((a, p) => a + +p.a, 0);

  if (pd < +m(T.total) - 0.001) return toast.warning('Total payment tendered is less than the order amount');
  const cr = pays.filter(p => p.m === 'Credit').reduce((a, p) => a + +p.a, 0);
  if (cr && (!cust || cr > cust.credit)) return toast.warning('Insufficient customer store credit balance');

  const s = {
    customer_id: cust ? cust.id : null,
    subtotal: +m(T.sub),
    discount: +m(T.disc),
    vat: +m(T.vat),
    total: +m(T.total),
    paid: pd,
    change_due: +m(pd - T.total),
    method: pays.filter(p => p.a > 0).map(p => p.m).join('+'),
    cashier: U ? U.fullname : S.cashier,
    user_id: U ? U.id : 1,
    branch_id: U ? U.branch_id : 1,
    shift_id: SH.id,
    coupon: cp ? cp.code : null,
    points_used: pu,
    points_earned: T.earn,
    prefix: S.prefix,
    items: cart,
    payments: pays.filter(p => p.a > 0)
  };

  const r = await A('sale.create', s);
  const h = receipt({ ...s, ...r, customer: cust && cust.name, points_bal: cust ? cust.points - pu + T.earn : null }, cart);
  cart = [];
  disc = 0;
  cp = null;
  window.cp = null;
  pu = 0;
  pays = [{ m: 'Cash', a: 0 }];
  await go('pos');
  showRc(h);
  printRc(h);
  toast.success(`Transaction ${r.invoice_no} finalized!`);
  setTimeout(() => $('#q')?.focus(), 250);
});

V.reports = async () => {
  RL = await A('report.list');
  const d = new Date().toISOString().slice(0, 10);
  $('#main').innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Reports & Financial Intelligence</h1>
        <p>Export business ledgers, cashier reconciliations, tax summaries, and product velocity.</p>
      </div>
    </div>
    <div class="card">
      <div class="g4" style="align-items:end;margin-bottom:0">
        <label>Select Report
          <select id="rk">
            ${RL.map(r => `<option value="${r.k}">${r.title}</option>`).join('')}
          </select>
        </label>
        <label>Date From
          <input id="rf" type="date" value="${d.slice(0, 8)}01">
        </label>
        <label>Date To
          <input id="rt" type="date" value="${d}">
        </label>
        <button class="btn" style="margin-bottom:12px" onclick="runRep()">
          ${ICONS.search} Run Analysis
        </button>
      </div>
    </div>
    <div id="ro"></div>
  `;
};

const runRep = guard(async () => {
  RW = await A('report', { k: $('#rk').value, f: $('#rf').value, t: $('#rt').value });
  const c = RW[0] ? Object.keys(RW[0]) : [];
  $('#ro').innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${$('#rk').selectedOptions[0].text} (${RW.length} rows returned)</div>
        <div style="display:flex;gap:6px">
          <button class="ghost sm" onclick="xp('csv')">Export CSV</button>
          <button class="ghost sm" onclick="xp('xls')">Export Excel</button>
          <button class="btn sm" onclick="xp('pdf')">${ICONS.printer} Print PDF</button>
        </div>
      </div>
      <div id="rt2" style="overflow-x:auto">
        <table class="t">
          <tr>
            ${c.map(x => `<th>${x}</th>`).join('')}
          </tr>
          ${RW.map(r => `
            <tr>
              ${c.map(x => `<td>${cell(r[x])}</td>`).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
});

function xp(t) {
  const c = RW[0] ? Object.keys(RW[0]) : [];
  const n = $('#rk').value + '-' + $('#rf').value;

  if (t === 'pdf') {
    $('#print').innerHTML = `
      <h2>${esc(S.name)}</h2>
      <h3>${$('#rk').selectedOptions[0].text} (${$('#rf').value} → ${$('#rt').value})</h3>
      ${$('#rt2').innerHTML}
    `;
    (document.getElementById('pg') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pg' }))).textContent = '@page{size:A4;margin:12mm}';
    return window.print();
  }

  const csv = [c, ...RW.map(r => c.map(x => r[x]))].map(r => r.map(v => '"' + String(v instanceof Date ? v.toISOString() : v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const b = new Blob([t === 'csv' ? '\ufeff' + csv : '<table>' + $('#rt2 table').innerHTML + '</table>'], {
    type: t === 'csv' ? 'text/csv' : 'application/vnd.ms-excel'
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = n + '.' + t;
  a.click();
}

const cell = v => v instanceof Date ? v.toLocaleString() : typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(2) : esc(v);
