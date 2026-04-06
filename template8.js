window.templates = window.templates || {};
templates[8] = `
<div class="invoice-template" style="width:595px; height:auto; min-height:842px; position:relative; overflow:visible; background:white; font-family:'Helvetica, Arial, sans-serif'; color:#111;">

  <!-- SVG Background - Auto scalable -->
  <svg width="595" height="842" viewBox="0 0 595 842" xmlns="http://www.w3.org/2000/svg" 
       preserveAspectRatio="none"
       style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0; pointer-events:none;">
    <rect width="595" height="842" fill="#FFFFFF"/>
    <rect width="595" height="120" fill="#000A33"/>
    <polygon points="595,0 595,140 460,0" fill="#FFD700"/>
    <path d="M460 0 L440 18 L460 18 Z" fill="#D9A300"/>
    <rect y="780" width="595" height="62" fill="#000A33"/>
    <polygon points="0,842 140,842 0,780" fill="#FFD700"/>
    <path d="M0 780 L18 800 L18 780 Z" fill="#D9A300"/>
  </svg>

  <!-- CONTENT WRAPPER - Fixed for proper auto grow + safe spacing -->
  <div style="position:relative; z-index:1; padding:40px 40px 160px 40px; min-height:842px; box-sizing:border-box;">

    <!-- Invoice Meta (TOP BLUE) -->
    <div style="color:#fff;font-size:14px;font-weight:600;line-height:20px;">
      <div>Invoice No: {{invoice_number}}</div>
      <div>Date: {{invoice_date}}</div>
      <div>Due Date: {{due_date}}</div>
    </div>

    <!-- FROM / TO -->
    <div style="margin-top:110px;display:flex;justify-content:space-between;">

      <!-- FROM -->
      <div style="width:48%;font-size:14px;line-height:20px;">
        <div style="font-size:18px;font-weight:800;margin-bottom:6px;">FROM</div>
        {{#business_name}}<div style="font-weight:600;">{{business_name}}</div>{{/business_name}}
        {{#business_address}}<div>{{business_address}}</div>{{/business_address}}
        {{#business_phone}}<div>{{business_phone}}</div>{{/business_phone}}
        {{#business_email}}<div>{{business_email}}</div>{{/business_email}}
        {{#business_tax_id}}<div>Tax ID: {{business_tax_id}}</div>{{/business_tax_id}}
      </div>

      <!-- TO -->
      <div style="width:48%;text-align:right;font-size:14px;line-height:20px;">
        <div style="font-size:18px;font-weight:800;margin-bottom:6px;">TO</div>
        {{#client_name}}<div style="font-weight:600;">{{client_name}}</div>{{/client_name}}
        {{#client_address}}<div>{{client_address}}</div>{{/client_address}}
        {{#client_phone}}<div>{{client_phone}}</div>{{/client_phone}}
        {{#client_email}}<div>{{client_email}}</div>{{/client_email}}
        {{#client_tax_id}}<div>Tax ID: {{client_tax_id}}</div>{{/client_tax_id}}
      </div>

    </div>

    <!-- ITEMS + TOTALS + NOTES -->
    <div style="margin-top:80px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f2f2f2;font-weight:700;text-align:center;">
            <th style="border:1px solid #ccc;padding:8px;">#</th>
            <th style="border:1px solid #ccc;padding:8px;text-align:left;">Description</th>
            <th style="border:1px solid #ccc;padding:8px;">Price</th>
            <th style="border:1px solid #ccc;padding:8px;">Qty</th>
            <th style="border:1px solid #ccc;padding:8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td style="border:1px solid #ccc;padding:8px;text-align:center;">{{index}}</td>
            <td style="border:1px solid #ccc;padding:8px;">{{item_description}}</td>
            <td style="border:1px solid #ccc;padding:8px;text-align:right;">{{unit_price}}</td>
            <td style="border:1px solid #ccc;padding:8px;text-align:center;">{{quantity}}</td>
            <td style="border:1px solid #ccc;padding:8px;text-align:right;">{{line_total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>

      <!-- TOTALS -->
      <div style="margin-top:40px;display:flex;justify-content:space-between;">
        <div style="width:60%;">
          {{#payment_terms}}<strong>Payment Terms</strong><div>{{payment_terms}}</div>{{/payment_terms}}
        </div>
        <div style="width:35%;text-align:right;font-size:14px;">
          {{#subtotal}}<div>Subtotal: <strong>{{subtotal}}</strong></div>{{/subtotal}}
          {{#tax_amount}}<div>Tax: <strong>{{tax_amount}}</strong></div>{{/tax_amount}}
          {{#discount}}<div>Discount: <strong>{{discount}}</strong></div>{{/discount}}
          <hr style="margin:10px 0;">
          {{#grand_total}}<div style="font-size:16px;font-weight:800;">Grand Total: {{grand_total}}</div>{{/grand_total}}
        </div>
      </div>

      <!-- NOTES -->
      {{#notes}}
      <div style="margin-top:50px;font-size:14px;line-height:20px;color:#222;">
        <strong>NOTES</strong><br>
        <em>{{notes}}</em>
      </div>
      {{/notes}}
    </div>

  </div>
</div>
`;