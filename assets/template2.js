window.templates = window.templates || {};
window.templates[2] = `
<div class="invoice-template t2-root">
  <style>
    .t2-root{
      width:595px;
      min-height:842px;
      height: auto !important;
      position:relative;
      overflow: visible;
      box-sizing:border-box;
      font-family:Inter, Arial, sans-serif;
      background:#ffffff;
      color:#000000;
    }

    .t2-shell{
      position:relative;
      z-index:2;
      padding:36px 40px 120px;
      min-height:842px;
      box-sizing:border-box;
      overflow: visible;
    }

    /* SVG Background - 100% Same UI */
    .t2-bg-svg{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:1;
      pointer-events:none;
    }

    /* Content Area */
    .t2-content{
      position:relative;
      z-index:5;
      width:515px;
    }

    /* Invoice Title */
    .t2-title{
      text-align:right;
      font-size:26pt;
      font-weight:800;
      color:#111827;
      margin-bottom:8px;
    }

    /* Meta Info */
    .t2-meta{
      text-align:right;
      color:#374151;
      font-size:11.5pt;
      line-height:1.5;
    }

    .t2-meta strong{
      color:#111827;
    }

    /* Bill To */
    .t2-billto{
      margin-top:28px;
      color:#374151;
    }

    .t2-billto .label{
      font-weight:700;
      font-size:13pt;
      color:#111827;
      margin-bottom:6px;
    }

    .t2-billto .name{
      font-weight:700;
      font-size:12pt;
      color:#111827;
      margin-bottom:8px;
    }

    /* Items Table - SaaS Level with Auto Grow */
    .t2-items{
      margin-top:32px;
    }

    .t2-table{
      width:100%;
      border-collapse:collapse;
      font-size:11pt;
      table-layout:fixed;
      page-break-inside: auto;
    }

    .t2-table th{
      padding:10px 6px;
      border-bottom:2px solid #E5E7EB;
      font-weight:700;
      color:#111827;
      text-align:left;
    }

    .t2-table td{
      padding:10px 6px;
      border-bottom:1px solid #EEE;
      color:#374151;
      vertical-align:top;
    }

    .t2-table .no{ width:6%; }
    .t2-table .desc{ width:55%; word-break:break-word; white-space:normal; overflow-wrap:anywhere; hyphens:auto; }
    .t2-table .price{ width:15%; text-align:right; }
    .t2-table .qty{ width:10%; text-align:center; }
    .t2-table .total{ width:20%; text-align:right; }

    /* SaaS Level Improvements for 50+ / 100+ items */
    .t2-table thead {
      display: table-header-group;     /* Header repeats on every printed page */
    }

    .t2-table tbody tr {
      page-break-inside: avoid;        /* Rows won't cut in middle */
      page-break-after: auto;
    }

    .t2-table tr:last-child td{
      border-bottom: none;
    }

    /* Totals Box */
    .t2-totals{
      margin-top:32px;
      width:245px;
      margin-left:auto;
      background:#FAFAFA;
      padding:14px 16px;
      border-radius:8px;
      color:#374151;
      box-shadow:0 2px 8px rgba(0,0,0,0.03);
    }

    .t2-totals-row{
      display:flex;
      justify-content:space-between;
      padding:4px 0;
      font-size:11.5pt;
    }

    .t2-totals-row strong{
      color:#111827;
      font-weight:700;
    }

    .t2-grand{
      margin-top:10px;
      padding-top:10px;
      border-top:1px solid #DDD;
      font-weight:800;
      color:#111827;
      display:flex;
      justify-content:space-between;
      font-size:12.5pt;
    }

    /* Bank & Notes */
    .t2-bank, .t2-notes{
      margin-top:28px;
      color:#374151;
      font-size:11pt;
      line-height:1.55;
    }

    .t2-bank .title, .t2-notes .title{
      font-size:12pt;
      font-weight:700;
      color:#111827;
      margin-bottom:8px;
    }

    /* Footer Bar Background (kept same) */
    .t2-footer-bg{
      position:absolute;
      bottom:0;
      left:0;
      width:100%;
      height:82px;
      background:#0D1636;
      z-index:1;
    }

    /* Print Support - SaaS Level */
    @media print{
      .t2-root{
        box-shadow:none;
        margin:0;
        min-height:auto;
        height:auto;
        background:#fff !important;
      }

      .t2-shell{
        padding:36px 40px 100px;
        min-height:auto;
      }

      @page {
        size: A4 portrait;
        margin: 10mm 8mm;
      }

      .t2-table {
        page-break-inside: auto;
      }

      .t2-table thead {
        display: table-header-group;
      }

      .t2-table tr {
        page-break-inside: avoid;
      }

      /* Keep footer bar visible in print if needed */
      .t2-footer-bg{
        display: block;
      }
    }
  </style>

  <div class="t2-shell">

    <!-- SVG Background - 100% Unchanged UI -->
    <svg class="t2-bg-svg" width="595" height="842" viewBox="0 0 595 842" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <style>
          .gold-stroke { stroke:#C5A059; stroke-width:2; fill:none; }
          .gold-fill { fill:#C5A059; }
          .navy-fill { fill:#0D1636; }
        </style>
      </defs>

      <rect width="100%" height="100%" fill="#FFF"/>

      <!-- TOP TRIANGLES -->
      <g transform="translate(297.5, 0)">
        <path d="M -35 0 L 0 35 L 35 0" class="gold-stroke"/>
        <path d="M -50 0 L 0 50 L 50 0" class="gold-stroke"/>
        <path d="M -65 0 L 0 65 L 65 0" class="gold-stroke"/>
      </g>

      <!-- TOP DOT GRID -->
      <g transform="translate(40, 40)" class="gold-fill">
        <circle cx="0" cy="0" r="2.5"/>
        <circle cx="15" cy="0" r="2.5"/>
        <circle cx="30" cy="0" r="2.5"/>
        <circle cx="45" cy="0" r="2.5"/>
        <circle cx="60" cy="0" r="2.5"/>
        <circle cx="75" cy="0" r="2.5"/>
        <circle cx="0" cy="15" r="2.5"/>
        <circle cx="15" cy="15" r="2.5"/>
        <circle cx="30" cy="15" r="2.5"/>
        <circle cx="45" cy="15" r="2.5"/>
        <circle cx="60" cy="15" r="2.5"/>
        <circle cx="0" cy="30" r="2.5"/>
        <circle cx="15" cy="30" r="2.5"/>
        <circle cx="30" cy="30" r="2.5"/>
        <circle cx="45" cy="30" r="2.5"/>
      </g>

      <!-- FOOTER BAR -->
      <rect x="0" y="760" width="595" height="82" class="navy-fill"/>
    </svg>

    <!-- Main Content -->
    <div class="t2-content">

      <!-- INVOICE TITLE -->
      <div class="t2-title">INVOICE</div>

      <!-- META -->
      <div class="t2-meta">
        <div>Invoice #: <strong>{{invoice_number}}</strong></div>
        <div>Date: <strong>{{date}}</strong></div>
        <div>Due: <strong>{{due_date}}</strong></div>
      </div>

      <!-- BILL TO -->
      <div class="t2-billto">
        <div class="label">Bill To</div>
        <div class="name">{{customer_name}}</div>
        <div>{{customer_address}}</div>
        <div style="margin-top:6px;">Phone: {{customer_phone}}</div>
        <div style="margin-top:4px;">Email: {{customer_email}}</div>
      </div>

      <!-- ITEMS SECTION -->
      <div class="t2-items">
        <table class="t2-table">
          <thead>
            <tr>
              <th class="no">No.</th>
              <th class="desc">Description</th>
              <th class="price">Unit Price</th>
              <th class="qty">Qty</th>
              <th class="total">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {{#items}}
            <tr>
              <td>{{index}}</td>
              <td class="desc">{{description}}</td>
              <td class="price">{{unit_price}}</td>
              <td class="qty">{{qty}}</td>
              <td class="total">{{line_total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>

      <!-- TOTAL SECTION -->
      <div class="t2-totals">
        <div class="t2-totals-row"><span>Subtotal</span><strong>{{subtotal}}</strong></div>

        {{#shipping}}
        <div class="t2-totals-row"><span>Shipping</span><strong>{{shipping}}</strong></div>
        {{/shipping}}

        {{#tax_rate}}
        <div class="t2-totals-row"><span>Tax ({{tax_rate}}%)</span><strong>{{tax_amount}}</strong></div>
        {{/tax_rate}}

        <div class="t2-grand">
          <span>Total</span>
          <span>{{total}}</span>
        </div>
      </div>

      <!-- BANK DETAILS -->
      {{#bank_details}}
      <div class="t2-bank">
        <div class="title">Bank Details</div>
        <div>{{bank_details}}</div>
      </div>
      {{/bank_details}}

      <!-- NOTES -->
      {{#notes}}
      <div class="t2-notes">
        <div class="title">Notes</div>
        <div>{{notes}}</div>
      </div>
      {{/notes}}

    </div>

    <!-- Footer Navy Bar -->
    <div class="t2-footer-bg"></div>

  </div>
</div>
`;
