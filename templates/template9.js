window.templates = window.templates || {};
window.templates[9] = `
<div class="invoice-template t9-root">
  <style>
    .t9-root{
      width:595px;
      min-height:842px;
      height: auto !important;
      position:relative;
      overflow: visible;
      box-sizing:border-box;
      font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, Helvetica, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(15,23,42,0.08), transparent 28%),
        radial-gradient(circle at top right, rgba(37,99,235,0.10), transparent 24%),
        linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
      color:#0f172a;
    }

    .t9-shell{
      position:relative;
      z-index:2;
      padding:24px 26px 22px;
      min-height:842px;
      box-sizing:border-box;
    }

    .t9-accent{
      height:12px;
      border-radius:999px;
      margin-bottom:18px;
      background:linear-gradient(90deg,#0f172a 0%,#1d4ed8 48%,#2563eb 72%,#7c3aed 100%);
      box-shadow:0 10px 28px rgba(15,23,42,0.12);
    }

    .t9-header{
      display:flex;
      justify-content:space-between;
      gap:16px;
      align-items:stretch;
      margin-bottom:16px;
    }

    .t9-brand{
      flex:1;
      display:flex;
      gap:14px;
      align-items:flex-start;
      min-width:0;
    }

    .t9-logo{
      width:130px;
      height:130px;
      border-radius:30px;
      background:#ffffff;
      border:1px solid rgba(148,163,184,0.35);
      box-shadow:0 12px 30px rgba(15,23,42,0.08);
      flex:0 0 auto;
      overflow:hidden;
      display:grid;
      place-items:center;
    }

    .t9-logo img{
      width:100%;
      height:100%;
      object-fit:contain;
      padding:12px;
      display:block;
    }

    .t9-logo .fallback{
      font-size:13px;
      font-weight:900;
      letter-spacing:2px;
      color:#1d4ed8;
    }

    .t9-brand-copy{
      min-width:0;
      max-width:290px;
    }

    .t9-invoice-card{
      width:220px;
      flex:0 0 auto;
      background:linear-gradient(180deg,#0f172a 0%, #111827 100%);
      color:#fff;
      border-radius:22px;
      padding:16px 16px 14px;
      box-shadow:0 16px 34px rgba(15,23,42,0.16);
      box-sizing:border-box;
      position:relative;
      overflow:hidden;
    }

    .t9-invoice-card:before{
      content:"";
      position:absolute;
      inset:auto -20px -24px auto;
      width:92px;
      height:92px;
      border-radius:999px;
      background:rgba(37,99,235,0.22);
      filter:blur(2px);
    }

    .t9-invoice-title{
      font-size:11px;
      font-weight:800;
      letter-spacing:2px;
      text-transform:uppercase;
      color:rgba(255,255,255,0.72);
      margin-bottom:8px;
    }

    .t9-invoice-number{
      font-size:21px;
      line-height:1.1;
      font-weight:900;
      letter-spacing:0.3px;
      margin-bottom:10px;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    .t9-meta-grid{
      display:grid;
      grid-template-columns:1fr;
      gap:8px;
      position:relative;
      z-index:1;
    }

    .t9-meta-row{
      display:flex;
      justify-content:space-between;
      gap:10px;
      font-size:11.5px;
      line-height:1.45;
      color:rgba(255,255,255,0.9);
    }

    .t9-meta-row span{
      color:rgba(255,255,255,0.62);
    }

    .t9-row-2{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      margin-bottom:14px;
    }

    .t9-card{
      background:rgba(255,255,255,0.9);
      border:1px solid rgba(148,163,184,0.18);
      border-radius:20px;
      box-shadow:0 10px 26px rgba(15,23,42,0.06);
      backdrop-filter:blur(6px);
      -webkit-backdrop-filter:blur(6px);
    }

    .t9-section{
      padding:16px;
      box-sizing:border-box;
    }

    .t9-section-label{
      display:inline-flex;
      align-items:center;
      gap:8px;
      font-size:10px;
      font-weight:900;
      letter-spacing:2px;
      text-transform:uppercase;
      color:#1d4ed8;
      margin-bottom:10px;
    }

    .t9-section-label:before{
      content:"";
      width:8px;
      height:8px;
      border-radius:999px;
      background:linear-gradient(135deg,#1d4ed8,#7c3aed);
      box-shadow:0 0 0 4px rgba(29,78,216,0.10);
      flex:0 0 auto;
    }

    .t9-name{
      font-size:16px;
      font-weight:900;
      line-height:1.18;
      color:#0f172a;
      margin-bottom:6px;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    .t9-lines{
      font-size:11.5px;
      line-height:1.62;
      color:#475569;
      white-space:pre-wrap;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    .t9-items-card{
      margin-bottom:14px;
    }

    .t9-items-head{
      padding:13px 16px;
      background:linear-gradient(90deg,#0f172a 0%,#1d4ed8 58%,#2563eb 100%);
      color:#fff;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;
    }

    .t9-items-head strong{
      font-size:12px;
      font-weight:900;
      letter-spacing:1px;
      text-transform:uppercase;
    }

    .t9-items-head span{
      font-size:11px;
      color:rgba(255,255,255,0.74);
      font-weight:700;
    }

    .t9-table{
      width:100%;
      border-collapse:collapse;
      table-layout:fixed;
      background:#fff;
      font-size:11.5px;
      page-break-inside: auto;
    }

    .t9-table th,
    .t9-table td{
      padding:11px 14px;
      vertical-align:top;
      border-bottom:1px solid #e8eefb;
    }

    .t9-table th{
      background:#f8fbff;
      color:#334155;
      font-size:10.5px;
      font-weight:900;
      letter-spacing:0.8px;
      text-transform:uppercase;
    }

    .t9-table td{
      color:#334155;
    }

    /* SaaS level improvements for many items */
    .t9-table thead {
      display: table-header-group;   /* Header repeat on every page */
    }

    .t9-table tr {
      page-break-inside: avoid;      /* Row cut off na ho */
      page-break-after: auto;
    }

    .t9-desc{
      color:#0f172a;
      font-weight:700;
      word-break:break-word;
      white-space: normal;
      overflow-wrap:anywhere;
      hyphens: auto;
    }

    .t9-right{
      text-align:right;
      white-space:nowrap;
    }

    .t9-center{
      text-align:center;
      white-space:nowrap;
    }

    .t9-summary-wrap{
      display:flex;
      justify-content:flex-end;
      margin-bottom:14px;
    }

    .t9-summary{
      width:286px;
      background:#fff;
      border:1px solid rgba(148,163,184,0.22);
      border-radius:20px;
      box-shadow:0 10px 26px rgba(15,23,42,0.06);
      padding:14px 16px;
      box-sizing:border-box;
    }

    .t9-summary-row{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;
      padding:4px 0;
      font-size:11.5px;
      color:#475569;
    }

    .t9-summary-row strong{
      color:#0f172a;
    }

    .t9-grand{
      margin-top:8px;
      padding:13px 14px;
      border-radius:16px;
      background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);
      color:#fff;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      font-size:13px;
      font-weight:900;
      box-shadow:0 14px 28px rgba(29,78,216,0.24);
    }

    .t9-bottom{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      margin-bottom:14px;
    }

    .t9-note{
      font-size:11.5px;
      line-height:1.62;
      color:#475569;
      white-space:pre-wrap;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    .t9-footer{
      padding-top:12px;
      border-top:1px solid #dde6f5;
      display:flex;
      justify-content:space-between;
      gap:12px;
      flex-wrap:wrap;
      font-size:10.5px;
      line-height:1.5;
      color:#94a3b8;
    }

    .t9-foot-left,
    .t9-foot-right{
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    /* Improved Print Support */
    @media print{
      .t9-root{
        background:#fff !important;
        box-shadow: none;
        margin: 0;
        min-height: auto;
        height: auto;
        overflow: visible;
      }

      .t9-shell{
        padding: 20px 25px;
        min-height: auto;
      }

      @page {
        size: A4 portrait;
        margin: 12mm 10mm;   /* Adjust if needed */
      }

      .t9-table {
        page-break-inside: auto;
      }

      .t9-table thead {
        display: table-header-group;
      }

      .t9-table tr {
        page-break-inside: avoid;
      }

      /* Hide decorative elements if you want cleaner print */
      /* .t9-accent { display: none; } */
    }
  </style>

  <div class="t9-shell">
    <div class="t9-accent"></div>

    <div class="t9-header">
      <div class="t9-brand">
        <div class="t9-logo">
          {{#logo_data_url}}
            <img src="{{logo_data_url}}" alt="Logo" />
          {{/logo_data_url}}
          {{^logo_data_url}}
            {{#logo_url}}
              <img src="{{logo_url}}" alt="Logo" />
            {{/logo_url}}
          {{/logo_data_url}}
          {{^logo_data_url}}
            {{^logo_url}}
              <div class="fallback">LOGO</div>
            {{/logo_url}}
          {{/logo_data_url}}
        </div>

        <div class="t9-brand-copy">
          <!-- Agar yahan business name ya extra text add karna hai to yahan daal sakta hai -->
        </div>
      </div>

      <div class="t9-invoice-card">
        <div class="t9-invoice-title">Invoice Details</div>
        <div class="t9-invoice-number">{{invoice_number}}</div>
        <div class="t9-meta-grid">
          <div class="t9-meta-row"><span>Date</span><strong>{{invoice_date}}</strong></div>
          <div class="t9-meta-row"><span>Due Date</span><strong>{{due_date}}</strong></div>
          <div class="t9-meta-row"><span>Currency</span><strong>{{currency}}</strong></div>
        </div>
      </div>
    </div>

    <div class="t9-row-2">
      <div class="t9-card t9-section">
        <div class="t9-section-label">From</div>
        <div class="t9-name">{{business_name}}</div>
        <div class="t9-lines">{{business_address}}</div>
        <div class="t9-lines" style="margin-top:4px;">{{business_phone}}</div>
        <div class="t9-lines">{{business_email}}</div>
      </div>

      <div class="t9-card t9-section">
        <div class="t9-section-label">Bill To</div>
        <div class="t9-name">{{client_name}}</div>
        <div class="t9-lines">{{client_address}}</div>
        <div class="t9-lines" style="margin-top:4px;">{{client_phone}}</div>
        <div class="t9-lines">{{client_email}}</div>
      </div>
    </div>

    <div class="t9-card t9-items-card">
      <div class="t9-items-head">
        <strong>Items / Services</strong>
      </div>

      <table class="t9-table">
        <thead>
          <tr>
            <th style="text-align:left;">Description</th>
            <th style="width:68px;text-align:center;">Qty</th>
            <th style="width:110px;text-align:right;">Unit Price</th>
            <th style="width:118px;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td class="t9-desc">{{description}}</td>
            <td class="t9-center">{{qty}}</td>
            <td class="t9-right">{{unit_price}}</td>
            <td class="t9-right" style="font-weight:800;color:#0f172a;">{{line_total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
    </div>

    <div class="t9-summary-wrap">
      <div class="t9-summary">
        <div class="t9-summary-row"><span>Subtotal</span><strong>{{subtotal}}</strong></div>
        <div class="t9-summary-row"><span>Tax</span><strong>{{tax_amount}}</strong></div>
        <div class="t9-summary-row"><span>Discount</span><strong>{{discount}}</strong></div>
        <div class="t9-grand"><span>Grand Total</span><span>{{grand_total}}</span></div>
      </div>
    </div>

    <div class="t9-bottom">
      <div class="t9-card t9-section">
        <div class="t9-section-label">Payment Terms</div>
        <div class="t9-lines">{{payment_terms}}</div>
        <div class="t9-note" style="margin-top:6px;">{{payment_details}}</div>
        <div class="t9-note" style="margin-top:6px;">{{payment_method}}</div>
      </div>

      <div class="t9-card t9-section">
        <div class="t9-section-label">Thank You</div>
        <div class="t9-note">{{thank_you_text}}</div>
      </div>
    </div>

    <div class="t9-footer">
      <div class="t9-foot-left">{{bank_name}} {{bank_account}}</div>
      <div class="t9-foot-right">{{bank_routing}}</div>
    </div>
  </div>
</div>
`;
