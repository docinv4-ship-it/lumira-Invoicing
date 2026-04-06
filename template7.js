window.templates = window.templates || {};
templates[7] = `
<div class="invoice-template" 
     style="width:595px; 
            height:auto; 
            min-height:842px; 
            position:relative; 
            font-family:Arial, sans-serif; 
            color:#000; 
            background:#fff; 
            overflow:visible;">

  <!-- BACKGROUND SVG - Auto scalable -->
  <svg width="595" height="842" 
       viewBox="0 0 595 842" 
       preserveAspectRatio="none"
       xmlns="http://www.w3.org/2000/svg"
       style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0;">
    <rect width="595" height="842" fill="#ffffff"/>
    <path d="M0 0 V110 C200 110 380 40 595 40 V0 H0Z" fill="#730481"/>
    <path d="M0 0 V95  C200 95  380 30 595 30 V0 H0Z" fill="#EFA910"/>
    <path d="M0 0 V80  C200 80  380 20 595 20 V0 H0Z" fill="#730481"/>
    <path d="M0 842 V810 C220 810 400 710 595 710 V842 H0Z" fill="#730481"/>
    <path d="M0 842 V825 C220 825 400 725 595 725 V842 H0Z" fill="#EFA910"/>
    <path d="M0 842 V840 C220 840 400 740 595 740 V842 H0Z" fill="#730481"/>
  </svg>

  <!-- CONTENT WRAPPER - Fixed for safe auto grow -->
  <div style="position:relative; z-index:10; padding:40px 40px 200px 40px; min-height:842px; box-sizing:border-box;">

    <!-- TITLE -->
    <div style="
      text-align:right;
      font-size:36px;
      font-weight:800;
      color:#730481;
      margin-top:20px;
      padding-right:10px;
    ">
      INVOICE
    </div>

    <!-- HEADER -->
    <div style="display:flex; justify-content:space-between; margin-top:20px;">
      <div style="font-size:14px;">
        <div style="font-weight:bold;">Invoice To:</div>
        <div>{{client_name}}</div>
        <div>Phone: {{client_phone}}</div>
        <div>Address: {{client_address}}</div>
        <div>Email: {{client_email}}</div>
        <div>Tax ID: {{client_tax_id}}</div>
      </div>

      <div style="font-size:14px; text-align:right;">
        <div><strong>Invoice #:</strong> {{invoice_number}}</div>
        <div><strong>PO Number:</strong> {{po_number}}</div>
        <div><strong>Date:</strong> {{invoice_date}}</div>
        <div><strong>Due Date:</strong> {{due_date}}</div>
        <div><strong>Currency:</strong> {{currency}}</div>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table style="width:100%; border-collapse:collapse; margin-top:35px;">
      <thead>
        <tr style="background:#730481; color:#fff;">
          <th style="padding:8px; text-align:left;">Item Description</th>
          <th style="padding:8px; text-align:right;">Unit Price</th>
          <th style="padding:8px; text-align:center;">Qty</th>
          <th style="padding:8px; text-align:right;">Line Total</th>
        </tr>
      </thead>
      <tbody>
        {{#items}}
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd;">{{description}}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #ddd;">{{unit_price}}</td>
          <td style="padding:8px; text-align:center; border-bottom:1px solid #ddd;">{{quantity}}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #ddd;">{{line_total}}</td>
        </tr>
        {{/items}}
      </tbody>
    </table>

    <!-- FOOTER / TOTALS + NOTES - Safe spacing -->
    <div style="margin-top:50px; display:flex; justify-content:space-between;">

      <!-- Left: Notes, Payment Method, Terms -->
      <div style="width:55%; font-size:14px;">
        <div><strong>Notes:</strong><br>{{notes}}</div><br>
        <div><strong>Payment Method:</strong><br>{{payment_method}}</div><br>
        <div><strong>Payment Terms:</strong><br>{{payment_terms}}</div>
      </div>

      <!-- Right: Totals Box -->
      <div style="width:35%; font-size:14px; border:1px solid #730481; padding:12px;">
        <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><span>{{subtotal}}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Tax</span><span>{{tax_amount}}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>{{discount}}</span></div>
        <hr>
        <div style="display:flex; justify-content:space-between; font-weight:bold;">
          <span>Grand Total</span><span>{{grand_total}}</span>
        </div>
      </div>

    </div>

  </div>
</div>
`;