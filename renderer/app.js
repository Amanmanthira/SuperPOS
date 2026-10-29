// Amectar Enterprise POS System - Modern Retail & Supermarket Management
const A = (n, a) => window.api(n, a);
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// SVG Stroke Icons Collection
const ICONS = {
  brand: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 3h7v9H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 16h7v5H3z"/></svg>',
  pos: '<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  sales: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  products: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  categories: '<svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  stock: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  suppliers: '<svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  po: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
  grn: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  customers: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  coupons: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10a2 2 0 0 1 0-4"/><path d="M21 10a2 2 0 0 0 0-4"/><line x1="7" y1="12" x2="17" y2="12"/></svg>',
  register: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="12" cy="15" r="2"/></svg>',
  expenses: '<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  reports: '<svg viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  branches: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  pinHome: '<svg viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h14v-8h3L12 2z"/><circle cx="12" cy="14" r="2"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  palette: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  save: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  disc: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  printer: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
};

// 5 Curated Theme Presets
const THEME_PRESETS = {
  teal: {
    title: 'Teal & Mint (Default)',
    sidebar: '#008b7a',
    accent: '#fcc233',
    chartBar: '#c1eef5',
    primary: '#008b7a'
  },
  ocean: {
    title: 'Modern Ocean Blue',
    sidebar: '#1d4ed8',
    accent: '#f59e0b',
    chartBar: '#bfdbfe',
    primary: '#1d4ed8'
  },
  slate: {
    title: 'Luxury Charcoal / Slate',
    sidebar: '#0f172a',
    accent: '#3b82f6',
    chartBar: '#cbd5e1',
    primary: '#0f172a'
  },
  emerald: {
    title: 'Emerald Forest',
    sidebar: '#065f46',
    accent: '#fbbf24',
    chartBar: '#a7f3d0',
    primary: '#059669'
  },
  berry: {
    title: 'Sunset Plum / Berry',
    sidebar: '#831843',
    accent: '#fbbf24',
    chartBar: '#fbcfe8',
    primary: '#be185d'
  }
};

const toast = {
  show(msg, type = 'info', duration = 3000) {
    const c = $('#toast-container');
    if (!c) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span>${esc(msg)}</span>`;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(() => el.remove(), 250);
    }, duration);
  },
  success(m) { this.show(m, 'success'); },
  error(m) { this.show(m, 'danger', 4000); },
  warning(m) { this.show(m, 'warning'); },
  info(m) { this.show(m, 'info'); }
};

const D = {
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
  printer: 'System Default',
  prefix: 'INV-',
  paper: '80mm',
  rcFontSize: '12px',
  returnPolicy: 'Goods accepted for exchange or refund within 14 days.',
  footer: 'Thank you for shopping with us!',
  showVat: '1',
  showCashier: '1',
  showCustomer: '1',
  autoPrint: '1',
  sidebar: '#008b7a',
  accent: '#fcc233',
  chartBar: '#c1eef5',
  primary: '#008b7a',
  fontSize: '14px',
  posDensity: 'Comfortable',
  sbWidth: '220',
  sbFontSize: '12.5px',
  dark: '0',
  logo: '',
  cashier: 'Alexander Vance',
  loyaltyEarn: '1',
  loyaltyValue: '0.10',
  tierDisc: 'Silver:2,Gold:5,Platinum:8'
};

let S = { ...D }, cart = [], P = [], C = [], disc = 0, view = 'dashboard', R = {};
window.connectedPrinters = [];

const m = n => (+n || 0).toFixed(2);
const money = n => {
  const num = +n || 0;
  const sym = (S.currency || 'LKR').trim();
  const pfx = sym.length > 1 ? sym + ' ' : sym;
  return pfx + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const esc = s => (s instanceof Date ? s.toLocaleString() : String(s ?? '')).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const guard = f => async (...a) => {
  try {
    return await f(...a);
  } catch (e) {
    toast.error(e.message || String(e));
  }
};

function theme(c = S) {
  const r = document.documentElement.style;
  r.setProperty('--sb-bg', c.sidebar || '#008b7a');
  r.setProperty('--sb-active-text', c.sidebar || '#008b7a');
  r.setProperty('--accent', c.accent || '#fcc233');
  r.setProperty('--chart-bar', c.chartBar || '#c1eef5');
  r.setProperty('--primary', c.primary || c.sidebar || '#008b7a');

  const fs = (c.fontSize || '14px').split(' ')[0];
  r.setProperty('--base-font-size', fs);
  document.documentElement.style.fontSize = fs;

  // Sidebar geometry (Settings, Display): width in px + label text size
  const sbw = parseInt(c.sbWidth, 10);
  r.setProperty('--sb-width', (sbw >= 170 && sbw <= 340 ? sbw : 220) + 'px');
  r.setProperty('--sb-font-size', (c.sbFontSize || '12.5px').split(' ')[0]);
  document.body.classList.toggle('dark', c.dark === '1');
}

function applyPreset(presetKey) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;
  const { title, name, ...themeColors } = preset;
  Object.assign(S, themeColors);
  theme(S);
  Object.entries(themeColors).forEach(([k, v]) => {
    const el = $('#s_' + k);
    if (el) el.value = v;
    const txt = $('#s_' + k + '_txt');
    if (txt) txt.value = v;
  });
  A('settings.set', {
    sidebar: S.sidebar,
    accent: S.accent,
    chartBar: S.chartBar,
    primary: S.primary
  }).catch(() => {});
  toast.success(`Applied ${preset.title} theme!`);
  modal();
  nav();
  if (view === 'dashboard') go('dashboard');
  if (view === 'settings' && SET_DEFS.length) setSection(SET_ACTIVE);
}

function openThemeModal() {
  modal(`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 style="margin:0;display:flex;align-items:center;gap:8px">${ICONS.palette} Color & Theme Customization</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <p style="color:var(--text-muted);font-size:12.5px;margin-bottom:14px">Choose a 1-click curated palette or configure custom hex colors below.</p>
    
    <div class="theme-palette-modal">
      ${Object.entries(THEME_PRESETS).map(([k, p]) => `
        <div class="theme-preset-card ${S.sidebar === p.sidebar ? 'active' : ''}" onclick="applyPreset('${k}')">
          <div class="theme-preset-preview">
            <div style="flex:1.5;background:${p.sidebar}"></div>
            <div style="flex:1;background:${p.chartBar}"></div>
            <div style="flex:0.6;background:${p.accent}"></div>
          </div>
          <div class="theme-preset-name">${p.title}</div>
        </div>
      `).join('')}
    </div>

    <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:14px">
      <div style="font-weight:700;font-size:13px;margin-bottom:10px">Fine-Tune Custom Colors</div>
      <div class="g2">
        <div class="color-picker-group">
          <span class="field-label">Sidebar / Brand Color</span>
          <div class="color-picker-input-wrap">
            <input type="color" id="tc_sidebar" class="color-picker-swatch" value="${S.sidebar || '#008b7a'}" oninput="$('#tc_sidebar_txt').value=this.value;S.sidebar=this.value;theme(S)">
            <input type="text" id="tc_sidebar_txt" class="color-picker-hex" value="${S.sidebar || '#008b7a'}" maxlength="7" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value)){$('#tc_sidebar').value=this.value;S.sidebar=this.value;theme(S)}">
          </div>
        </div>
        <div class="color-picker-group">
          <span class="field-label">Highlight Accent (Yellow)</span>
          <div class="color-picker-input-wrap">
            <input type="color" id="tc_accent" class="color-picker-swatch" value="${S.accent || '#fcc233'}" oninput="$('#tc_accent_txt').value=this.value;S.accent=this.value;theme(S)">
            <input type="text" id="tc_accent_txt" class="color-picker-hex" value="${S.accent || '#fcc233'}" maxlength="7" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value)){$('#tc_accent').value=this.value;S.accent=this.value;theme(S)}">
          </div>
        </div>
        <div class="color-picker-group">
          <span class="field-label">Chart Bar Color</span>
          <div class="color-picker-input-wrap">
            <input type="color" id="tc_chartBar" class="color-picker-swatch" value="${S.chartBar || '#c1eef5'}" oninput="$('#tc_chartBar_txt').value=this.value;S.chartBar=this.value;theme(S)">
            <input type="text" id="tc_chartBar_txt" class="color-picker-hex" value="${S.chartBar || '#c1eef5'}" maxlength="7" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value)){$('#tc_chartBar').value=this.value;S.chartBar=this.value;theme(S)}">
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="ghost" onclick="modal()">Close</button>
        <button type="button" class="btn" onclick="saveCustomColors()">Save Custom Theme</button>
      </div>
    </div>
  `);
}

const saveCustomColors = guard(async () => {
  await A('settings.set', {
    sidebar: S.sidebar,
    accent: S.accent,
    chartBar: S.chartBar,
    primary: S.sidebar
  });
  modal();
  toast.success('Custom theme saved permanently!');
  nav();
  go(view);
});

function calc(items, d, c = S) {
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
  const ds = Math.min(d, sub);
  const ra = sub ? ds / sub : 0;
  const r = +c.vatRate;
  const inc = c.vatInclusive === '1';
  let vat = 0;
  items.forEach(i => {
    if (i.taxable) {
      vat += i.price * i.qty * (1 - ra) * (inc ? r / (100 + r) : r / 100);
    }
  });
  return { sub, disc: ds, vat, total: sub - ds + (inc ? 0 : vat) };
}

function receipt(s, items, c = S) {
  const paper = (c.paper || '80mm').split(' ')[0];
  const rcFs = (c.rcFontSize || '12px').split(' ')[0];
  const isVat = +c.vatRate > 0;
  return `
    <div class="rc" style="width:${paper};font-size:${rcFs}">
      ${c.logo ? `<div style="text-align:center;margin-bottom:6px"><img src="${c.logo}" style="max-height:48px;max-width:80%"></div>` : ''}
      <h2 style="font-size:1.3em;font-weight:900;text-align:center;margin:0 0 2px">${esc(c.name)}</h2>
      ${c.tagline ? `<p style="text-align:center;font-size:0.9em;opacity:0.85;margin:0 0 2px">${esc(c.tagline)}</p>` : ''}
      ${c.address ? `<p style="text-align:center;font-size:0.85em;margin:0 0 2px">${esc(c.address)}</p>` : ''}
      ${c.phone ? `<p style="text-align:center;font-size:0.85em;margin:0 0 4px">Tel: ${esc(c.phone)}${c.email ? ' | ' + esc(c.email) : ''}</p>` : ''}
      ${c.vatNo ? `<p style="text-align:center;font-size:0.85em;margin:0 0 4px">Tax/VAT No: ${esc(c.vatNo)}</p>` : ''}

      <div style="border-top:1px dashed #000;margin:6px 0"></div>
      <div style="text-align:center;font-weight:800;font-size:1.05em;letter-spacing:1px;margin:2px 0">${isVat ? 'TAX INVOICE' : 'SALES RECEIPT'}</div>

      <div class="rc-row"><span>Invoice: <b>${esc(s.invoice_no || s.invoice || 'INV-0001')}</b></span><span>${new Date(s.created || Date.now()).toLocaleDateString()}</span></div>
      ${c.showCashier !== '0' ? `<div class="rc-row"><span>Cashier: ${esc(s.cashier || c.cashier || 'Cashier')}</span><span>${esc(s.method || 'Cash')}</span></div>` : ''}
      ${c.showCustomer !== '0' && s.customer ? `<div class="rc-row"><span>Customer: ${esc(s.customer)}</span>${s.points_bal != null ? `<span>Pts: ${s.points_bal}</span>` : ''}</div>` : ''}

      <div style="border-top:1px dashed #000;margin:6px 0"></div>

      <table style="width:100%;font-size:inherit;border-collapse:collapse;margin:4px 0">
        <thead>
          <tr style="border-bottom:1px solid #000;text-align:left">
            <th style="padding:4px 0">Item</th>
            <th style="padding:4px 0;text-align:center">Qty</th>
            <th style="padding:4px 0;text-align:right">Price</th>
            <th style="padding:4px 0;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${(items || []).map(i => `
            <tr>
              <td style="padding:3px 0;word-break:break-word">${esc(i.name)}</td>
              <td style="padding:3px 0;text-align:center">${+i.qty}</td>
              <td style="padding:3px 0;text-align:right">${m(i.price)}</td>
              <td style="padding:3px 0;text-align:right;font-weight:700">${m(i.price * i.qty)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="border-top:1px dashed #000;margin:6px 0"></div>

      <div class="rc-row"><span>Subtotal</span><span>${money(s.subtotal)}</span></div>
      ${+s.discount ? `<div class="rc-row"><span>Discount</span><span style="font-weight:700">-${money(s.discount)}</span></div>` : ''}
      ${c.showVat !== '0' && +s.vat ? `<div class="rc-row"><span>${esc(c.vatLabel || 'Sales Tax')} (${c.vatRate}%)</span><span>${money(s.vat)}</span></div>` : ''}
      <div class="rc-row" style="font-size:1.15em;font-weight:900;border-top:1px solid #000;border-bottom:1px solid #000;padding:5px 0;margin:5px 0">
        <span>TOTAL DUE</span>
        <span>${money(s.total)}</span>
      </div>
      <div class="rc-row"><span>Paid (${esc(s.method || 'Cash')})</span><span>${money(s.paid || s.total)}</span></div>
      <div class="rc-row"><span>Change Due</span><span style="font-weight:700">${money(s.change_due || 0)}</span></div>

      ${c.returnPolicy ? `<div style="border-top:1px dashed #000;margin:8px 0 4px"></div><p style="text-align:center;font-size:0.85em;line-height:1.3;margin:0">${esc(c.returnPolicy)}</p>` : ''}
      ${c.footer ? `<p style="text-align:center;font-size:0.9em;font-weight:700;margin:6px 0 0">${esc(c.footer)}</p>` : ''}
      <div style="text-align:center;font-size:0.75em;opacity:0.5;margin-top:6px">Powered by Amectar POS</div>
    </div>
  `;
}

function printRc(h) {
  $('#print').innerHTML = h;
  const paper = (S.paper || '80mm').split(' ')[0];
  let st = $('#pg') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pg' }));
  st.textContent = `@page{size:${paper} auto;margin:0}`;
  if (S.printer && S.printer !== 'System Default' && S.printer !== 'System Default Printer') {
    A('receipt.print', { deviceName: S.printer, silent: S.autoPrint === '1' }).then(res => {
      if (!res || !res.success) window.print();
    }).catch(() => {
      window.print();
    });
  } else {
    window.print();
  }
}

const modal = h => {
  $('#modal').innerHTML = h
    ? `<div class="ov" onclick="if(event.target===this)modal()"><div class="mb">${h}</div></div>`
    : '';
};

let lastReceiptHtml = '';
let showRc = h => {
  lastReceiptHtml = h;
  modal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <h3 style="margin:0;font-size:16px;font-weight:800">Customer Receipt (${S.paper || '80mm'})</h3>
      <button class="ghost sm" onclick="modal()">✕</button>
    </div>
    <div style="max-height:60vh;overflow-y:auto;background:#e2e8f0;padding:20px;border-radius:14px;display:flex;justify-content:center">
      ${h}
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Close</button>
      <button type="button" class="btn" onclick="printRc(lastReceiptHtml)">🖨 Print Receipt</button>
    </div>
  `);
};

window.testReceiptPrint = () => {
  const sampleItems = [
    { name: 'Fresh Milk 1L', price: 450.00, qty: 2 },
    { name: 'Artisan White Bread', price: 220.00, qty: 1 },
    { name: 'Ceylon Highland Tea (100g)', price: 380.00, qty: 1 }
  ];
  const sub = 450 * 2 + 220 + 380;
  const vat = +(sub * (+S.vatRate || 8) / 100).toFixed(2);
  const total = +(sub + vat).toFixed(2);
  const sampleSale = {
    invoice_no: (S.prefix || 'INV-') + 'TEST-001',
    created: new Date(),
    cashier: S.cashier || 'Cashier Vance',
    customer: 'Nimal Perera (VIP Member)',
    subtotal: sub,
    discount: 0,
    vat: vat,
    total: total,
    paid: total,
    change_due: 0,
    method: 'Cash'
  };
  const h = receipt(sampleSale, sampleItems, S);
  printRc(h);
  toast.success('Test receipt sent to printer!');
};

window.previewReceipt = () => {
  const sampleItems = [
    { name: 'Fresh Milk 1L', price: 450.00, qty: 2 },
    { name: 'Artisan White Bread', price: 220.00, qty: 1 },
    { name: 'Ceylon Highland Tea (100g)', price: 380.00, qty: 1 }
  ];
  const sub = 450 * 2 + 220 + 380;
  const vat = +(sub * (+S.vatRate || 8) / 100).toFixed(2);
  const total = +(sub + vat).toFixed(2);
  const sampleSale = {
    invoice_no: (S.prefix || 'INV-') + 'PREVIEW-001',
    created: new Date(),
    cashier: S.cashier || 'Cashier Vance',
    customer: 'Nimal Perera (VIP Member)',
    subtotal: sub,
    discount: 0,
    vat: vat,
    total: total,
    paid: 2000.00,
    change_due: +(2000.00 - total).toFixed(2),
    method: 'Cash'
  };
  const h = receipt(sampleSale, sampleItems, S);
  lastReceiptHtml = h;
  modal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <h3 style="margin:0;font-size:16px;font-weight:800">Thermal Receipt Preview (${S.paper || '80mm'})</h3>
      <button class="ghost sm" onclick="modal()">✕</button>
    </div>
    <div style="max-height:65vh;overflow-y:auto;background:#e2e8f0;padding:20px;border-radius:14px;display:flex;justify-content:center">
      ${h}
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Close</button>
      <button type="button" class="btn" onclick="testReceiptPrint()">🖨 Print Sample Receipt</button>
    </div>
  `);
};

window.stepFontSize = delta => {
  const current = parseFloat(S.fontSize || '14') || 14;
  const next = Math.min(22, Math.max(11, current + delta * 1.5));
  S.fontSize = next + 'px';
  A('settings.set', { fontSize: S.fontSize }).catch(() => {});
  theme(S);
  const ind = $('#pos-fs-indicator');
  if (ind) ind.textContent = S.fontSize;
  toast.info(`Text size: ${S.fontSize}`);
};

let HELD = [];
window.holdSale = () => {
  if (!cart.length) return toast.warning('Cart is empty, nothing to hold');
  HELD.push({ cart: [...cart], cust: window.cust, disc, cp: window.cp, date: new Date() });
  cart = [];
  toast.success(`Sale held! (${HELD.length} held)`);
  go('pos');
};

window.resumeSale = index => {
  if (!HELD.length) return toast.info('No held sales');
  const h = HELD.splice(index ?? (HELD.length - 1), 1)[0];
  cart = h.cart;
  window.cust = h.cust;
  disc = h.disc;
  window.cp = h.cp;
  toast.success('Sale resumed!');
  go('pos');
};

// Original Retail POS Navigation Sections, grouped under section headers
const NAV = {
  dashboard: ['dashboard', ICONS.dashboard, 'Dashboard'],
  pos: ['pos', ICONS.pos, 'POS Terminal'],
  sales: ['sales', ICONS.sales, 'Sales & Returns'],
  products: ['products', ICONS.products, 'Products'],
  categories: ['categories', ICONS.categories, 'Categories'],
  stock: ['stock', ICONS.stock, 'Stock Inventory'],
  suppliers: ['suppliers', ICONS.suppliers, 'Suppliers'],
  po: ['po', ICONS.po, 'Purchase Orders'],
  grn: ['grn', ICONS.grn, 'Goods Received'],
  customers: ['customers', ICONS.customers, 'Customers'],
  coupons: ['coupons', ICONS.coupons, 'Coupons'],
  register: ['register', ICONS.register, 'Cash Register'],
  expenses: ['expenses', ICONS.expenses, 'Expenses'],
  reports: ['reports', ICONS.reports, 'Reports'],
  users: ['users', ICONS.users, 'Users'],
  branches: ['branches', ICONS.branches, 'Branches'],
  settings: ['settings', ICONS.settings, 'Settings']
};

// Sidebar section headers: each group only shows the entries this role may open
const NAV_GROUPS = [
  ['Overview', ['dashboard']],
  ['Sales Floor', ['pos', 'register', 'sales']],
  ['Catalog & Inventory', ['products', 'categories', 'stock', 'suppliers', 'po', 'grn']],
  ['Customers & Marketing', ['customers', 'coupons']],
  ['Finance & Insights', ['expenses', 'reports']],
  ['Administration', ['users', 'branches', 'settings']]
];

function nav() {
  const sb = $('#sb');
  if (!sb) return;

  const allowed = k => (typeof can === 'function' ? can(k) : true) && NAV[k];
  const groups = NAV_GROUPS
    .map(([title, keys]) => [title, keys.filter(allowed)])
    .filter(([, keys]) => keys.length);

  sb.innerHTML = `
    <div class="sb-brand">
      <div class="sb-brand-icon">
        ${ICONS.brand}
      </div>
      <div class="sb-brand-name">${esc(S.name)}</div>
    </div>

    <div class="sb-nav-group">
      ${groups.map(([title, keys]) => `
        <div class="sb-section-label">${esc(title)}</div>
        ${keys.map(k => {
          const [key, iconSvg, label] = NAV[k];
          return `
        <a class="${key === view ? 'on' : ''}" onclick="go('${key}')">
          ${iconSvg}
          <span>${label}</span>
        </a>`;
        }).join('')}
      `).join('')}
      <div class="sb-section-label">Session</div>
      <a onclick="login()">
        ${ICONS.logout}
        <span>LogOut</span>
      </a>
    </div>

    <!-- Active Register Shift / Action Card at Bottom of Sidebar -->
    <div class="sb-promo">
      <div class="sb-promo-header">
        <span class="sb-promo-dot ${window.SH ? '' : 'closed'}"></span>
        <span class="sb-promo-title">${window.SH ? 'Shift #' + window.SH.id : 'Register Closed'}</span>
      </div>
      <div class="sb-promo-desc">${window.SH ? 'Cashier active • Drawer unlocked' : 'Open drawer to ring sales'}</div>
      <button class="sb-promo-btn" onclick="go('register')">${window.SH ? 'Drawer Status' : 'Open Shift'}</button>
    </div>
  `;

  updateTopbar();
}

function updateTopbar() {
  const tb = $('#topbar');
  if (!tb) return;

  const userName = (window.U && window.U.fullname) || S.cashier || 'Alexander Vance';

  tb.innerHTML = `
    <div class="tb-search">
      ${ICONS.search}
      <input placeholder="Search products, invoices, customers..." oninput="filterGlobalSearch(this.value)">
    </div>
    <div class="tb-right">
      <button class="tb-theme-btn" onclick="openThemeModal()" title="Customize Colors & Theme">
        ${ICONS.palette}
        <span>Theme</span>
      </button>

      <div class="tb-user" onclick="go('settings')" title="Operator Profile">
        <span class="tb-user-name">${esc(userName)}</span>
        <div class="tb-avatar">${userName[0]}</div>
      </div>

      <div class="tb-bell" onclick="toast.info('All systems operational!')" title="Notifications">
        ${ICONS.bell}
        <span class="tb-bell-dot"></span>
      </div>
    </div>
  `;
}

window.filterGlobalSearch = q => {
  if (view === 'pos' && $('#q')) {
    $('#q').value = q;
    gridR();
  }
};

let go = guard(async v => {
  view = v;
  nav();
  if (V[v]) {
    await V[v]();
  }
});

const F = {
  products: [
    ['barcode', 'Barcode / UPC'],
    ['name', 'Product Name'],
    ['category', 'Category'],
    ['price', 'Selling Price', 'number'],
    ['cost', 'Cost Price', 'number'],
    ['stock', 'Stock on Hand', 'number'],
    ['reorder', 'Reorder Level', 'number'],
    ['taxable', 'Taxable', 'check']
  ],
  customers: [
    ['name', 'Customer Name'],
    ['phone', 'Phone Number'],
    ['email', 'Email Address'],
    ['address', 'Physical Address']
  ]
};

// ===== Settings window: section rail + one section at a time =====
let SET_DEFS = [], SET_ACTIVE = 0, SET_TYPE = {}, SET_DIRTY = false;

// Fields that need the full row width (long text values)
const SET_WIDE = new Set(['tagline', 'address', 'website', 'logo', 'returnPolicy', 'footer', 'tierDisc', 'vatNo']);

function setDirty(on) {
  SET_DIRTY = on;
  const dot = $('#set-dirty');
  if (dot) dot.style.display = on ? 'inline-flex' : 'none';
}

function setField(n, l, t, hint) {
  const type = t || 'text';
  const wide = SET_WIDE.has(n) || type === 'area' || type === 'color';
  let ctrl = '';

  if (type === 'color') {
    const val = S[n] || '#008b7a';
    ctrl = `
      <div class="color-picker-input-wrap">
        <input type="color" id="s_${n}" class="color-picker-swatch" value="${val}">
        <input type="text" id="s_${n}_txt" class="color-picker-hex" value="${val}" maxlength="7" spellcheck="false">
      </div>`;
  } else if (type === 'bool') {
    ctrl = `
      <div class="set-switch">
        <input type="checkbox" id="s_${n}" ${S[n] === '1' ? 'checked' : ''}>
        <span class="set-switch-track"><span class="set-switch-knob"></span></span>
        <span class="set-switch-txt">${S[n] === '1' ? 'On' : 'Off'}</span>
      </div>`;
  } else if (type.startsWith('sel:')) {
    const opts = type.slice(4).split(',');
    const cur = (S[n] || '').split(' ')[0];
    ctrl = `
      <div class="set-select">
        <select id="s_${n}">
          ${opts.map(o => {
            const k = o.split(' ')[0];
            return `<option value="${k}" ${cur === k ? 'selected' : ''}>${o}</option>`;
          }).join('')}
        </select>
        ${ICONS.chevronDown}
      </div>`;
  } else if (type === 'printer') {
    const cur = S[n] || 'System Default';
    const printers = window.connectedPrinters || [];
    ctrl = `
      <div class="set-select">
        <select id="s_${n}">
          <option value="System Default" ${cur === 'System Default' ? 'selected' : ''}>System Default Printer</option>
          ${printers.map(p => {
            const name = p.name || p.displayName;
            const isDef = p.isDefault ? ' (Default)' : '';
            return `<option value="${esc(name)}" ${cur === name ? 'selected' : ''}>${esc(name)}${isDef}</option>`;
          }).join('')}
        </select>
        ${ICONS.chevronDown}
      </div>`;
  } else if (type === 'area') {
    ctrl = `<textarea id="s_${n}" rows="3">${esc(S[n] ?? '')}</textarea>`;
  } else {
    ctrl = `<input id="s_${n}" type="${type}" value="${esc(S[n] ?? '')}" autocomplete="off">`;
  }

  return `
    <div class="set-field ${wide ? 'wide' : ''}">
      <label class="set-label" for="s_${n}">${l}</label>
      ${ctrl}
      ${hint ? `<div class="set-hint">${hint}</div>` : ''}
    </div>`;
}

window.refreshConnectedPrinters = async () => {
  try {
    const list = await A('printers.list');
    window.connectedPrinters = list || [];
    const sel = $('#s_printer');
    if (sel) {
      const cur = S.printer || 'System Default';
      sel.innerHTML = `
        <option value="System Default" ${cur === 'System Default' ? 'selected' : ''}>System Default Printer</option>
        ${window.connectedPrinters.map(p => {
          const name = p.name || p.displayName;
          const isDef = p.isDefault ? ' (Default)' : '';
          return `<option value="${esc(name)}" ${cur === name ? 'selected' : ''}>${esc(name)}${isDef}</option>`;
        }).join('')}
      `;
    }
    const note = $('#printer-status-note');
    if (note) {
      note.textContent = `Found ${window.connectedPrinters.length} printer(s): ${window.connectedPrinters.map(p => p.name || p.displayName).join(', ') || 'None found (will use default)'}`;
    }
    toast.info(`Found ${window.connectedPrinters.length} connected printer(s)`);
  } catch (e) {
    console.error('Error refreshing printers:', e);
  }
};

// Section-specific extras (previews, buttons, theme swatches) shown under the fields
function setExtra(k) {
  if (k === 'receipt') {
    return `<div class="set-extra">
      <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <button type="button" class="btn sm" onclick="previewReceipt()">👁 Live Receipt Preview</button>
        <button type="button" class="ghost sm" onclick="testReceiptPrint()">🖨 Print Test Receipt</button>
        <button type="button" class="ghost sm" onclick="refreshConnectedPrinters()">🔄 Refresh Connected Printers</button>
      </div>
      <div id="printer-status-note" style="font-size:12px;color:var(--text-muted)">
        ${(window.connectedPrinters && window.connectedPrinters.length)
          ? `Connected printers detected: ${window.connectedPrinters.length} printer(s) available on this computer.`
          : 'Scanning system for connected printers...'}
      </div>
    </div>`;
  }
  if (k === 'display') {
    return `<div class="set-preview">
      <div class="set-preview-tag">Live preview</div>
      <span style="font-size:var(--base-font-size, 13.5px);font-weight:700">Amectar Supermarket POS System (${money(124.50)})</span>
    </div>`;
  }
  if (k === 'sidebar') {
    return `<div class="set-preview">
      <div class="set-preview-tag">Live preview — <span id="sbw_px"></span> wide</div>
      <div class="sbw-preview" style="background:var(--sb-bg);max-width:calc(var(--sb-width, 220px))">
        <div class="sbw-brand">${esc(S.name)}</div>
        <div class="sbw-item">
          ${ICONS.dashboard.replace('<svg', '<svg width="14" height="14"')}
          <span>Dashboard</span>
        </div>
      </div>
    </div>`;
  }
  if (k === 'themes') {
    return `<div class="set-themes">
      ${Object.entries(THEME_PRESETS).map(([key, p]) => `
        <div class="theme-preset-card ${S.sidebar === p.sidebar ? 'active' : ''}" onclick="applyPreset('${key}')">
          <div class="theme-preset-preview">
            <div style="flex:1.5;background:${p.sidebar}"></div>
            <div style="flex:1;background:${p.chartBar}"></div>
            <div style="flex:0.6;background:${p.accent}"></div>
          </div>
          <div class="theme-preset-name">${p.title}</div>
        </div>
      `).join('')}
    </div>`;
  }
  return '';
}

// Attach live behaviour to every rendered setting field
function bindFields() {
  SET_TYPE = {};
  SET_DEFS.forEach(s => s.f.forEach(([n, , t]) => { SET_TYPE[n] = t || 'text'; }));

  Object.entries(SET_TYPE).forEach(([n, t]) => {
    const e = $('#s_' + n);
    if (!e) return;

    const apply = () => {
      if (t === 'color') {
        const txt = $('#s_' + n + '_txt');
        if (txt) txt.value = e.value;
      }
      if (t === 'bool') {
        const box = e.parentElement && e.parentElement.querySelector('.set-switch-txt');
        if (box) box.textContent = e.checked ? 'On' : 'Off';
      }
      if (n === 'fontSize' || n === 'sbWidth' || n === 'sbFontSize') {
        S[n] = e.value;
        theme(S);
        if (n !== 'fontSize') nav();
        const px = $('#sbw_px');
        if (px) px.textContent = (parseInt(S.sbWidth, 10) || 220) + 'px';
      }
      pv();
      setDirty(true);
    };

    e.oninput = e.onchange = apply;

    if (t === 'color') {
      const txt = $('#s_' + n + '_txt');
      if (txt) {
        txt.oninput = () => {
          if (/^#[0-9A-Fa-f]{6}$/.test(txt.value)) {
            e.value = txt.value;
            pv();
            setDirty(true);
          }
        };
      }
    }
  });

  const sbwPx = $('#sbw_px');
  if (sbwPx) sbwPx.textContent = (parseInt(S.sbWidth, 10) || 220) + 'px';
}

// Render one settings section into the right-hand pane
function setSection(i) {
  const sec = SET_DEFS[i];
  if (!sec) return;
  SET_ACTIVE = i;

  const pane = $('#set-pane');
  if (!pane) return;
  pane.innerHTML = `
    <div class="set-card">
      <div class="set-card-head">
        <span class="set-card-icon">${sec.i}</span>
        <div class="set-card-text">
          <h2>${sec.t}</h2>
          <p>${sec.d}</p>
        </div>
      </div>
      <div class="set-grid">${sec.f.map(x => setField(...x)).join('')}</div>
      ${setExtra(sec.extra)}
    </div>`;

  $$('.set-rail-item').forEach((b, idx) => b.classList.toggle('on', idx === i));
  bindFields();
}

// Search: flatten every field that matches, grouped by its section
function setSearch(q) {
  const pane = $('#set-pane');
  if (!pane) return;
  const query = (q || '').trim().toLowerCase();
  if (!query) {
    setSection(SET_ACTIVE);
    return;
  }

  const hits = SET_DEFS
    .map(s => ({ s, f: s.f.filter(([n, l]) => (l + ' ' + n + ' ' + s.t).toLowerCase().includes(query)) }))
    .filter(x => x.f.length);

  $$('.set-rail-item').forEach(b => b.classList.remove('on'));

  pane.innerHTML = hits.length ? hits.map(({ s, f }) => `
    <div class="set-card">
      <div class="set-card-head">
        <span class="set-card-icon">${s.i}</span>
        <div class="set-card-text">
          <h2>${s.t}</h2>
          <p>${f.length} matching setting${f.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      <div class="set-grid">${f.map(x => setField(...x)).join('')}</div>
      ${f.length === s.f.length ? setExtra(s.extra) : ''}
    </div>
  `).join('') : `
    <div class="set-card">
      <div class="set-empty">
        <div style="font-size:26px;margin-bottom:6px">🔍</div>
        <b>No settings match “${esc(q)}”</b>
        <p>Try “receipt”, “tax”, “sidebar”, “colour” or “loyalty”.</p>
      </div>
    </div>`;

  bindFields();
}

// Throw away unsaved edits and reload the stored settings
const resetSet = guard(async () => {
  S = { ...D, ...await A('settings.get') };
  if (!S.currency || S.currency === '$') S.currency = 'LKR';
  theme();
  nav();
  setDirty(false);
  const q = $('#set-q');
  if (q) q.value = '';
  setSection(SET_ACTIVE);
  toast.info('Unsaved changes discarded');
});

// Dashboard & POS Views with PinHome UI + Original POS Data
const V = {
  async dashboard() {
    const d = await A('dash');
    const todayRev = +d.today?.t || 0;
    const todayBills = +d.today?.c || 0;

    // 14-day velocity data from database or past 14 days
    const daysData = (d.days && d.days.length) ? d.days : [];
    const days14 = [];
    const maxVal = Math.max(...daysData.map(y => +y.t || 0), todayRev, 2500);

    for (let i = 13; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 86400000);
      const ds = `${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      const found = daysData.find(x => x.d === ds);
      const isToday = (i === 0);
      days14.push({
        day: dt.getDate(),
        val: isToday ? todayRev : (found ? +found.t : 0),
        isToday
      });
    }

    // ---- Business health numbers (whole picture of the shop) ----
    const yesterdayRev = +d.yesterday?.t || 0;
    const monthRev = +d.month || 0;
    const monthBills = +d.month_count || 0;
    const profitToday = +d.profit_today || 0;
    const marginToday = todayRev ? +(100 * profitToday / todayRev).toFixed(1) : 0;
    const monthProfit = +d.month_profit || +(monthRev * 0.38).toFixed(2);
    const marginMonth = +(d.month_margin || (monthRev ? 100 * monthProfit / monthRev : 0)).toFixed(1);
    const expensesMonth = +d.expenses_month || 0;
    const netMonth = monthProfit - expensesMonth;
    const avgTicket = todayBills ? todayRev / todayBills : 0;
    const avgTicketMonth = +(d.avg_month_bill || (monthBills ? monthRev / monthBills : 0)).toFixed(2);
    const prevMonthRev = +d.prev_month || 0;
    const daysInMonth = +d.days_in_month || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const daysElapsed = new Date().getDate();
    const paceMonth = daysElapsed ? +(monthRev / daysElapsed).toFixed(2) : 0;
    const stockValue = +d.stock_value || 0;
    const productCount = +d.product_count || 0;
    const lowItems = (d.low_items || []).map(x => ({ ...x, stock: +x.stock || 0, reorder: +x.reorder || 0, price: +x.price || 0, cost: +x.cost || 0 }));
    const lowCount = +d.low || lowItems.length;
    const expiryCount = +d.expiry_count || 0;
    const openPOs = +d.open_pos || 0;
    const openPOValue = +d.open_po_value || 0;
    const supplierDebt = +d.supplier_debt || 0;
    const customers = +d.customers || 0;
    const custToday = +d.cust_today || 0;
    const lastSale = d.last_sale ? new Date(d.last_sale) : null;

    const delta = (cur, prev) => (prev ? +(((cur - prev) / prev) * 100).toFixed(1) : null);
    const trend = v => v === null ? '' : `<span class="badge ${v >= 0 ? 'success' : 'danger'}">${v >= 0 ? '▲' : '▼'} ${Math.abs(v)}%</span>`;

    // Payment mix (last 7 days) + best sellers
    const payMix = (d.payments || [])
      .map(p => ({ m: p.m || p.Method || 'Other', t: +p.t || 0 }))
      .filter(p => p.t > 0)
      .sort((a, b) => b.t - a.t);
    const payTotal = payMix.reduce((a, p) => a + p.t, 0);
    const topProds = (d.top || []).map(t => ({ name: t.name, q: +t.q || 0, rev: +t.rev || 0 }));
    const maxQ = Math.max(...topProds.map(t => t.q), 1);

    const chartW = 860;
    const chartH = 180;
    const padL = 45;
    const padR = 20;
    const padT = 30;
    const padB = 25;
    const barW = 20;
    const stepX = (chartW - padL - padR) / (days14.length - 1);

    // Floating Tooltip over Today's Bar
    const todayIndex = 13;
    const todayX = padL + todayIndex * stepX;
    const todayY = chartH - padB - (Math.min(todayRev, maxVal) / maxVal * (chartH - padT - padB));

    $('#main').innerHTML = `
      <!-- Header Row (Matches Screenshot Style: Title + Download Report) -->
      <div class="dash-head-row">
        <div>
          <h1 class="dash-title">Dashboard Overview</h1>
          <p style="font-size:12.5px;color:var(--text-muted);margin-top:3px">${new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • ${lastSale ? 'Last sale ' + lastSale.toLocaleDateString() + ' ' + lastSale.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No sales recorded yet'}</p>
        </div>
        <div style="display:flex;gap:10px">
          <button class="dash-primary-btn" onclick="go('pos')">
            ${ICONS.pos}
            <span>New Sale (F1)</span>
          </button>
          <button class="ghost sm" onclick="go('reports')">
            ${ICONS.download}
            <span>Download report</span>
          </button>
        </div>
      </div>

      <!-- KPI Row: the whole business at a glance -->
      <div class="dash-kpi-grid">
        <div class="dash-kpi" onclick="go('sales')" title="Open the sales ledger">
          <div class="dash-kpi-top">
            <span class="dash-kpi-label">Today's Sales</span>
            ${trend(delta(todayRev, yesterdayRev))}
          </div>
          <div class="dash-kpi-value">${money(todayRev)}</div>
          <div class="dash-kpi-foot">vs ${money(yesterdayRev)} yesterday • ${todayBills} bills</div>
        </div>

        <div class="dash-kpi" onclick="go('pos')" title="Ring up a sale">
          <div class="dash-kpi-top"><span class="dash-kpi-label">Today's Gross Profit</span></div>
          <div class="dash-kpi-value">${money(profitToday)}</div>
          <div class="dash-kpi-foot">Margin ${marginToday}% • avg bill ${money(avgTicket)}</div>
        </div>

        <div class="dash-kpi" onclick="go('reports')" title="Month report">
          <div class="dash-kpi-top">
            <span class="dash-kpi-label">Month to Date</span>
            ${trend(delta(monthRev, prevMonthRev))}
          </div>
          <div class="dash-kpi-value">${money(monthRev)}</div>
          <div class="dash-kpi-foot">${monthBills} bills • ${money(paceMonth)}/day of ${daysInMonth} days</div>
        </div>

        <div class="dash-kpi" onclick="go('expenses')" title="Record an expense">
          <div class="dash-kpi-top">
            <span class="dash-kpi-label">Net After Expenses (Month)</span>
            <span class="badge ${netMonth >= 0 ? 'success' : 'danger'}">${netMonth >= 0 ? '▲' : '▼'} ${money(Math.abs(netMonth))}</span>
          </div>
          <div class="dash-kpi-value">${money(netMonth)}</div>
          <div class="dash-kpi-foot">Profit ${money(monthProfit)} (${marginMonth}%) − expenses ${money(expensesMonth)}</div>
        </div>

        <div class="dash-kpi" onclick="go('stock')" title="Stock inventory">
          <div class="dash-kpi-top"><span class="dash-kpi-label">Stock Value</span></div>
          <div class="dash-kpi-value">${money(stockValue)}</div>
          <div class="dash-kpi-foot">${productCount} products • ${money(supplierDebt)} owed to suppliers</div>
        </div>

        <div class="dash-kpi dash-kpi-alert ${lowCount + expiryCount + openPOs ? 'has-alerts' : ''}" onclick="go('po')" title="Purchase orders">
          <div class="dash-kpi-top"><span class="dash-kpi-label">Action Needed</span></div>
          <div class="dash-kpi-value">${lowCount + expiryCount} <span style="font-size:13px;font-weight:700;color:var(--text-muted)">alerts</span></div>
          <div class="dash-kpi-foot">${lowCount} low stock • ${expiryCount} expiring • ${openPOs} open POs (${money(openPOValue)})</div>
        </div>
      </div>

      <!-- Sales velocity + payment mix -->
      <div class="dash-grid-main">
        <div class="dash-panel">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-section-title">Sales Velocity</h2>
              <div class="dash-panel-sub">Revenue per day, last 14 days</div>
            </div>
            <div class="dash-legend">
              <div class="dash-legend-item">
                <span class="dash-legend-dot" style="background:var(--accent)"></span>
                <span>Today (${money(todayRev)})</span>
              </div>
              <div class="dash-legend-item">
                <span class="dash-legend-dot" style="background:var(--chart-bar)"></span>
                <span>Sales Volume</span>
              </div>
            </div>
          </div>

          <div class="dash-chart-card">
        <svg class="dash-chart-svg" viewBox="0 0 ${chartW} ${chartH}">
          <!-- Dashed Horizontal Grid Lines -->
          <line x1="${padL}" y1="${padT}" x2="${chartW - padR}" y2="${padT}" stroke="var(--border)" stroke-dasharray="3 3"/>
          <text x="${padL - 8}" y="${padT + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${money(maxVal)}</text>

          <line x1="${padL}" y1="${padT + (chartH - padT - padB) * 0.33}" x2="${chartW - padR}" y2="${padT + (chartH - padT - padB) * 0.33}" stroke="var(--border)" stroke-dasharray="3 3"/>
          <text x="${padL - 8}" y="${padT + (chartH - padT - padB) * 0.33 + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${money(maxVal * 0.66)}</text>

          <line x1="${padL}" y1="${padT + (chartH - padT - padB) * 0.66}" x2="${chartW - padR}" y2="${padT + (chartH - padT - padB) * 0.66}" stroke="var(--border)" stroke-dasharray="3 3"/>
          <text x="${padL - 8}" y="${padT + (chartH - padT - padB) * 0.66 + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${money(maxVal * 0.33)}</text>

          <line x1="${padL}" y1="${chartH - padB}" x2="${chartW - padR}" y2="${chartH - padB}" stroke="var(--border)"/>
          <text x="${padL - 8}" y="${chartH - padB + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${money(0)}</text>

          <!-- Vertical Rounded Bars -->
          ${days14.map((pt, idx) => {
            const x = padL + idx * stepX - barW / 2;
            const h = Math.max(4, (pt.val / maxVal) * (chartH - padT - padB));
            const y = chartH - padB - h;
            const color = pt.isToday ? 'var(--accent)' : 'var(--chart-bar)';
            return `
              <rect class="chart-bar-rect" x="${x}" y="${y}" width="${barW}" height="${h}" rx="5" fill="${color}" onclick="toast.info('Day ${pt.day}: ${money(pt.val)}')"/>
              <text x="${x + barW / 2}" y="${chartH - 8}" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-weight="600">${pt.day}</text>
            `;
          }).join('')}
        </svg>

        <!-- Floating Tooltip Card over Today's Bar -->
        <div class="dash-chart-tooltip" style="left:${(todayX / chartW) * 100}%; top:${(todayY / chartH) * 100}%">
          <div class="dash-chart-tooltip-val">${money(todayRev)}</div>
          <div class="dash-chart-tooltip-label">Today's Sales (${todayBills} bills)</div>
        </div>
          </div>
        </div>

        <!-- Payment Mix (how customers pay) -->
        <div class="dash-panel">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-section-title">Payment Mix</h2>
              <div class="dash-panel-sub">Last 7 days • ${money(payTotal)} taken</div>
            </div>
          </div>
          ${payMix.length ? payMix.map(p => `
            <div class="dash-mix-row">
              <div class="dash-mix-head">
                <span class="dash-mix-name">${esc(p.m)}</span>
                <span class="dash-mix-amt">${money(p.t)}</span>
              </div>
              <div class="dash-bar-track"><div class="dash-bar-fill" style="width:${Math.max(3, (p.t / payTotal) * 100)}%"></div></div>
              <div class="dash-mix-pct">${(p.t / payTotal * 100).toFixed(1)}% of takings</div>
            </div>
          `).join('') : '<div class="dash-empty">No payments recorded in the last 7 days</div>'}
          <div class="dash-mix-footer">
            <span>Avg bill this month</span><b>${money(avgTicketMonth)}</b>
          </div>
          <div class="dash-mix-footer">
            <span>Best category</span><b>${esc(d.top_category || '-')}</b>
          </div>
          <div class="dash-mix-footer">
            <span>Customers served today</span><b>${custToday} of ${customers}</b>
          </div>
        </div>
      </div>

      <!-- Best sellers + stock alerts -->
      <div class="dash-grid-main">
        <div class="dash-panel">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-section-title">Best Sellers</h2>
              <div class="dash-panel-sub">All-time units sold and revenue</div>
            </div>
            <a class="dash-section-link" onclick="go('reports')">Full report &gt;</a>
          </div>
          <div class="dash-top-list">
            ${topProds.map((t, i) => `
              <div class="dash-top-row">
                <span class="dash-top-rank">${i + 1}</span>
                <div class="dash-top-main">
                  <div class="dash-top-name" title="${esc(t.name)}">${esc(t.name)}</div>
                  <div class="dash-bar-track"><div class="dash-bar-fill" style="width:${Math.max(4, (t.q / maxQ) * 100)}%"></div></div>
                </div>
                <div class="dash-top-nums">
                  <b>${Math.round(t.q)} sold</b>
                  <span>${money(t.rev)}</span>
                </div>
              </div>
            `).join('') || '<div class="dash-empty">No products sold yet</div>'}
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-section-title">Stock & Alerts</h2>
              <div class="dash-panel-sub">Reorder before you lose sales</div>
            </div>
            <a class="dash-section-link" onclick="go('stock')">Inventory &gt;</a>
          </div>
          ${expiryCount ? `
            <div class="dash-alert-banner warning" onclick="go('reports')">
              <b>${expiryCount} batch(es)</b> expire within 30 days — review before they spoil
            </div>
          ` : ''}
          <div class="dash-top-list">
            ${lowItems.map(p => `
              <div class="dash-top-row">
                <span class="dash-top-rank ${p.stock <= 0 ? 'out' : 'low'}">${p.stock <= 0 ? '!' : '•'}</span>
                <div class="dash-top-main">
                  <div class="dash-top-name" title="${esc(p.name)}">${esc(p.name)}</div>
                  <div class="dash-sub-line">${esc(p.category || 'General')} • reorder at ${p.reorder} • ${money(p.cost || p.price)} cost</div>
                </div>
                <div class="dash-top-nums">
                  <b class="${p.stock <= 0 ? 'txt-danger' : 'txt-warning'}">${p.stock <= 0 ? 'Out' : p.stock + ' left'}</b>
                  <button class="ghost sm" onclick="go('po')">Order</button>
                </div>
              </div>
            `).join('') || (lowCount + expiryCount ? '<div class="dash-empty">Stock levels look healthy</div>' : '<div class="dash-empty">✔ Nothing is below its reorder level right now</div>')}
          </div>
        </div>
      </div>

      <!-- Lower Split Section (Recent Transactions + Illustrated Action Card) -->
      <div class="dash-lower-split">
        <!-- Left Side: Recent Sales Ledger -->
        <div>
          <div class="dash-list-header">
            <h2 class="dash-section-title">Recent Transactions</h2>
            <a class="dash-section-link" onclick="go('sales')">Show all &gt;</a>
          </div>

          <div class="dash-row-list">
            ${(d.recent || []).slice(0, 4).map((s, idx) => {
              const bgColors = ['#bae6fd', '#fed7aa', '#fbcfe8', '#bbf7d0'];
              const custInitials = (s.customer || 'Walk-in').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
              return `
                <div class="dash-row-item">
                  <div class="dash-row-left">
                    <div class="dash-row-avatar" style="background:${bgColors[idx % bgColors.length]}">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <div class="dash-row-info">
                      <div class="dash-row-title">${esc(s.invoice_no)}</div>
                      <div class="dash-row-sub">${s.items_count || 2} items • ${esc(s.cashier || 'Cashier')}</div>
                    </div>
                  </div>
                  <div class="dash-cust-chip" title="${esc(s.customer || 'Walk-in')}">${custInitials}</div>
                  <span class="badge-pill ${s.status === 'Void' ? 'danger' : 'approved'}">${s.status || 'Completed'}</span>
                  <div class="dash-row-amount">${money(s.total)}</div>
                  <div class="dash-row-time">${new Date(s.created).toLocaleDateString()}, at ${new Date(s.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <button class="dash-row-action" onclick="reprint(${s.id})" title="Print Receipt">⋮</button>
                </div>
              `;
            }).join('') || '<small style="color:var(--text-muted)">No recent transactions recorded</small>'}
          </div>
        </div>

        <!-- Right Side: Shift Card + Quick Actions -->
        <div class="dash-side-col">
          <div class="dash-illust-card">
            <div class="dash-illust-content">
              <h3 class="dash-illust-title">${window.SH ? 'Drawer Open — Shift #' + window.SH.id : 'Register Closed'}</h3>
              <p class="dash-illust-desc">${window.SH
                ? `Opened by ${esc(window.SH.user_name || S.cashier)} • expected cash ${money((+window.SH.opening || 0) + todayRev)} with today's sales in.`
                : (lowCount > 0
                  ? `${lowCount} item(s) are below their reorder level. Raise a Purchase Order to restock.`
                  : 'Open a shift in Cash Register before you start selling.')}</p>
              <button class="dash-illust-btn" onclick="${window.SH ? "go('register')" : (lowCount > 0 ? "go('po')" : "go('register')")}">${window.SH ? 'View Shift' : (lowCount > 0 ? 'Create PO' : 'Open Shift')}</button>
            </div>
            <svg class="dash-illust-graphics" viewBox="0 0 100 100" fill="none">
              <rect x="50" y="40" width="40" height="60" rx="6" fill="#f472b6" opacity="0.6"/>
              <path d="M20 90C30 60 70 60 80 90Z" fill="var(--sb-bg)" opacity="0.8"/>
              <path d="M10 95C25 70 55 70 70 95Z" fill="var(--sb-bg)"/>
              <circle cx="80" cy="30" r="14" fill="var(--accent)" opacity="0.8"/>
            </svg>
          </div>

          <div class="dash-panel dash-quick-panel">
            <div class="dash-panel-head">
              <div>
                <h2 class="dash-section-title">Quick Actions</h2>
                <div class="dash-panel-sub">Jump straight into a task</div>
              </div>
            </div>
            <div class="dash-quick-grid">
              <button class="dash-quick" onclick="go('pos')">${ICONS.pos}<span>Ring up sale</span></button>
              <button class="dash-quick" onclick="go('po')">${ICONS.po}<span>New purchase order</span></button>
              <button class="dash-quick" onclick="go('expenses')">${ICONS.expenses}<span>Record expense</span></button>
              <button class="dash-quick" onclick="go('customers')">${ICONS.customers}<span>Add customer</span></button>
              <button class="dash-quick" onclick="go('stock')">${ICONS.stock}<span>Stock count</span></button>
              <button class="dash-quick" onclick="go('reports')">${ICONS.reports}<span>Run reports</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async pos() {
    [P, C] = await Promise.all([A('products.list'), A('customers.list')]);
    const categories = ['All', ...new Set(P.map(p => p.category).filter(Boolean))];
    window.focusedTileIndex = -1;

    $('#main').innerHTML = `
      <div class="dash-head-row" style="margin-bottom:12px">
        <div>
          <h1 class="dash-title">POS Terminal Checkout</h1>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px">
            <span class="pos-kb-badge"><b>F1</b> Search</span>
            <span class="pos-kb-badge"><b>↑↓←→</b> Select Product</span>
            <span class="pos-kb-badge"><b>Enter</b> Add to Cart</span>
            <span class="pos-kb-badge"><b>Tab / F2</b> Checkout</span>
            <span class="pos-kb-badge"><b>Esc</b> Clear</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="pos-font-bar" title="Change Terminal Font Size">
            <span style="font-size:11px;font-weight:700;color:var(--text-muted);margin-right:2px">Font:</span>
            <button class="pos-fs-btn" onclick="stepFontSize(-1)" title="Smaller font (A-)">A−</button>
            <span id="pos-fs-indicator" style="font-weight:800;font-size:12px;min-width:32px;text-align:center">${S.fontSize || '14px'}</span>
            <button class="pos-fs-btn" onclick="stepFontSize(1)" title="Larger font (A+)">A+</button>
          </div>

          ${HELD.length ? `
            <button class="btn sm" style="background:var(--accent);color:#1e293b" onclick="resumeSale()" title="Resume held cart">
              Resume Held (${HELD.length})
            </button>
          ` : `
            <button class="ghost sm" onclick="holdSale()" title="Hold current sale (F4)">
              Hold (F4)
            </button>
          `}

          <button class="ghost sm danger" onclick="clr()" title="Clear cart (Esc)">
            ✕ Clear Cart
          </button>
        </div>
      </div>

      <div class="pos">
        <!-- Product Catalog Section -->
        <section class="pos-catalog">
          <div class="pos-search-wrap">
            <svg class="pos-search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="q" class="pos-search-input" placeholder="Scan barcode or type to search products (Press F1 / Arrow keys)..." autofocus>
            <button id="q-clear" class="pos-search-clear" onclick="$('#q').value='';gridR();$('#q').focus()" style="display:none">✕</button>
          </div>

          <div class="category-bar">
            ${categories.map(c => `
              <div class="cat-pill ${c === 'All' ? 'active' : ''}" onclick="filterCat('${esc(c)}', this)">
                ${esc(c)}
              </div>
            `).join('')}
          </div>

          <div id="gr" class="grid"></div>
        </section>

        <!-- Cart & Checkout Register Section -->
        <section class="cart">
          <div class="cart-header">
            <div class="cart-title">
              ${ICONS.pos}
              <span>Current Sale</span>
              <span id="cart-count-badge" class="cart-badge">0 items</span>
            </div>
            <button class="ghost sm" onclick="go('customers')" title="Manage Customers">+ New Cust</button>
          </div>

          <select id="cu" onchange="setCu(this.value)" class="pos-cust-select">
            <option value="">Walk-in Customer</option>
            ${C.map(c => `<option value="${c.id}" ${window.cust && window.cust.id == c.id ? 'selected' : ''}>${esc(c.name)} (${esc(c.phone || 'No phone')}) • ${c.tier || 'Standard'}</option>`).join('')}
          </select>

          <div id="ci" class="cart-items-container"></div>

          <!-- Step-by-Step Mouse-less Checkout Flow -->
          <div class="pos-checkout-flow">
            <!-- 1. Promo Code -->
            <div class="pos-code-row">
              <span class="pos-field-tag">Promo (↵)</span>
              <input id="cpn" placeholder="Promo code (or Enter to skip)" class="pos-coupon-input" value="${window.cp ? window.cp.code : ''}">
              <button type="button" class="ghost sm" onclick="applyCp()">Apply</button>
            </div>

            <!-- 2. Manual Discount -->
            <div class="pos-code-row">
              <span class="pos-field-tag">Discount (↵)</span>
              <input id="pos-disc" type="text" placeholder="Amount or % (e.g. 500 or 10%)" class="pos-coupon-input" value="${disc ? disc : ''}">
              <button type="button" class="ghost sm" onclick="applyManualDisc()">Apply</button>
            </div>

            <!-- Fast Cash Tender (LKR) -->
            <div class="pos-fast-cash">
              <button type="button" class="pos-fast-btn" onclick="tenderFast('exact')" title="Tender exact cart total">Exact</button>
              <button type="button" class="pos-fast-btn" onclick="tenderFast(500)">500</button>
              <button type="button" class="pos-fast-btn" onclick="tenderFast(1000)">1,000</button>
              <button type="button" class="pos-fast-btn" onclick="tenderFast(2000)">2,000</button>
              <button type="button" class="pos-fast-btn" onclick="tenderFast(5000)">5,000</button>
            </div>

            <!-- 3. Cash Tendered Input -->
            <div class="pos-tender-row">
              <span class="pos-tender-tag">Cash Received (LKR)</span>
              <input id="pos-tender-cash" type="number" step="0.01" placeholder="Cash tendered (Enter to complete)" class="pos-tender-input">
            </div>
          </div>

          <div id="tt" class="cart-totals-box"></div>

          <div id="py"></div>

          <button id="charge-btn" class="cart-charge-btn" onclick="charge()">
            <span>CHARGE & PRINT (Enter / F2)</span>
            <span id="charge-total-tag" class="charge-btn-tag">${money(0)}</span>
          </button>
        </section>
      </div>
    `;

    window.activeCatFilter = 'All';

    // Search input handlers
    $('#q').oninput = gridR;
    $('#q').onkeydown = e => {
      if (e.key === 'Enter') {
        const v = e.target.value.trim().toLowerCase();
        if (v) {
          const p = P.find(x => (x.barcode && x.barcode.toLowerCase() === v) || (x.sku && x.sku.toLowerCase() === v) || (x.name && x.name.toLowerCase() === v));
          if (p) {
            add(p.id);
            e.target.value = '';
            gridR();
          } else {
            toast.info(`No product found for "${v}"`);
          }
        } else {
          // If search is empty, transition to checkout promo input if cart has items
          if (window.focusedTileIndex >= 0) {
            const tiles = $$('#gr .tile');
            if (tiles[window.focusedTileIndex]) {
              const pid = +tiles[window.focusedTileIndex].dataset.pid;
              if (pid) add(pid);
            }
          } else if (cart.length > 0) {
            e.preventDefault();
            $('#cpn')?.focus();
          }
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const tiles = $$('#gr .tile');
        if (tiles.length) {
          e.preventDefault();
          window.focusedTileIndex = 0;
          updateTileFocus();
          $('#q').blur();
        }
      }
    };

    // Promo Code input sequential Enter handler
    const cpnInput = $('#cpn');
    if (cpnInput) {
      cpnInput.onkeydown = async e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (cpnInput.value.trim()) {
            await applyCp();
          }
          $('#pos-disc')?.focus();
        }
      };
    }

    // Discount input sequential Enter handler
    const discInput = $('#pos-disc');
    if (discInput) {
      discInput.onkeydown = e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyManualDisc();
          const cashInput = $('#pos-tender-cash');
          if (cashInput) {
            const t = typeof totals === 'function' ? totals() : calc(cart, disc);
            if (!cashInput.value && t.total > 0) {
              cashInput.placeholder = t.total.toFixed(2);
            }
            cashInput.focus();
          }
        }
      };
    }

    // Cash Tendered input sequential Enter handler
    const cashInput = $('#pos-tender-cash');
    if (cashInput) {
      cashInput.oninput = e => {
        const v = +e.target.value;
        if (typeof pays !== 'undefined' && pays.length) {
          pays[0].a = v;
          pays[0].t = 1;
        }
        if (typeof sumR === 'function') sumR();
      };
      cashInput.onkeydown = e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const v = cashInput.value.trim();
          const t = typeof totals === 'function' ? totals() : calc(cart, disc);
          if (typeof pays !== 'undefined' && pays.length) {
            pays[0].a = v ? +v : +m(t.total);
            pays[0].t = 1;
          }
          charge();
        }
      };
    }

    // Full Mouse-less Global Keyboard Operations
    window.onkeydown = e => {
      if (view !== 'pos') return;
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA');

      if (e.key === 'F1') {
        e.preventDefault();
        window.focusedTileIndex = -1;
        updateTileFocus();
        $('#q')?.focus();
        return;
      }
      if (e.key === 'F2') {
        e.preventDefault();
        charge();
        return;
      }
      if (e.key === 'F4') {
        e.preventDefault();
        holdSale();
        return;
      }
      if (e.key === 'Escape') {
        if (activeEl?.id === 'q' && activeEl.value) {
          activeEl.value = '';
          gridR();
        } else {
          clr();
        }
        return;
      }
      if (e.key === 'Tab' && activeEl?.id !== 'cpn' && activeEl?.id !== 'pos-disc' && activeEl?.id !== 'pos-tender-cash') {
        e.preventDefault();
        $('#cpn')?.focus();
        return;
      }

      // If typing in an input other than arrow down on search, do not intercept
      if (isInput && activeEl?.id !== 'q') return;

      // Product Tile Arrow-Key Navigation
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        const tiles = $$('#gr .tile');
        if (!tiles.length) return;
        e.preventDefault();
        if (activeEl?.id === 'q') activeEl.blur();

        const cols = getGridCols();
        if (window.focusedTileIndex < 0) {
          window.focusedTileIndex = 0;
        } else if (e.key === 'ArrowRight') {
          window.focusedTileIndex = Math.min(tiles.length - 1, window.focusedTileIndex + 1);
        } else if (e.key === 'ArrowLeft') {
          window.focusedTileIndex = Math.max(0, window.focusedTileIndex - 1);
        } else if (e.key === 'ArrowDown') {
          window.focusedTileIndex = Math.min(tiles.length - 1, window.focusedTileIndex + cols);
        } else if (e.key === 'ArrowUp') {
          window.focusedTileIndex = Math.max(0, window.focusedTileIndex - cols);
        }
        updateTileFocus();
        return;
      }

      // Enter key to add focused product tile or checkout
      if (e.key === 'Enter' && !isInput) {
        const tiles = $$('#gr .tile');
        if (window.focusedTileIndex >= 0 && window.focusedTileIndex < tiles.length) {
          e.preventDefault();
          const tile = tiles[window.focusedTileIndex];
          const pid = +tile.dataset.pid;
          if (pid) {
            add(pid);
            tile.classList.add('tile-added');
            setTimeout(() => tile.classList.remove('tile-added'), 300);
          }
        } else if (cart.length > 0) {
          e.preventDefault();
          $('#cpn')?.focus();
        }
      }
    };

    $('#q').focus();
    gridR();
    cartR();
  },

  async products() {
    await tbl('products', ['sku', 'name', 'category', 'price', 'stock']);
  },

  async customers() {
    await tbl('customers', ['name', 'phone', 'email', 'address']);
  },

  async sales() {
    const r = await A('sales.list');
    R.sales = r;
    $('#main').innerHTML = `
      <div class="dash-head-row">
        <h1 class="dash-title">Sales Ledger & Invoices</h1>
        <button class="dash-primary-btn" onclick="xp('pdf')">${ICONS.download} Export Ledger PDF</button>
      </div>
      <div style="background:var(--content-bg);border:1px solid var(--border);border-radius:20px;padding:20px">
        <table class="t">
          <tr>
            <th>Invoice</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Total</th>
            <th>Status</th>
            <th style="text-align:right">Action</th>
          </tr>
          ${r.map(s => `
            <tr>
              <td><code>${s.invoice_no}</code></td>
              <td>${new Date(s.created).toLocaleDateString()}</td>
              <td><b>${esc(s.customer || 'Walk-in')}</b></td>
              <td>${s.method}</td>
              <td><b>${money(s.total)}</b></td>
              <td><span class="badge-pill ${s.status === 'Void' ? 'danger' : 'approved'}">${s.status || 'Completed'}</span></td>
              <td style="text-align:right">
                <button class="ghost sm" onclick="reprint(${s.id})">Reprint</button>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  },

  async settings() {
    await refreshConnectedPrinters();
    SET_DEFS = [
      {
        k: 'profile', t: 'Store Profile', i: ICONS.branches,
        d: 'Your shop identity — printed on every receipt',
        f: [
          ['name', 'Store Name', '', 'Printed at the top of the bill'],
          ['tagline', 'Tagline / Slogan'],
          ['logo', 'Store Logo Image URL', '', 'Paste a link to a PNG/JPG, leave empty for none'],
          ['address', 'Physical Address'],
          ['phone', 'Phone Number'],
          ['email', 'Official Email'],
          ['website', 'Website URL']
        ]
      },
      {
        k: 'receipt', t: 'Receipt & Printing', i: ICONS.sales, extra: 'receipt',
        d: 'Paper size, invoice format, target printer hardware and bill layout',
        f: [
          ['printer', 'Target Receipt Printer', 'printer', 'Select connected printer to print customer receipts (or System Default)'],
          ['paper', 'Paper Format Width', 'sel:80mm (Standard Thermal),58mm (Small Thermal),210mm (A4 Full Page)', 'Match your printer roll'],
          ['rcFontSize', 'Receipt Font Size', 'sel:10px (Tiny),11px (Compact),12px (Standard),13px (Medium),14px (Large),16px (Extra Large)', 'Lettering size on the printed receipt'],
          ['prefix', 'Invoice Number Prefix', '', 'INV-000123 style numbers'],
          ['cashier', 'Default Cashier Name', '', 'Shown when no staff is signed in'],
          ['showVat', 'Show Tax Line on Receipt', 'bool'],
          ['showCashier', 'Show Cashier Name', 'bool'],
          ['showCustomer', 'Show Customer Details', 'bool'],
          ['autoPrint', 'Print Automatically after Checkout', 'bool'],
          ['footer', 'Receipt Footer Message', 'area'],
          ['returnPolicy', 'Return & Refund Policy Text', 'area', 'Printed at the bottom of full-page bills']
        ]
      },
      {
        k: 'display', t: 'Display & Typography', i: ICONS.dashboard, extra: 'display',
        d: 'How big the text and the POS product cards are',
        f: [
          ['fontSize', 'Application Font Size', 'sel:12px (Compact),13.5px (Default),15px (Medium),16.5px (Large),18px (Extra Large)', 'Applies to the whole app instantly'],
          ['posDensity', 'POS Grid Card Size', 'sel:Comfortable (Large Touch Cards),Compact (Standard),Dense (High Density)', 'Product tiles on the POS Terminal'],
          ['dark', 'Dark Mode', 'bool', 'Switch the whole app to the dark palette']
        ]
      },
      {
        k: 'sidebar', t: 'Sidebar & Menu', i: ICONS.pinHome, extra: 'sidebar',
        d: 'Width of the left menu and the size of its lettering',
        f: [
          ['sbWidth', 'Sidebar Width', 'sel:180 (Very Narrow),200 (Narrow),220 (Default),250 (Wide),280 (Very Wide),320 (Extra Wide)', 'Pixels — the preview updates as you pick'],
          ['sbFontSize', 'Sidebar Letter Size', 'sel:11px (Small),12.5px (Default),14px (Medium),16px (Large),18px (Extra Large)', 'Menu labels and section headers']
        ]
      },
      {
        k: 'theme', t: 'Theme & Colours', i: ICONS.palette, extra: 'themes',
        d: 'One-click palettes, or fine-tune each colour yourself',
        f: [
          ['sidebar', 'Sidebar Colour', 'color'],
          ['primary', 'Primary Button Colour', 'color'],
          ['accent', 'Highlight Colour', 'color'],
          ['chartBar', 'Chart Bar Colour', 'color']
        ]
      },
      {
        k: 'tax', t: 'Tax & Currency', i: ICONS.expenses,
        d: 'Currency symbol, tax label and the rate you charge',
        f: [
          ['currency', 'Currency Symbol', '', 'Used everywhere money is shown (default LKR)'],
          ['vatLabel', 'Tax Label', '', 'Sales Tax, VAT, GST…'],
          ['vatNo', 'Tax Registration No.', '', 'TIN / VAT number printed on the bill'],
          ['vatRate', 'Tax / VAT %', 'number', 'Charged on taxable items at checkout'],
          ['vatInclusive', 'Prices Already Include Tax', 'bool', 'Yes = the shelf price is the final price']
        ]
      },
      {
        k: 'loyalty', t: 'Loyalty & Members', i: ICONS.customers,
        d: 'Points earning and membership discounts',
        f: [
          ['loyaltyEarn', 'Points per 1,000 LKR Spent', 'number', '0 disables earning'],
          ['loyaltyValue', 'Value of 1 Point (LKR)', 'number', 'What a point is worth at redemption'],
          ['tierDisc', 'Tier Discounts', '', 'Format: Silver:2,Gold:5,Platinum:8']
        ]
      }
    ];

    SET_ACTIVE = 0;
    setDirty(false);

    $('#main').innerHTML = `
      <div class="dash-head-row set-head">
        <div>
          <h1 class="dash-title">Settings</h1>
          <p style="font-size:12.5px;color:var(--text-muted);margin-top:3px">Pick a category on the left — changes preview live and are saved when you press Save.</p>
        </div>
        <div class="set-actions">
          <span id="set-dirty" class="set-dirty" style="display:none">● Unsaved changes</span>
          <button class="ghost" onclick="resetSet()">Discard</button>
          <button class="dash-primary-btn" onclick="saveSet()">${ICONS.check} Save Changes</button>
        </div>
      </div>

      <div class="set-shell">
        <aside class="set-rail">
          <div class="set-search">
            ${ICONS.search}
            <input id="set-q" placeholder="Search settings" oninput="setSearch(this.value)" autocomplete="off">
          </div>
          <div class="set-rail-list">
            ${SET_DEFS.map((s, i) => `
              <button type="button" class="set-rail-item ${i === 0 ? 'on' : ''}" onclick="setSection(${i})">
                <span class="set-rail-icon">${s.i}</span>
                <span class="set-rail-txt"><b>${s.t}</b><small>${s.d}</small></span>
              </button>
            `).join('')}
          </div>
        </aside>
        <div class="set-pane" id="set-pane"></div>
      </div>
    `;

    setSection(0);
  }
};

window.filterCat = (cat, el) => {
  window.activeCatFilter = cat;
  $$('.cat-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  gridR();
};

  const pv = () => {
  const T = { ...S };
  document.querySelectorAll('[id^=s_]').forEach(e => {
    if (!e.id.endsWith('_txt')) {
      T[e.id.slice(2)] = e.type === 'checkbox' ? (e.checked ? '1' : '0') : e.value;
    }
  });
  window.T = T;
  theme(T);
};

const saveSet = guard(async () => {
  pv();
  S = { ...window.T };
  await A('settings.set', S);
  theme();
  nav();
  setDirty(false);
  toast.success('Settings saved!');
});

function getGridCols() {
  const gr = $('#gr');
  if (!gr || !gr.children.length) return 3;
  const first = gr.children[0];
  const colWidth = first.offsetWidth || 180;
  return Math.max(1, Math.round(gr.offsetWidth / colWidth));
}

function updateTileFocus() {
  const tiles = $$('#gr .tile');
  tiles.forEach((t, i) => {
    if (i === window.focusedTileIndex) {
      t.classList.add('focused');
      t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    } else {
      t.classList.remove('focused');
    }
  });
}

function gridR() {
  const q = ($('#q') ? $('#q').value : '').toLowerCase().trim();
  const clearBtn = $('#q-clear');
  if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

  const cat = window.activeCatFilter || 'All';

  const filtered = P.filter(p => {
    const matchQ = !q || (p.name + (p.category || '') + (p.barcode || '') + (p.sku || '')).toLowerCase().includes(q);
    const matchCat = cat === 'All' || p.category === cat;
    return matchQ && matchCat;
  });

  const gr = $('#gr');
  if (!gr) return;

  gr.innerHTML = filtered.slice(0, 60).map((p, idx) => {
    const isLow = +p.stock <= +p.reorder;
    const isOut = +p.stock <= 0;
    const stockClass = isOut ? 'out-of-stock' : isLow ? 'low-stock' : 'in-stock';
    const stockText = isOut ? 'Out of stock' : isLow ? `Low (${p.stock})` : `${p.stock} in stock`;
    const isFocused = idx === window.focusedTileIndex;

    return `
      <div class="tile ${isFocused ? 'focused' : ''}" data-idx="${idx}" data-pid="${p.id}" onclick="add(${p.id})">
        <div>
          <div class="tile-badge">${esc(p.category || 'General')}</div>
          <div class="tile-name" title="${esc(p.name)}">${esc(p.name)}</div>
          ${p.sku || p.barcode ? `<div class="tile-barcode">${esc(p.sku || p.barcode)}</div>` : ''}
        </div>
        <div class="tile-footer">
          <div class="tile-price">${money(p.price)}</div>
          <span class="tile-stock ${stockClass}">● ${stockText}</span>
        </div>
      </div>
    `;
  }).join('') || `
    <div style="grid-column:1/-1;padding:48px 20px;text-align:center;color:var(--text-muted)">
      <div style="font-size:28px;margin-bottom:8px">🔍</div>
      <b>No products matching "${esc(q)}"</b>
      <p style="font-size:12px;margin-top:4px">Check your spelling or choose another category</p>
    </div>
  `;
}

function add(id) {
  const p = P.find(x => x.id === id);
  if (!p) return;
  const c = cart.find(x => x.id === id);
  if (c) c.qty++;
  else cart.push({ id: p.id, name: p.name, price: +p.price, cost: +p.cost || (+p.price * 0.6), qty: 1, taxable: p.taxable });
  cartR();
}

function chg(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  cartR();
}

window.tenderFast = amt => {
  const t = typeof totals === 'function' ? totals() : calc(cart, disc);
  let tendered = 0;
  if (amt === 'exact') {
    tendered = +m(t.total);
  } else {
    tendered = +amt;
  }
  if (typeof pays !== 'undefined' && pays.length) {
    pays[0].a = tendered;
    pays[0].t = 1;
  }
  const tc = $('#pos-tender-cash');
  if (tc) tc.value = tendered;
  if (typeof sumR === 'function') sumR();
};

window.applyManualDisc = () => {
  const input = $('#pos-disc');
  const v = (input ? input.value : '').trim();
  const sub = cart.reduce((a, i) => a + i.price * i.qty, 0);
  if (!v) {
    disc = 0;
  } else if (v.endsWith('%')) {
    const pct = parseFloat(v);
    disc = isNaN(pct) ? 0 : Math.max(0, sub * pct / 100);
  } else {
    const amt = parseFloat(v);
    disc = isNaN(amt) ? 0 : Math.max(0, amt);
  }
  cartR();
};

function cartR() {
  const ci = $('#ci');
  if (!ci) return;

  const countBadge = $('#cart-count-badge');
  const totalCount = cart.reduce((a, c) => a + c.qty, 0);
  if (countBadge) countBadge.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  ci.innerHTML = cart.map((c, i) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name" title="${esc(c.name)}">${esc(c.name)}</div>
        <div class="cart-item-meta">${money(c.price)} each</div>
      </div>
      <div class="cart-item-qty-wrap">
        <button class="cart-qty-btn" onclick="chg(${i},-1)" title="Decrease">−</button>
        <span class="cart-qty-val">${c.qty}</span>
        <button class="cart-qty-btn" onclick="chg(${i},1)" title="Increase">+</button>
      </div>
      <div class="cart-item-total">${money(c.price * c.qty)}</div>
      <button class="cart-item-del" onclick="cart.splice(${i},1);cartR()" title="Remove">✕</button>
    </div>
  `).join('') || `
    <div style="padding:48px 20px;text-align:center;color:var(--text-muted)">
      <div style="font-size:28px;margin-bottom:8px">🛒</div>
      <b>Cart is Empty</b>
      <p style="font-size:12px;margin-top:4px">Click, scan items or use arrow keys to ring up</p>
    </div>
  `;

  const t = typeof totals === 'function' ? totals() : calc(cart, disc);

  $('#tt').innerHTML = `
    <div class="r2"><span>Subtotal (${totalCount} pcs)</span><b>${money(t.sub)}</b></div>
    ${t.cd ? `<div class="r2"><span>Coupon (${esc(window.cp?.code)})</span><b style="color:var(--danger-text)">-${money(t.cd)}</b></div>` : ''}
    ${t.disc && !t.cd ? `<div class="r2"><span>Discount</span><b style="color:var(--danger-text)">-${money(t.disc)}</b></div>` : ''}
    ${+S.vatRate > 0 ? `<div class="r2"><span>${esc(S.vatLabel)} (${S.vatRate}%)</span><b>${money(t.vat)}</b></div>` : ''}
    <div class="cart-grand-total">
      <span class="cart-grand-label">Total Due</span>
      <span class="cart-grand-val">${money(t.total)}</span>
    </div>
  `;

  const tag = $('#charge-total-tag');
  if (tag) tag.textContent = money(t.total);

  const tc = $('#pos-tender-cash');
  if (tc && !tc.value && t.total > 0) {
    tc.placeholder = t.total.toFixed(2);
  }

  if (typeof payR === 'function') payR();
}

let charge = guard(async () => {
  if (!cart.length) return toast.warning('Cart is empty');
  const t = typeof totals === 'function' ? totals() : calc(cart, disc);
  const s = {
    customer_id: $('#cu')?.value || null,
    subtotal: +m(t.sub),
    discount: +m(t.disc),
    vat: +m(t.vat),
    total: +m(t.total),
    paid: +m(t.total),
    change_due: 0,
    method: 'Cash',
    cashier: S.cashier,
    prefix: S.prefix,
    items: cart
  };

  const r = await A('sale.create', s);
  const h = receipt({ ...s, ...r }, cart);
  cart = [];
  disc = 0;
  await go('pos');
  showRc(h);
  toast.success(`Sale ${r.invoice_no} finalized!`);
});

const reprint = guard(async id => {
  const s = (R.sales || []).find(x => x.id == id);
  const it = await A('sale.items', id);
  showRc(receipt(s, it));
});

async function tbl(k, cols) {
  const r = await A(k + '.list');
  R[k] = r;
  $('#main').innerHTML = `
    <div class="dash-head-row">
      <h1 class="dash-title" style="text-transform:capitalize">${k}</h1>
      <button class="dash-primary-btn" onclick="edit('${k}')">+ Add ${k.slice(0, -1)}</button>
    </div>
    <div style="background:var(--content-bg);border:1px solid var(--border);border-radius:20px;padding:20px">
      <table class="t">
        <tr>
          ${cols.map(c => `<th>${c.toUpperCase()}</th>`).join('')}
          <th style="text-align:right">Action</th>
        </tr>
        ${r.map(x => `
          <tr>
            ${cols.map(c => `<td>${c === 'price' || c === 'cost' ? money(x[c]) : esc(x[c])}</td>`).join('')}
            <td style="text-align:right">
              <button class="ghost sm" onclick="edit('${k}',${x.id})">Edit</button>
              <button class="ghost sm" style="color:var(--danger-text)" onclick="del('${k}',${x.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
}

window.markInvalid = (fieldId, message) => {
  const el = $('#' + fieldId);
  if (el) {
    el.classList.add('field-invalid');
    el.focus();
    el.addEventListener('input', () => el.classList.remove('field-invalid'), { once: true });
    el.addEventListener('change', () => el.classList.remove('field-invalid'), { once: true });
  }
  toast.warning(message);
};

window.validateForm = (k, o, id) => {
  if (k === 'products') {
    const name = (o.name || '').trim();
    if (!name) {
      markInvalid('f_name', 'Product Name is required');
      return false;
    }
    const cat = (o.category || '').trim();
    if (!cat) {
      markInvalid('f_category', 'Product Category is required');
      return false;
    }
    const price = +o.price;
    if (isNaN(price) || price <= 0) {
      markInvalid('f_price', 'Selling price must be greater than 0');
      return false;
    }
    const cost = +o.cost;
    if (isNaN(cost) || cost < 0) {
      markInvalid('f_cost', 'Cost price cannot be negative');
      return false;
    }
    const stock = +o.stock;
    if (isNaN(stock) || stock < 0) {
      markInvalid('f_stock', 'Stock on hand cannot be negative');
      return false;
    }
    const reorder = +o.reorder;
    if (isNaN(reorder) || reorder < 0) {
      markInvalid('f_reorder', 'Reorder level cannot be negative');
      return false;
    }
    return true;
  }

  if (k === 'categories') {
    const name = (o.name || '').trim();
    if (!name) {
      markInvalid('f_name', 'Category Name is required');
      return false;
    }
    return true;
  }

  if (k === 'suppliers') {
    const name = (o.name || '').trim();
    if (!name) {
      markInvalid('f_name', 'Supplier Company Name is required');
      return false;
    }
    const phone = (o.phone || '').trim();
    if (!phone) {
      markInvalid('f_phone', 'Supplier Contact Phone is required');
      return false;
    }
    const email = (o.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markInvalid('f_email', 'Please enter a valid email address');
      return false;
    }
    return true;
  }

  if (k === 'customers') {
    const name = (o.name || '').trim();
    if (!name) {
      markInvalid('f_name', 'Customer Full Name is required');
      return false;
    }
    const phone = (o.phone || '').trim();
    if (!phone) {
      markInvalid('f_phone', 'Customer Mobile Phone is required');
      return false;
    }
    const email = (o.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markInvalid('f_email', 'Please enter a valid email address');
      return false;
    }
    const credit = +o.credit || 0;
    if (credit < 0) {
      markInvalid('f_credit', 'Store credit cannot be negative');
      return false;
    }
    return true;
  }

  if (k === 'expenses') {
    const cat = (o.category || '').trim();
    if (!cat) {
      markInvalid('f_category', 'Expense Category is required');
      return false;
    }
    const amt = +o.amount;
    if (isNaN(amt) || amt <= 0) {
      markInvalid('f_amount', 'Expense amount must be greater than 0');
      return false;
    }
    return true;
  }

  if (k === 'coupons') {
    const code = (o.code || '').trim().toUpperCase();
    if (!code) {
      markInvalid('f_code', 'Coupon Promo Code is required');
      return false;
    }
    o.code = code;
    const val = +o.value;
    if (isNaN(val) || val <= 0) {
      markInvalid('f_value', 'Coupon discount value must be greater than 0');
      return false;
    }
    if (o.type === 'percent' && val > 100) {
      markInvalid('f_value', 'Percentage discount cannot exceed 100%');
      return false;
    }
    return true;
  }

  if (k === 'branches') {
    const name = (o.name || '').trim();
    if (!name) {
      markInvalid('f_name', 'Branch / Outlet Name is required');
      return false;
    }
    const phone = (o.phone || '').trim();
    if (!phone) {
      markInvalid('f_phone', 'Branch Contact Number is required');
      return false;
    }
    return true;
  }

  if (k === 'users') {
    const u = (o.username || '').trim();
    if (!u) {
      markInvalid('f_username', 'Login Username is required');
      return false;
    }
    if (u.length < 3) {
      markInvalid('f_username', 'Username must be at least 3 characters');
      return false;
    }
    const fn = (o.fullname || '').trim();
    if (!fn) {
      markInvalid('f_fullname', 'Full Staff Name is required');
      return false;
    }
    const p = (o.password || '').trim();
    if (!id && (!p || p.length < 3)) {
      markInvalid('f_password', 'Password must be at least 3 characters for new accounts');
      return false;
    }
    return true;
  }

  return true;
};

function edit(k, id) {
  const r = (id && R[k]?.find(x => x.id == id)) || { taxable: 1, reorder: 5 };
  const reqFields = ['name', 'category', 'price', 'code', 'value', 'username', 'fullname', 'phone', 'amount'];
  modal(`
    <div class="mb-header">
      <h3 style="margin:0">${id ? 'Edit' : 'Add New'} ${k.slice(0, -1)}</h3>
      <button class="ghost sm" onclick="modal()">${ICONS.close}</button>
    </div>
    <div class="g2">
      ${(F[k] || []).map(([n, l, t]) => {
        const isReq = reqFields.includes(n);
        const reqBadge = isReq ? '<span style="color:var(--danger-text);margin-left:3px">*</span>' : '';
        return t === 'check'
          ? `<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="f_${n}" ${r[n] ? 'checked' : ''}> ${l}</label>`
          : `<label>${l}${reqBadge}<input id="f_${n}" type="${t || 'text'}" value="${esc(r[n] ?? (t === 'number' ? (n === 'reorder' ? 5 : '') : ''))}"></label>`;
      }).join('')}
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" onclick="modal()">Cancel</button>
      <button type="button" class="btn" onclick="saveRow('${k}',${id || 0})">${ICONS.check} Save Record</button>
    </div>
  `);
}

const saveRow = guard(async (k, id) => {
  const o = { id };
  (F[k] || []).forEach(([n, , t]) => {
    const e = $('#f_' + n);
    if (!e) return;
    o[n] = t === 'check' ? (e.checked ? 1 : 0) : t === 'number' ? +e.value : (e.value || '').trim();
  });
  if (typeof validateForm === 'function' && !validateForm(k, o, id)) {
    return;
  }
  await A(k + '.save', o);
  modal();
  toast.success('Record saved successfully!');
  go(k);
});

const del = guard(async (k, id) => {
  if (confirm('Delete this record?')) {
    await A(k + '.del', id);
    toast.info('Deleted');
    go(k);
  }
});

// Bootstrapper
(async () => {
  try {
    S = { ...D, ...await A('settings.get') };
    if (!S.name || S.name === 'Teal & Mint (Default)' || S.name === 'PinHome') {
      S.name = 'Amectar POS';
      A('settings.set', { name: S.name }).catch(() => {});
    }
    if (!S.currency || S.currency === '$') {
      S.currency = 'LKR';
      A('settings.set', { currency: 'LKR' }).catch(() => {});
    }
    A('printers.list').then(list => { window.connectedPrinters = list || []; }).catch(() => {});
  } catch (e) {
    console.error('Settings error:', e);
  }
  theme();
  if (typeof boot === 'function') {
    boot();
  } else {
    nav();
    go('dashboard');
  }
})();
