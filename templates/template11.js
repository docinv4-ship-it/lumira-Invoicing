window.templates = window.templates || {};
window.templates[11] = `
<div class="invoice-template" style="width:595px;height:auto;min-height:842px;position:relative;font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;overflow:visible;color:#111827;">

  <div style="position:absolute;inset:0;background:
    radial-gradient(circle at 15% 10%, rgba(120, 130, 145, 0.10), transparent 24%),
    radial-gradient(circle at 90% 18%, rgba(0, 0, 0, 0.06), transparent 22%),
    linear-gradient(180deg, #f7f8fb 0%, #eef1f5 100%);"></div>

  <div style="position:absolute;left:0;top:0;right:0;height:132px;background:linear-gradient(135deg,#111827,#343A40);"></div>

  <div style="position:relative;z-index:2;padding:28px 30px 24px 30px;box-sizing:border-box;min-height:842px;">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
      <div style="display:flex;align-items:center;gap:14px;min-width:0;">
        <div style="width:92px;height:92px;border-radius:24px;background:#fff;border:1px solid rgba(255,255,255,0.18);display:grid;place-items:center;overflow:hidden;box-shadow:0 14px 28px rgba(17,24,39,0.16);flex:0 0 auto;">
          {{#logo_data_url}}
            <img src="{{logo_data_url}}" alt="Logo" style="width:100%;height:100%;object-fit:contain;padding:10px;" />
          {{/logo_data_url}}
          {{^logo_data_url}}
            {{#logo_url}}
              <img src="{{logo_url}}" alt="Logo" style="width:100%;height:100%;object-fit:contain;padding:10px;" />
            {{/logo_url}}
          {{/logo_data_url}}
          {{^logo_data_url}}
            {{^logo_url}}
              <div style="font-size:11px;font-weight:800;color:#4b5563;letter-spacing:1px;">LOGO</div>
            {{/logo_url}}
          {{/logo_data_url}}
        </div>

        <div style="color:#fff;min-width:0;">
          <div style="font-size:11px;letter-spacing:2px;font-weight:700;opacity:0.78;margin-bottom:4px;"></div>
        </div>
      </div>

      <div style="
        width:234px;
        background:rgba(255,255,255,0.97);
        border:1px solid rgba(203,213,225,0.85);
        border-radius:18px;
        padding:14px 15px;
        box-shadow:0 12px 28px rgba(17,24,39,0.12);
      ">
        <div style="font-size:12px;font-weight:800;color:#111827;letter-spacing:1px;margin-bottom:10px;">INVOICE DETAILS</div>

        <div style="font-size:11px;color:#4b5563;line-height:1.9;">
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Invoice #</span><strong style="color:#111827;">{{invoice_number}}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;gap:10px;">
            <span>Date</span><strong style="color:#111827;">{{invoice_date}}</strong>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px;">
      <div style="background:#fff;border:1px solid #dbe1ea;border-radius:18px;padding:14px 16px;box-shadow:0 6px 18px rgba(17,24,39,0.05);">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:#6b7280;margin-bottom:8px;">FROM</div>
        <div style="font-size:14px;font-weight:800;color:#111827;line-height:1.25;max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{business_name}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;white-space:pre-wrap;margin-top:6px;">{{business_address}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;margin-top:4px;">{{business_phone}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;">{{business_email}}</div>
      </div>

      <div style="background:#fff;border:1px solid #dbe1ea;border-radius:18px;padding:14px 16px;box-shadow:0 6px 18px rgba(17,24,39,0.05);">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:#6b7280;margin-bottom:8px;">BILL TO</div>
        <div style="font-size:14px;font-weight:800;color:#111827;line-height:1.25;max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{client_name}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;white-space:pre-wrap;margin-top:6px;">{{client_address}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;margin-top:4px;">{{client_phone}}</div>
        <div style="font-size:11px;line-height:16px;color:#4b5563;">{{client_email}}</div>
      </div>
    </div>

    <div style="margin-top:14px;background:#fff;border:1px solid #dbe1ea;border-radius:18px;overflow:hidden;box-shadow:0 8px 22px rgba(17,24,39,0.05);">
      <div style="background:linear-gradient(90deg,#111827,#374151);color:#fff;padding:11px 16px;font-size:11px;font-weight:800;letter-spacing:1px;">
        ITEMS / SERVICES
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background:#f8fafc;color:#111827;">
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #e5e7eb;">Description</th>
            <th style="padding:10px 12px;text-align:center;width:58px;border-bottom:1px solid #e5e7eb;">Qty</th>
            <th style="padding:10px 12px;text-align:right;width:92px;border-bottom:1px solid #e5e7eb;">Unit Price</th>
            <th style="padding:10px 12px;text-align:right;width:108px;border-bottom:1px solid #e5e7eb;">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #eef2f7;color:#111827;">
              <div style="font-weight:700;line-height:1.35;white-space:normal;word-break:break-word;">{{description}}</div>
            </td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #eef2f7;text-align:center;color:#374151;">{{qty}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #eef2f7;text-align:right;color:#374151;">{{unit_price}}</td>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #eef2f7;text-align:right;font-weight:700;color:#111827;">{{line_total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-top:14px;">
      <div style="width:255px;background:#fff;border:1px solid #dbe1ea;border-radius:18px;padding:14px 16px;box-shadow:0 8px 20px rgba(17,24,39,0.05);">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:11px;color:#4b5563;">
          <span>Subtotal</span>
          <strong style="color:#111827;">{{subtotal}}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:11px;color:#4b5563;">
          <span>Tax</span>
          <strong style="color:#111827;">{{tax_amount}}</strong>
        </div>
        <div style="margin-top:8px;padding:12px 12px;border-radius:14px;background:#111827;color:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;">
            <span>Grand Total</span>
            <span>{{grand_total}}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;">
      <div style="background:#fff;border:1px solid #dbe1ea;border-radius:16px;padding:14px 16px;box-shadow:0 6px 18px rgba(17,24,39,0.05);">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:#6b7280;margin-bottom:8px;">NOTES</div>
        <div style="
          font-size:11px;
          line-height:1.55;
          color:#4b5563;
          white-space:pre-wrap;
          word-break:break-word;
          max-height:98px;
          overflow:hidden;
        ">{{notes}}</div>
      </div>
    </div>

  </div>
</div>
`;
