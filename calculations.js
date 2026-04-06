window.InvoiceEditorCalculations = (() => {
  const U = window.InvoiceEditorUtils;
  const S = window.InvoiceEditorState;

  function buildGroupedFields(fields) {
    const groups = { business: [], client: [], invoice: [], totals: [], notes: [], other: [] };

    fields.forEach((field) => {
      if (/^(company|business|bank|account)/i.test(field)) groups.business.push(field);
      else if (/^(client|customer)/i.test(field)) groups.client.push(field);
      else if (/^(invoice|date|due|order|reference|po|currency|terms|payment_method|project_code)/i.test(field)) groups.invoice.push(field);
      else if (/^(subtotal|shipping|tax|discount|total|grand_total)/i.test(field)) groups.totals.push(field);
      else if (/^(notes|payment|thank_you)/i.test(field)) groups.notes.push(field);
      else groups.other.push(field);
    });

    return groups;
  }

  function addTemplateSpecificFallbacks(data) {
    data.company_name = data.company_name || data.business_name || "";
    data.business_name = data.business_name || data.company_name || "";

    data.client_name = data.client_name || data.customer_name || "";
    data.customer_name = data.customer_name || data.client_name || "";

    data.client_address = data.client_address || data.customer_address || "";
    data.customer_address = data.customer_address || data.client_address || "";

    data.client_phone = data.client_phone || data.customer_phone || "";
    data.customer_phone = data.customer_phone || data.client_phone || "";

    data.client_email = data.client_email || data.customer_email || "";
    data.customer_email = data.customer_email || data.client_email || "";

    data.invoice_date = data.invoice_date || data.date || "";
    data.date = data.date || data.invoice_date || "";

    data.tax_amount = data.tax_amount || data.tax || "";
    data.tax = data.tax || data.tax_amount || "";

    data.total = data.total || data.grand_total || "";
    data.grand_total = data.grand_total || data.total || "";

    data.payment_info = data.payment_info || data.payment_details || "";
    data.payment_details = data.payment_details || data.payment_info || "";

    data.logo_url = data.logo_url || data.logo_data_url || "";
    data.logo_data_url = data.logo_data_url || data.logo_url || "";
    data.company_logo_url = data.company_logo_url || data.logo_url || "";
    data.business_logo_url = data.business_logo_url || data.logo_url || "";
  }

  function calculateTotals() {
    const rows = document.querySelectorAll("#items-table tbody tr");
    let subtotal = 0;

    rows.forEach((row) => {
      const priceInput = row.querySelector('[data-field="unit_price"]');
      const qtyInput = row.querySelector('[data-field="quantity"]') || row.querySelector('[data-field="qty"]');
      const lineTotalInput = row.querySelector('[data-field="line_total"]');

      const price = parseFloat(priceInput?.value || "0") || 0;
      const qty = parseFloat(qtyInput?.value || "0") || 0;
      const lineTotal = price * qty;

      if (lineTotalInput) {
        lineTotalInput.value = lineTotal ? lineTotal.toFixed(2) : "";
      }

      subtotal += lineTotal;
    });

    const taxRate = parseFloat(U.getVal("tax_rate") || "0") || 0;
    const discount = parseFloat(U.getVal("discount") || "0") || 0;
    const shipping = parseFloat(U.getVal("shipping") || "0") || 0;

    const taxableAmount = Math.max(0, subtotal - discount);
    const taxAmount = taxableAmount * (taxRate / 100);
    const grandTotal = Math.max(0, taxableAmount + taxAmount + shipping);

    // UI fields update
    U.setVal("subtotal", subtotal.toFixed(2));
    U.setVal("tax_amount", taxAmount.toFixed(2));
    U.setVal("grand_total", grandTotal.toFixed(2));
    U.setVal("total", grandTotal.toFixed(2));

    // ✅ CRITICAL FIX: sync with state (Mustache uses this)
    if (S) {
      if (typeof S.set === "function") {
        S.set("subtotal", subtotal.toFixed(2));
        S.set("tax_amount", taxAmount.toFixed(2));
        S.set("grand_total", grandTotal.toFixed(2));
        S.set("total", grandTotal.toFixed(2));
      } else {
        S.subtotal = subtotal.toFixed(2);
        S.tax_amount = taxAmount.toFixed(2);
        S.grand_total = grandTotal.toFixed(2);
        S.total = grandTotal.toFixed(2);
      }
    }
  }

  function buildItemsFromDom(itemFields) {
    const rows = document.querySelectorAll("#items-table tbody tr");
    const items = [];
    const htmlRows = [];

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      const item = {};

      inputs.forEach((input) => {
        const field = input.dataset.field || "";
        if (!field) return;
        item[field] = String(input.value ?? "").trim();
      });

      item.description = item.description || item.item_description || "";
      item.item_description = item.item_description || item.description || "";
      item.qty = item.qty || item.quantity || "";
      item.quantity = item.quantity || item.qty || "";
      item.unit_price = item.unit_price || "";
      item.line_total = item.line_total || "";
      item.sku = item.sku || "";

      items.push(item);

      htmlRows.push(
        `<tr>
          <td style="padding:6px;border:1px solid #e5e7eb;">${U.escapeHtml(item.description || item.item_description || "")}</td>
          <td style="padding:6px;border:1px solid #e5e7eb;text-align:center;">${U.escapeHtml(item.qty || item.quantity || "")}</td>
          <td style="padding:6px;border:1px solid #e5e7eb;text-align:right;">${U.escapeHtml(item.unit_price || "")}</td>
          <td style="padding:6px;border:1px solid #e5e7eb;text-align:right;">${U.escapeHtml(item.line_total || "")}</td>
        </tr>`
      );
    });

    return { items, htmlRows: htmlRows.join("") };
  }

  function buildItemsSvg(items, currency) {
    if (!items.length) {
      return `<text x="0" y="14" font-size="11">No items added</text>`;
    }

    let y = 0;
    const parts = [];

    items.forEach((item) => {
      const desc = item.description || item.item_description || "";
      const qty = item.qty || item.quantity || "";
      const price = item.unit_price || "";
      const lineTotal = item.line_total || item.total || "";

      const descLines = U.wrapText(desc, 34, 2);
      const rowHeight = Math.max(22, descLines.length * 12 + 8);
      const rowTop = y;

      parts.push(
        `<line x1="0" y1="${rowTop + rowHeight - 2}" x2="505" y2="${rowTop + rowHeight - 2}" stroke="#e5e7eb" stroke-width="1"/>`
      );

      descLines.forEach((line, idx) => {
        parts.push(`<text x="0" y="${rowTop + 13 + idx * 12}" font-size="11">${U.escapeXml(line)}</text>`);
      });

      parts.push(`<text x="350" y="${rowTop + 13}" text-anchor="end" font-size="11">${U.escapeXml(U.formatMoney(price, currency))}</text>`);
      parts.push(`<text x="400" y="${rowTop + 13}" text-anchor="middle" font-size="11">${U.escapeXml(qty)}</text>`);
      parts.push(`<text x="505" y="${rowTop + 13}" text-anchor="end" font-size="11">${U.escapeXml(U.formatMoney(lineTotal, currency))}</text>`);

      y += rowHeight;
    });

    return parts.join("\n");
  }

  function buildTextLinesSvg(text, startY, maxChars = 38, lineHeight = 12, fontSize = 10) {
    const lines = U.wrapText(text, maxChars, 4);
    return lines
      .map((line, idx) => `<text x="0" y="${startY + idx * lineHeight}" font-size="${fontSize}">${U.escapeXml(line)}</text>`)
      .join("\n");
  }

  return {
    buildGroupedFields,
    addTemplateSpecificFallbacks,
    calculateTotals,
    buildItemsFromDom,
    buildItemsSvg,
    buildTextLinesSvg
  };
})();
