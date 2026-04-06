window.templates = window.templates || {};
templates[6] = `
<div class="invoice-template"
     style="width:595px; 
            height:auto; 
            position:relative; 
            font-family:Arial,sans-serif; 
            color:#000; 
            background:#fff; 
            overflow:visible;
            page-break-after:avoid;">

  <!-- SVG Background -->
  <svg width="595" height="842" viewBox="0 0 595 842" xmlns="http://www.w3.org/2000/svg"
       preserveAspectRatio="none"
       style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0;">
    <defs>
      <linearGradient id="gradOrangeTop" x1="0" y1="130" x2="420" y2="0">
        <stop offset="0" stop-color="#ff6a00"/>
        <stop offset="1" stop-color="#ffb300"/>
      </linearGradient>
      <linearGradient id="gradPurpleMidTop" x1="0" y1="95" x2="280" y2="0">
        <stop offset="0" stop-color="#8e44ad"/>
        <stop offset="1" stop-color="#a569bd"/>
      </linearGradient>
      <linearGradient id="gradPurpleDarkTop" x1="0" y1="65" x2="130" y2="0">
        <stop offset="0" stop-color="#4a235a"/>
        <stop offset="1" stop-color="#5b2c89"/>
      </linearGradient>

      <linearGradient id="gradOrangeBottom" x1="595" y1="792" x2="300" y2="842">
        <stop offset="0" stop-color="#ff6a00"/>
        <stop offset="1" stop-color="#ffb300"/>
      </linearGradient>
      <linearGradient id="gradPurpleMidBottom" x1="595" y1="805" x2="360" y2="842">
        <stop offset="0" stop-color="#8e44ad"/>
        <stop offset="1" stop-color="#a569bd"/>
      </linearGradient>
      <linearGradient id="gradPurpleDarkBottom" x1="595" y1="820" x2="460" y2="842">
        <stop offset="0" stop-color="#4a235a"/>
        <stop offset="1" stop-color="#5b2c89"/>
      </linearGradient>
    </defs>

    <!-- TOP -->
    <path d="M0 130 C120 105 260 55 415 0 L0 0 Z" fill="url(#gradOrangeTop)"/>
    <path d="M0 95 C90 75 190 35 300 0 L0 0 Z" fill="url(#gradPurpleMidTop)"/>
    <path d="M0 65 L120 0 L0 0 Z" fill="url(#gradPurpleDarkTop)"/>

    <!-- BOTTOM -->
    <path d="M595 700 C520 730 420 800 300 842 L595 842 Z" fill="url(#gradOrangeBottom)"/>
    <path d="M595 735 C545 760 460 810 340 842 L595 842 Z" fill="url(#gradPurpleMidBottom)"/>
    <path d="M595 780 L380 842 L595 842 Z" fill="url(#gradPurpleDarkBottom)"/>
  </svg>

  <!-- MAIN CONTENT -->
  <div style="position:relative; z-index:10; padding:45px 60px 120px 60px; box-sizing:border-box; min-height:842px;">

    <!-- INVOICE TITLE -->
    <div style="text-align:right; font-size:32px; font-weight:bold; color:#fff;">
      INVOICE
    </div>

    <!-- Invoice Info -->
    <div style="text-align:right; font-size:13px; margin-top:10px;">
      Invoice #: {{invoice_number}}<br>
      Date: {{invoice_date}}<br>
      Due: {{due_date}}<br>
      Currency: {{currency}}
    </div>

    <!-- Client Info -->
    <div style="margin-top:55px;">
      <div style="font-size:16px; font-weight:bold;">Bill To:</div>
      <div style="font-size:13px; margin-top:10px; line-height:1.6;">
        {{client_name}}<br>
        {{client_address}}<br>
        Tax ID: {{client_tax_id}}<br>
        Phone: {{client_phone}}<br>
        Email: {{client_email}}
      </div>
    </div>

    <!-- ITEMS SECTION -->
    <div style="margin-top:60px;">
      <div style="background:linear-gradient(90deg,#5b2c89,#8e44ad); color:#fff; font-weight:bold; font-size:13px;
                  display:flex; padding:10px 0; border-radius:4px;">
        <div style="width:5%; text-align:center;">SL.</div>
        <div style="width:55%;">Item Description</div>
        <div style="width:15%; text-align:right;">Unit Price</div>
        <div style="width:10%; text-align:center;">Qty</div>
        <div style="width:15%; text-align:right;">Total</div>
      </div>

      <div style="margin-top:12px; font-size:13px; line-height:24px;">
        {{#items}}
        <div style="display:flex; padding:10px 0; border-bottom:0.5px solid rgba(0,0,0,.08);">
          <div style="width:5%; text-align:center;">{{index}}.</div>
          <div style="width:55%;">{{description}}</div>
          <div style="width:15%; text-align:right;">{{unit_price}}</div>
          <div style="width:10%; text-align:center;">{{qty}}</div>
          <div style="width:15%; text-align:right;">{{line_total}}</div>
        </div>
        {{/items}}
      </div>
    </div>

    <!-- TOTALS + NOTES + PAYMENT -->
    <div style="margin-top:70px;">

      <!-- TOTALS -->
      <div style="display:flex; justify-content:flex-end; margin-bottom:40px;">
        <div style="width:200px; font-size:13px; text-align:right;">
          Subtotal: {{subtotal}}<br>
          Tax Rate: {{tax_rate}}%<br>
          Tax Amount: {{tax_amount}}<br>
          <strong>Grand Total: {{grand_total}}</strong>
        </div>
      </div>

      <!-- Payment Method -->
      <div style="margin-bottom:30px;">
        <strong>Payment Method:</strong><br>
        {{payment_method}}
      </div>

      <!-- Notes -->
      <div>
        <strong>Notes:</strong><br>
        {{notes}}
      </div>

    </div>

  </div>
</div>
`;
