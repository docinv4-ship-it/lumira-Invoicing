window.templates = window.templates || {};
window.templates[10] = `
<div class="invoice-template"
     style="width:595px;height:auto;min-height:842px;position:relative;font-family:Arial,Helvetica,sans-serif;background:#fff;overflow:visible;">

  <!-- SVG Background - Auto scalable -->
  <svg width="595" height="842" viewBox="0 0 595 842"
       xmlns="http://www.w3.org/2000/svg"
       preserveAspectRatio="none"
       style="position:absolute;inset:0;z-index:0;width:100%;height:100%;">
    <defs>
      <linearGradient id="t10OrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF8A00"/>
        <stop offset="100%" stop-color="#FF3D2E"/>
      </linearGradient>

      <linearGradient id="t10DarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1F2937"/>
      </linearGradient>
    </defs>

    <rect width="595" height="842" fill="#FFFFFF"/>

    <path d="M0 0H595V120C470 95 390 150 300 118C220 88 120 100 0 140Z" fill="url(#t10DarkGrad)"/>
    <path d="M0 0H595V78C455 58 390 112 295 88C210 66 120 74 0 108Z" fill="url(#t10OrangeGrad)" opacity="0.95"/>

    <rect x="26" y="156" width="6" height="540" rx="3" fill="url(#t10OrangeGrad)"/>
    <rect x="563" y="156" width="6" height="540" rx="3" fill="url(#t10DarkGrad)" opacity="0.25"/>

    <circle cx="510" cy="190" r="46" fill="#FF6A2B" opacity="0.10"/>
    <circle cx="528" cy="210" r="78" fill="#111827" opacity="0.05"/>
    <circle cx="92" cy="720" r="54" fill="#FF6A2B" opacity="0.08"/>
    <circle cx="145" cy="742" r="82" fill="#111827" opacity="0.04"/>

    <path d="M0 770H595V842H0Z" fill="url(#t10DarkGrad)"/>
    <path d="M0 748C120 735 175 790 290 776C410 762 470 708 595 734V842H0Z" fill="url(#t10OrangeGrad)" opacity="0.92"/>
  </svg>

  <div style="position:relative;inset:0;z-index:5;padding:34px 38px 30px 38px;box-sizing:border-box;color:#111827;min-height:842px;">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <svg width="118" height="118" viewBox="0 0 118 118" style="overflow:visible;flex-shrink:0;">
          <defs>
            <clipPath id="t10LogoClip">
              <circle cx="59" cy="59" r="54"></circle>
            </clipPath>
          </defs>

          <circle cx="59" cy="59" r="58" fill="url(#t10OrangeGrad)" opacity="0.98"/>
          <circle cx="59" cy="59" r="48" fill="#fff" opacity="0.98"/>
          <circle cx="59" cy="59" r="54" fill="none" stroke="#ffffff" stroke-width="3"/>

          {{#logo_data_url}}
            <image href="{{logo_data_url}}" x="5" y="5" width="108" height="108" clip-path="url(#t10LogoClip)" preserveAspectRatio="xMidYMid meet"/>
          {{/logo_data_url}}
          {{^logo_data_url}}
            {{#logo_url}}
              <image href="{{logo_url}}" x="5" y="5" width="108" height="108" clip-path="url(#t10LogoClip)" preserveAspectRatio="xMidYMid meet"/>
            {{/logo_url}}
          {{/logo_data_url}}

          {{^logo_data_url}}
            {{^logo_url}}
              <text x="59" y="64" text-anchor="middle" font-size="13" font-weight="800" fill="#FF3D2E">LOGO</text>
            {{/logo_url}}
          {{/logo_data_url}}
        </svg>

        <div style="color:#fff;">
          <div style="font-size:12px;letter-spacing:2px;font-weight:700;opacity:0.85;margin-bottom:4px;">INVOICE</div>
          <div style="font-size:24px;font-weight:800;line-height:1;">{{business_name}}</div>
          <div style="font-size:12px;opacity:0.85;margin-top:4px;">{{business_email}}</div>
        </div>
      </div>

      <div style="
        width:250px;
        background:rgba(255,255,255,0.96);
        border:1px solid rgba(255,255,255,0.65);
        border-radius:18px;
        padding:14px 15px;
        box-shadow:0 10px 26px rgba(17,24,39,0.12);
        backdrop-filter:blur(8px);
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:800;color:#111827;">Invoice Details</div>
          <div style="width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#FF8A00,#FF3D2E);"></div>
        </div>

        <div style="font-size:12px;color:#4B5563;line-height:1.9;">
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Invoice #</span><strong style="color:#111827;">{{invoice_number}}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Date</span><strong style="color:#111827;">{{date}}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Due Date</span><strong style="color:#111827;">{{due_date}}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Reference / PO</span><strong style="color:#111827;">{{reference_number}}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Currency</span><strong style="color:#111827;">{{currency}}</strong>
          </div>
        </div>
      </div>
    </div>

    <div style="
      background:#FFFFFF;
      border:1px solid #F1E7DF;
      border-radius:18px;
      padding:16px 18px;
      margin-bottom:18px;
      box-shadow:0 6px 20px rgba(17,24,39,0.06);
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#FF3D2E;">BILLED TO</div>
        <div style="height:3px;flex:1;background:linear-gradient(90deg,#FF8A00,#FF3D2E);border-radius:999px;opacity:0.75;"></div>
      </div>
      <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:6px;">{{customer_name}}</div>
      <div style="font-size:12px;line-height:18px;color:#4B5563;white-space:pre-wrap;">{{customer_address}}</div>
      <div style="font-size:12px;line-height:18px;color:#4B5563;margin-top:4px;">{{customer_phone}}</div>
      <div style="font-size:12px;line-height:18px;color:#4B5563;">{{customer_email}}</div>
    </div>

    <div style="
      background:#FFFFFF;
      border-radius:18px;
      border:1px solid #F1E7DF;
      overflow:hidden;
      margin-bottom:16px;
      box-shadow:0 8px 24px rgba(17,24,39,0.06);
    ">
      <div style="padding:12px 16px;background:linear-gradient(90deg,#111827,#1F2937);color:#fff;font-weight:800;font-size:12px;letter-spacing:1px;">
        ITEMS / SERVICES
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#FFF6F1;color:#111827;">
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #F3E7DE;">SKU</th>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #F3E7DE;">Description</th>
            <th style="padding:10px 12px;text-align:center;width:62px;border-bottom:1px solid #F3E7DE;">Qty</th>
            <th style="padding:10px 12px;text-align:right;width:90px;border-bottom:1px solid #F3E7DE;">Unit Price</th>
            <th style="padding:10px 12px;text-align:right;width:104px;border-bottom:1px solid #F3E7DE;">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #F3F4F6;color:#374151;">{{sku}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #F3F4F6;color:#111827;">{{description}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #F3F4F6;text-align:center;color:#374151;">{{qty}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #F3F4F6;text-align:right;color:#374151;">{{unit_price}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #F3F4F6;text-align:right;font-weight:700;color:#111827;">{{line_total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
      <div style="
        width:300px;
        background:#FFF9F4;
        border:1px solid #F6E2D6;
        border-radius:18px;
        padding:14px 16px;
        box-shadow:0 8px 22px rgba(17,24,39,0.05);
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;color:#4B5563;font-size:12px;">
          <span>Subtotal</span><strong style="color:#111827;">{{subtotal}}</strong>
        </div>
        <div style="margin-top:10px;padding:12px 12px;border-radius:14px;background:linear-gradient(135deg,#FF8A00,#FF3D2E);color:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:800;">
            <span>Grand Total</span>
            <span>{{grand_total}}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="
        background:#FFFFFF;
        border:1px solid #F1E7DF;
        border-radius:16px;
        padding:14px 16px;
        box-shadow:0 6px 18px rgba(17,24,39,0.05);
        min-height:110px;
      ">
        <div style="font-size:12px;font-weight:800;color:#FF3D2E;letter-spacing:1px;margin-bottom:8px;">BANK DETAILS</div>
        <div style="font-size:12px;line-height:18px;color:#4B5563;white-space:pre-wrap;">{{bank_details}}</div>
      </div>

      <div style="
        background:#FFFFFF;
        border:1px solid #F1E7DF;
        border-radius:16px;
        padding:14px 16px;
        box-shadow:0 6px 18px rgba(17,24,39,0.05);
        min-height:110px;
      ">
        <div style="font-size:12px;font-weight:800;color:#FF3D2E;letter-spacing:1px;margin-bottom:8px;">NOTES</div>
        <div style="font-size:12px;line-height:18px;color:#4B5563;white-space:pre-wrap;">{{terms}}</div>
        <div style="height:8px;"></div>
        <div style="font-size:12px;line-height:18px;color:#4B5563;white-space:pre-wrap;">{{notes}}</div>
      </div>
    </div>

  </div>
</div>
`;