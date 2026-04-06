// templates/template3.js
window.templates = window.templates || {};

window.templates[3] = `
<div class="invoice-template"
     style="width:595px; position:relative; font-family:Arial,Helvetica,sans-serif; background:#ffffff; overflow:visible;">

  <style>
    .t3-wrap { 
      position:relative; 
      width:595px; 
      height: auto;           /* Yeh important hai */
      min-height:842px;
      overflow: visible;
    }
    .t3-bg {
      position:absolute; 
      left:0; top:0; right:0; bottom:0;
      background:
        radial-gradient(circle at top left, rgba(37,99,235,0.10), transparent 30%),
        radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 28%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      z-index:0;
      min-height: 100%;
      height: 100%;           /* Dynamic height ke liye */
    }
    .t3-topbar {
      position:absolute; 
      left:0; top:0; width:100%; height:128px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #2563eb 100%);
      z-index:1;
    }
    .t3-accent {
      position:absolute; right:-40px; top:-25px; width:180px; height:180px;
      border-radius:50%;
      background: rgba(255,255,255,0.08);
      z-index:1;
    }
    .t3-card {
      position:relative; 
      left:34px; 
      right:34px; 
      top:92px; 
      margin-bottom: 80px;     /* Footer aur extra space ke liye */
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(148,163,184,0.18);
      border-radius: 22px;
      box-shadow: 0 18px 50px rgba(15,23,42,0.08);
      z-index:2;
      padding: 28px 28px 50px 28px;   /* Bottom padding zyada kiya */
      box-sizing: border-box;
      min-height: 620px;
      width: calc(100% - 68px);
    }
    .t3-logo {
      width:92px; height:92px; border-radius:50%;
      background: linear-gradient(135deg, #2563eb 0%, #0f172a 100%);
      display:flex; align-items:center; justify-content:center;
      color:#fff; font-size:12px; font-weight:800;
      box-shadow: 0 10px 24px rgba(37,99,235,0.25);
      letter-spacing: 1px;
      flex-shrink: 0;
      overflow: hidden;
    }
    .t3-logo-inner {
      width:80px; height:80px; border-radius:50%;
      background: rgba(255,255,255,0.10);
      display:flex; align-items:center; justify-content:center;
      overflow:hidden;
    }
    .t3-meta {
      color: rgba(255,255,255,0.92);
      font-size: 12px;
      line-height: 18px;
      text-align: right;
    }
    .t3-section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .8px;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 8px;
    }
    .t3-box {
      border: 1px solid rgba(148,163,184,0.20);
      border-radius: 16px;
      padding: 14px 16px;
      background: #ffffff;
    }
    .t3-muted {
      color: #475569;
      font-size: 12px;
      line-height: 1.55;
    }
    .t3-table {
      width:100%;
      border-collapse:collapse;
      font-size:12px;
      color:#0f172a;
      border-radius:14px;
      margin-bottom: 20px;
    }
    .t3-table thead tr {
      background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
      color:#fff;
    }
    .t3-table th {
      padding: 11px 10px;
      text-align: left;
      font-weight: 700;
      font-size: 12px;
    }
    .t3-table td {
      padding: 10px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .t3-total-box {
      width: 260px;
      margin-left:auto;
      border-radius: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid rgba(148,163,184,0.22);
      padding: 14px 16px;
      box-shadow: 0 10px 30px rgba(15,23,42,0.05);
    }
    .t3-total-row {
      display:flex;
      justify-content:space-between;
      gap:16px;
      font-size: 12px;
      margin-bottom: 8px;
      color:#334155;
    }
    .t3-total-final {
      display:flex;
      justify-content:space-between;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      font-size: 15px;
      font-weight: 800;
      color:#0f172a;
    }
    .t3-footer {
      margin-top: 35px;
      font-size: 12px;
      color:#475569;
    }
  </style>

  <div class="t3-wrap">
    <div class="t3-bg"></div>
    <div class="t3-topbar"></div>
    <div class="t3-accent"></div>

    <div class="t3-card">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div class="t3-logo">
            <div class="t3-logo-inner">
              {{#logo_url}}
                <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id="t3LogoClip">
                      <circle cx="40" cy="40" r="40"></circle>
                    </clipPath>
                  </defs>
                  <image href="{{logo_url}}" x="0" y="0" width="80" height="80" preserveAspectRatio="xMidYMid meet" clip-path="url(#t3LogoClip)"/>
                </svg>
              {{/logo_url}}
              {{^logo_url}}
                LOGO
              {{/logo_url}}
            </div>
          </div>

          <div>
            <div style="font-size:28px;font-weight:800;color:#0f172a;">INVOICE</div>
          </div>
        </div>

        <div class="t3-meta">
          <div><strong>Invoice #</strong> {{invoice_number}}</div>
          <div><strong>Date</strong> {{date}}</div>
          <div><strong>Order ID</strong> {{order_id}}</div>
        </div>
      </div>

      <!-- Business / Client Cards -->
      <div style="display:flex;justify-content:space-between;gap:18px;margin-bottom:20px;">
        <div class="t3-box" style="width:48%;">
          <div class="t3-section-title">From</div>
          <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:6px;">{{company_name}}</div>
          <div class="t3-muted">
            {{company_address}}<br/>
            Phone: {{company_phone}}<br/>
            Email: {{company_email}}
          </div>
        </div>

        <div class="t3-box" style="width:48%;">
          <div class="t3-section-title">Bill To</div>
          <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:6px;">{{customer_name}}</div>
          <div class="t3-muted">
            {{customer_phone}}<br/>
            {{customer_email}}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-top:8px;">
        <table class="t3-table">
          <thead>
            <tr>
              <th style="width:52%;">Description</th>
              <th style="width:16%;text-align:right;">Price</th>
              <th style="width:12%;text-align:center;">Qty</th>
              <th style="width:20%;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            {{#items}}
            <tr>
              <td>{{description}}</td>
              <td style="text-align:right;">{{unit_price}}</td>
              <td style="text-align:center;">{{qty}}</td>
              <td style="text-align:right;">{{line_total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-top:32px;">
        <div class="t3-total-box">
          <div class="t3-total-row">
            <span>Subtotal</span>
            <strong>{{subtotal}}</strong>
          </div>
          <div class="t3-total-row">
            <span>Tax</span>
            <strong>{{tax_rate}}</strong>
          </div>
          <div class="t3-total-final">
            <span>Total</span>
            <span>{{total}}</span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="t3-footer">
        <strong style="color:#0f172a;">Payment Method:</strong> {{payment_method}}
      </div>

    </div>
  </div>
</div>
`;
