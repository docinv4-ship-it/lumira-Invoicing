// templates/template5.js
window.templates = window.templates || {};

window.templates[5] = `
<div class="invoice-template t5-root">
  <style>
    .t5-root {
      width: 595px;
      min-height: 842px;
      height: auto !important;
      position: relative;
      font-family: 'Arial', Helvetica, sans-serif;
      background: #fff;
      overflow: visible;
      box-sizing: border-box;
    }

    .t5-wrapper {
      position: relative;
      width: 100%;
      min-height: 842px;
      height: auto;
    }

    .invoice-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .t5-content {
      position: relative;
      z-index: 5;
      padding: 48px 40px 180px 40px;
      min-height: 782px;
      box-sizing: border-box;
      color: #111;
    }

    /* Table improvements for 100+ items (Template 9 jaisa) */
    .t5-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .t5-table thead tr {
      background: #f8fafc;
    }

    .t5-table th {
      padding: 12px 10px;
      border-bottom: 2px solid #e5e7eb;
      color: #1e3a8a;
      text-align: left;
      font-weight: 700;
      font-size: 12px;
    }

    .t5-table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
      vertical-align: top;
    }

    .t5-table thead {
      display: table-header-group;
    }

    .t5-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    .t5-totals {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }

    .t5-total-box {
      width: 260px;
      font-size: 13px;
      line-height: 1.6;
    }

    .t5-total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }

    .t5-grand {
      border-top: 2px solid #d4af77;
      margin-top: 10px;
      padding-top: 12px;
      font-weight: 700;
      font-size: 15px;
      color: #1e3a8a;
    }

    /* Notes always at bottom */
    .t5-notes {
      position: absolute;
      bottom: 48px;
      left: 40px;
      right: 40px;
      font-size: 12px;
      line-height: 1.5;
      color: #475569;
    }

    /* Print Support */
    @media print {
      .t5-root {
        background: #fff !important;
        min-height: auto;
        height: auto;
        overflow: visible;
      }
      .t5-content {
        padding-bottom: 160px;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      .t5-table thead {
        display: table-header-group;
      }
      .t5-table tr {
        page-break-inside: avoid;
      }
    }
  </style>

  <div class="t5-wrapper">

    <!-- ====== CLEAN SAAS BACKGROUND (dynamic height) ====== -->
    <svg class="invoice-bg" 
         width="595" height="1600" 
         viewBox="0 0 595 1600" 
         xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="none">

      <defs>
        <linearGradient id="accentGrad" x1="0" y1="0" x2="595" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#d4af77"/>
          <stop offset="100%" stop-color="#b38b4f"/>
        </linearGradient>
      </defs>

      <!-- Full white clean background -->
      <rect width="100%" height="100%" fill="#ffffff"/>

      <!-- Very thin top accent bar -->
      <rect x="0" y="0" width="595" height="6" fill="url(#accentGrad)"/>

      <!-- Very light elegant border -->
      <rect x="28" y="28" width="539" height="1544" fill="none" stroke="#e5e7eb" stroke-width="1.5" rx="8"/>

      <!-- Super subtle bottom separator line -->
      <rect x="40" y="1485" width="515" height="1" fill="#f1f1f1"/>
    </svg>

    <!-- MAIN CONTENT -->
    <div class="t5-content">

      <!-- HEADER -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px;">
        <div style="font-size:34px; font-weight:700; letter-spacing:1px; color:#1e3a8a;">INVOICE</div>

        <div style="font-size:12.5px; text-align:right; line-height:1.6; color:#334155;">
          <div><strong>Invoice #</strong> {{invoice_number}}</div>
          <div><strong>Date</strong> {{invoice_date}}</div>
          <div><strong>Due Date</strong> {{due_date}}</div>
        </div>
      </div>

      <!-- FROM / TO -->
      <div style="display:flex; justify-content:space-between; gap:30px; margin-bottom:35px;">
        <div style="width:48%;">
          <div style="font-weight:700; font-size:13px; color:#1e3a8a; margin-bottom:6px;">FROM</div>
          <div style="font-weight:600; font-size:14px;">{{business_name}}</div>
          <div style="margin-top:8px; line-height:1.45; font-size:12px; color:#475569;">
            {{business_address}}<br>
            Phone: {{company_phone}}<br>
            Email: {{company_email}}
          </div>
        </div>

        <div style="width:48%;">
          <div style="font-weight:700; font-size:13px; color:#1e3a8a; margin-bottom:6px;">BILL TO</div>
          <div style="font-weight:600; font-size:14px;">{{client_name}}</div>
          <div style="margin-top:8px; line-height:1.45; font-size:12px; color:#475569;">
            {{client_address}}<br>
            Phone: {{client_phone}}<br>
            Email: {{client_email}}
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE (SKU column removed) -->
      <div style="margin-top:20px;">
        <table class="t5-table">
          <thead>
            <tr>
              <th style="width:52%;">Description</th>
              <th style="width:12%; text-align:center;">Qty</th>
              <th style="width:18%; text-align:right;">Unit Price</th>
              <th style="width:18%; text-align:right;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {{#items}}
            <tr>
              <td>{{description}}</td>
              <td style="text-align:center;">{{qty}}</td>
              <td style="text-align:right;">{{unit_price}}</td>
              <td style="text-align:right;">{{line_total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>

      <!-- TOTALS -->
      <div class="t5-totals">
        <div class="t5-total-box">
          <div class="t5-total-row"><span>Subtotal</span><span>{{subtotal}}</span></div>
          <div class="t5-total-row"><span>Tax ({{tax_rate}}%)</span><span>{{tax_amount}}</span></div>
          {{#discount}}
          <div class="t5-total-row"><span>Discount</span><span>{{discount}}</span></div>
          {{/discount}}
          <div class="t5-grand">
            <span>GRAND TOTAL</span>
            <span>{{grand_total}}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- NOTES & PAYMENT (footer area) -->
    <div class="t5-notes">
      <strong style="color:#1e3a8a;">NOTES &amp; PAYMENT INFO</strong><br>
      {{notes}}<br>
      {{payment_details}}
    </div>

  </div>
</div>
`;
