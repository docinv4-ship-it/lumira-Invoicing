window.templates = window.templates || {};
templates[4] = `
<div class="invoice-template" style="width:595px; height:auto; min-height:842px; position:relative; background:white; font-family:'Montserrat', Arial, sans-serif; overflow:hidden;">

  <!-- BACKGROUND SVG -->
  <svg class="invoice-bg" viewBox="0 0 210 297" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
       style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0;">
      <defs>
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#334155" />
          </linearGradient>
      </defs>

      <!-- TOP CURVE -->
      <path d="M0 0 H210 V50 C210 50, 160 70, 80 50 C30 35, 0 60, 0 60 Z" fill="url(#primaryGrad)" />
      <path d="M150 0 H210 V25 L150 0Z" fill="#334155" opacity="0.9" />

      <!-- BOTTOM CURVE -->
      <path d="M0 297 V250 C60 260, 160 240, 210 255 V297 H0Z" fill="url(#primaryGrad)" />
  </svg>

  <!-- MAIN CONTENT - Fixed for proper auto grow -->
  <div class="content" style="position:relative; z-index:5; color:#111; 
                             padding: 40px 40px 120px 40px; 
                             min-height: 782px; 
                             box-sizing: border-box;">

    <!-- HEADER -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px;">
      <div style="font-size:36px; font-weight:700; color:white; letter-spacing:1px;">INVOICE</div>

      <!-- TOP RIGHT METADATA -->
      <div style="font-size:12px; text-align:right; line-height:1.5; color:white;">
        <div>Invoice Number: <strong>{{invoice_number}}</strong></div>
        <div>Invoice Date: <strong>{{invoice_date}}</strong></div>
        <div>Due Date: <strong>{{due_date}}</strong></div>
      </div>
    </div>

    <!-- SPACER -->
    <div style="height:110px;"></div>

    <!-- FROM / TO -->
    <div style="display:flex; justify-content:space-between; margin-bottom:30px;">

      <!-- FROM -->
      <div style="width:48%; font-size:12px;">
        <div style="font-weight:700; font-size:18px; color:#334155; margin-bottom:5px;">From:</div>
        <div style="font-weight:500; font-size:14px;">{{business_name}}</div>
        <div style="margin-top:5px; line-height:1.4;">
          {{business_address}}<br>
          {{company_phone}}<br>
          {{company_email}}
        </div>
      </div>

      <!-- TO -->
      <div style="width:48%; font-size:12px;">
        <div style="font-weight:700; font-size:18px; color:#334155; margin-bottom:5px;">To:</div>
        <div style="font-weight:500; font-size:14px;">{{client_name}}</div>
        <div style="margin-top:5px; line-height:1.4;">
          {{client_address}}<br>
          {{client_phone}}<br>
          {{client_email}}
        </div>
      </div>

    </div>

    <!-- ITEMS TABLE -->
    <div style="margin-top:25px;">
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <thead>
          <tr style="background:#e5f1ff;">
            <th style="padding:10px; border-bottom:1px solid #ccc; color:#1e3a8a; text-align:left;">SKU / Code</th>
            <th style="padding:10px; border-bottom:1px solid #ccc; color:#1e3a8a; text-align:left;">Description</th>
            <th style="padding:10px; border-bottom:1px solid #ccc; color:#1e3a8a; text-align:center;">Qty</th>
            <th style="padding:10px; border-bottom:1px solid #ccc; color:#1e3a8a; text-align:right;">Unit Price</th>
            <th style="padding:10px; border-bottom:1px solid #ccc; color:#1e3a8a; text-align:right;">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td style="padding:8px; border-bottom:1px solid #eee;">{{sku}}</td>
            <td style="padding:8px; border-bottom:1px solid #eee;">{{description}}</td>
            <td style="padding:8px; border-bottom:1px solid #eee; text-align:center;">{{qty}}</td>
            <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">{{unit_price}}</td>
            <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">{{line_total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
    </div>

    <!-- TOTALS -->
    <div style="margin-top:35px; display:flex; justify-content:flex-end;">
      <div style="width:260px; font-size:13px;">
        <div style="display:flex; justify-content:space-between; padding:6px 0;">
          <span>Subtotal</span><span>{{subtotal}}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:6px 0;">
          <span>Tax Rate</span><span>{{tax_rate}}%</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:6px 0;">
          <span>Tax Amount</span><span>{{tax_amount}}</span>
        </div>

        <div style="border-top:1px solid #ccc; margin-top:12px; padding-top:12px; font-weight:700; display:flex; justify-content:space-between; color:#1e3a8a;">
          <span>Grand Total</span><span>{{grand_total}}</span>
        </div>
      </div>
    </div>

    <!-- NOTES & PAYMENT - Safe position with enough space -->
    <div style="margin-top:60px; font-size:12px; line-height:1.5; color:#111; padding-bottom:40px;">
      <strong>NOTES & Payment:</strong><br>
      {{notes}}<br>
      {{payment_details}}
    </div>

  </div>
</div>
`;
