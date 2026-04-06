window.templates = window.templates || {};

window.templates[1] = `
<div class="invoice-template t12-root">
  <style>
    .t12-root{
      width:595px;
      min-height:842px;
      height:auto !important;
      position:relative;
      overflow:visible;
      box-sizing:border-box;
      font-family:Arial, Helvetica, sans-serif;
      background:#ffffff;
      color:#000000;
    }

    .t12-shell{
      position:relative;
      z-index:2;
      padding:36px 40px 160px 40px; /* thoda extra padding bottom curve ke liye */
      min-height:842px;
      box-sizing:border-box;
      overflow:visible;
    }

    .t12-content{
      position:relative;
      z-index:5;
    }

    /* Background layers */
    .t12-top-bg,
    .t12-bottom-bg{
      position:absolute;
      left:0;
      width:100%;
      pointer-events:none;
      z-index:1;
    }

    .t12-top-bg{
      top:0;
      height:280px;
    }

    .t12-bottom-bg{
      bottom:0;
      height:140px; /* chhota size rakha */
    }

    /* Header block */
    .t12-header{
      position:relative;
      min-height:170px;
      z-index:10;
    }

    .t12-logo{
      position:absolute;
      top:18px;
      left:0;
      z-index:12;
    }

    .t12-title-meta{
      position:absolute;
      top:34px;
      right:0;
      text-align:right;
      z-index:12;
      max-width:260px;
    }

    .t12-title{
      font-size:36px;
      font-weight:700;
      color:#000000;
      line-height:1;
      margin-bottom:8px;
      letter-spacing:0.5px;
    }

    .t12-meta{
      font-size:11px;
      line-height:1.6;
      color:#000000;
    }

    .t12-meta strong{
      font-weight:700;
    }

    .t12-meta div{
      white-space:nowrap;
    }

    /* Identity cards */
    .t12-identity{
      margin-top:18px;
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:18px;
      position:relative;
      z-index:10;
    }

    .t12-card{
      background:rgba(255,255,255,0.94);
      border:1px solid rgba(18, 45, 72, 0.10);
      border-radius:16px;
      padding:16px 16px 14px;
      box-sizing:border-box;
      box-shadow:0 6px 18px rgba(0,0,0,0.05);
      min-height:118px;
    }

    .t12-section-title{
      font-weight:700;
      font-size:12px;
      letter-spacing:0.8px;
      margin-bottom:8px;
      color:#162E48;
      text-transform:uppercase;
    }

    .t12-name{
      font-weight:700;
      font-size:12px;
      margin-bottom:8px;
      color:#000;
      line-height:1.35;
    }

    .t12-card div{
      font-size:11px;
      line-height:1.55;
      color:#000;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    /* Items */
    .t12-items{
      margin-top:26px;
      position:relative;
      z-index:10;
    }

    .t12-items-head{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      margin-bottom:8px;
      padding:0 2px 8px 2px;
      border-bottom:1.5px solid rgba(0,0,0,0.9);
      font-size:11px;
      font-weight:700;
      color:#000;
    }

    .t12-items-head span{
      display:block;
    }

    .t12-items-head .desc{ width:52%; }
    .t12-items-head .price{ width:16%; text-align:right; }
    .t12-items-head .qty{ width:12%; text-align:center; }
    .t12-items-head .total{ width:20%; text-align:right; }

    .t12-table{
      width:100%;
      border-collapse:collapse;
      font-size:11px;
      table-layout:fixed;
      page-break-inside:auto;
    }

    .t12-table th{
      display:none;
    }

    .t12-table td{
      padding:9px 6px;
      border-bottom:1px solid #ddd;
      color:#000;
      vertical-align:top;
      word-break:break-word;
      overflow-wrap:anywhere;
    }

    .t12-table .desc{ width:52%; }
    .t12-table .price{ width:16%; text-align:right; white-space:nowrap; }
    .t12-table .qty{ width:12%; text-align:center; white-space:nowrap; }
    .t12-table .total{ width:20%; text-align:right; white-space:nowrap; font-weight:700; }

    .t12-table thead{
      display:table-header-group;
    }

    .t12-table tbody tr{
      page-break-inside:avoid;
      page-break-after:auto;
    }

    .t12-table tr:last-child td{
      border-bottom:none;
    }

    /* Totals */
    .t12-totals{
      margin-top:34px;
      margin-left:auto;
      width:230px;
      background:#F6F6F6;
      padding:20px 18px;
      border-radius:10px;
      border:1px solid #dcdcdc;
      box-sizing:border-box;
      position:relative;
      z-index:10;
    }

    .t12-totals-row{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:4px 0;
      font-size:11px;
      color:#000;
    }

    .t12-totals-row strong{
      font-weight:700;
    }

    .t12-grand{
      margin-top:16px;
      padding-top:12px;
      border-top:1px solid #000;
      font-weight:700;
      font-size:13px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }

    /* Notes */
    .t12-notes{
      margin-top:42px;
      font-size:11px;
      color:#000;
      line-height:1.55;
      position:relative;
      z-index:10;
    }

    .t12-notes-title{
      font-size:12px;
      font-weight:700;
      margin-bottom:8px;
      color:#000;
    }

    .t12-notes > div + div{
      margin-top:34px;
    }

    /* Print support */
    @media print{
      .t12-root{
        box-shadow:none;
        margin:0;
        min-height:auto;
        height:auto;
        background:#fff !important;
      }

      .t12-shell{
        padding-bottom:120px;
      }

      @page {
        size:A4 portrait;
        margin:10mm 8mm;
      }

      .t12-table thead{
        display:table-header-group;
      }

      .t12-table tr{
        page-break-inside:avoid;
      }
    }
  </style>

  <div class="t12-shell">
    <!-- Top Background (same as before) -->
    <svg class="t12-top-bg" width="595" height="280" viewBox="0 0 595 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#C5A059"/>
          <stop offset="50%" stop-color="#EBCB80"/>
          <stop offset="100%" stop-color="#C5A059"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#162E48"/>
          <stop offset="100%" stop-color="#0F2035"/>
        </linearGradient>
      </defs>

      <rect width="595" height="280" fill="#ffffff"/>
      <path d="M 0 0 L 450 0 C 350 80 200 180 0 220 Z" fill="url(#blueGrad)"/>
      <path d="M 450 0 C 350 80 200 180 0 220" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
    </svg>

    <!-- Updated Bottom Background (chhota + smoother curve, top jaisa style) -->
    <svg class="t12-bottom-bg" width="595" height="140" viewBox="0 0 595 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="goldGradB" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#C5A059"/>
          <stop offset="50%" stop-color="#EBCB80"/>
          <stop offset="100%" stop-color="#C5A059"/>
        </linearGradient>
        <linearGradient id="blueGradB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#162E48"/>
          <stop offset="100%" stop-color="#0F2035"/>
        </linearGradient>
      </defs>

      <!-- Main blue curve (top jaisa slide feel) -->
      <path d="M 0 140 L 595 140 L 595 60 C 480 20 320 85 180 140 Z" fill="url(#blueGradB)" opacity="0.95"/>

      <!-- Gold accent layers (smaller waves) -->
      <path d="M 0 140 L 595 140 L 595 95 C 460 55 340 110 220 140 Z" fill="url(#goldGradB)" opacity="0.45"/>
      <path d="M 150 140 C 280 80 420 55 595 105 L 595 140 L 150 140 Z" fill="url(#goldGradB)" opacity="0.7"/>

      <!-- Extra dark blue/gold blend for depth -->
      <path d="M 0 140 H 595 V 115 C 480 65 350 95 220 140 H 0 Z" fill="#102a43" opacity="0.85"/>
    </svg>

    <div class="t12-content">
      <!-- Header, Identity, Items, Totals, Notes - sab same rakha hai -->
      <div class="t12-header">
        <!-- Logo -->
        <div class="t12-logo">
          <svg width="116" height="116" viewBox="0 0 116 116" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="t12LogoClip">
                <circle cx="58" cy="58" r="52"></circle>
              </clipPath>
            </defs>
            <circle cx="58" cy="58" r="58" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.95"/>
            <circle cx="58" cy="58" r="54" fill="#ffffff" opacity="0.08"/>
            {{#logo_url}}
              <image href="{{logo_url}}" x="6" y="6" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#t12LogoClip)"/>
            {{/logo_url}}
            {{^logo_url}}
              <circle cx="58" cy="58" r="36" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.95"/>
              <text x="58" y="63" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">LOGO</text>
            {{/logo_url}}
          </svg>
        </div>

        <!-- Title + Meta -->
        <div class="t12-title-meta">
          <div class="t12-title">INVOICE</div>
          <div class="t12-meta">
            <div>Invoice #: <strong contenteditable="true" spellcheck="false" data-field="invoice_number">{{invoice_number}}</strong></div>
            <div>Date: <strong>{{#invoice_date}}{{invoice_date}}{{/invoice_date}}{{^invoice_date}}{{date}}{{/invoice_date}}</strong></div>
            <div>Due: <strong contenteditable="true" spellcheck="false" data-field="due_date">{{due_date}}</strong></div>
            {{#currency}}
            <div>Currency: <strong contenteditable="true" spellcheck="false" data-field="currency">{{currency}}</strong></div>
            {{/currency}}
          </div>
        </div>
      </div>

      <!-- Business & Client -->
      <div class="t12-identity">
        <div class="t12-card">
          <div class="t12-section-title">Business Details</div>
          <div class="t12-name" contenteditable="true" spellcheck="false" data-field="company_name">{{company_name}}</div>
          {{#company_address}}<div contenteditable="true" spellcheck="false" data-field="company_address">{{company_address}}</div>{{/company_address}}
          {{#company_phone}}<div>Phone: <span contenteditable="true" spellcheck="false" data-field="company_phone">{{company_phone}}</span></div>{{/company_phone}}
          {{#company_email}}<div>Email: <span contenteditable="true" spellcheck="false" data-field="company_email">{{company_email}}</span></div>{{/company_email}}
        </div>

        <div class="t12-card">
          <div class="t12-section-title">Client Details</div>
          <div class="t12-name" contenteditable="true" spellcheck="false" data-field="client_name">{{client_name}}</div>
          {{#client_address}}<div contenteditable="true" spellcheck="false" data-field="client_address">{{client_address}}</div>{{/client_address}}
          {{#client_phone}}<div>Phone: <span contenteditable="true" spellcheck="false" data-field="client_phone">{{client_phone}}</span></div>{{/client_phone}}
          {{#client_email}}<div>Email: <span contenteditable="true" spellcheck="false" data-field="client_email">{{client_email}}</span></div>{{/client_email}}
          {{#client_tax_id}}<div>Tax ID: <span contenteditable="true" spellcheck="false" data-field="client_tax_id">{{client_tax_id}}</span></div>{{/client_tax_id}}
        </div>
      </div>

      <!-- Items -->
      <div class="t12-items">
        <div class="t12-items-head">
          <span class="desc">Item Description</span>
          <span class="price">Unit Price</span>
          <span class="qty">Quantity</span>
          <span class="total">Line Total</span>
        </div>

        <table class="t12-table">
          <thead>
            <tr>
              <th class="desc">Item Description</th>
              <th class="price">Unit Price</th>
              <th class="qty">Quantity</th>
              <th class="total">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {{#items}}
            <tr>
              <td class="desc">{{description}}</td>
              <td class="price">{{unit_price}}</td>
              <td class="qty">{{qty}}</td>
              <td class="total">{{line_total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="t12-totals">
        <div class="t12-totals-row"><span>Subtotal</span><strong>{{subtotal}}</strong></div>
        {{#discount}}
        <div class="t12-totals-row"><span>Discount</span><strong>{{discount}}</strong></div>
        {{/discount}}
        {{#tax_rate}}
        <div class="t12-totals-row"><span>Tax ({{tax_rate}}%)</span><strong>{{tax_amount}}</strong></div>
        {{/tax_rate}}
        <div class="t12-grand">
          <span>GRAND TOTAL</span>
          <span>{{grand_total}}</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="t12-notes">
        {{#notes}}
        <div>
          <div class="t12-notes-title">NOTES</div>
          <div contenteditable="true" spellcheck="false" data-field="notes">{{notes}}</div>
        </div>
        {{/notes}}

        {{#payment_info}}
        <div>
          <div class="t12-notes-title">PAYMENT INFO</div>
          <div contenteditable="true" spellcheck="false" data-field="payment_info">{{payment_info}}</div>
        </div>
        {{/payment_info}}
      </div>
    </div>
  </div>
</div>
`;
