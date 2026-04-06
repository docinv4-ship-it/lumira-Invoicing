window.InvoiceEditorTemplate = (() => {
  const U = window.InvoiceEditorUtils;
  const S = window.InvoiceEditorState;
  const C = window.InvoiceEditorCalculations;

  const INLINE_EDITABLE_FIELDS = [
    "company_name",
    "business_name",
    "company_address",
    "business_address",
    "company_phone",
    "business_phone",
    "company_email",
    "business_email",
    "client_name",
    "customer_name",
    "client_address",
    "customer_address",
    "client_phone",
    "customer_phone",
    "client_email",
    "customer_email",
    "invoice_number",
    "invoice_date",
    "date",
    "due_date",
    "currency",
    "order_id",
    "po_number",
    "reference_number",
    "payment_method",
    "payment_info",
    "payment_details",
    "payment_terms",
    "terms",
    "bank_details",
    "project_code",
    "thank_you_text",
    "notes"
  ];

  const TEMPLATE_BASE_WIDTH = 595;
  const MOBILE_BREAKPOINT = 760;

  let resizeListenerInstalled = false;
  let resizeRafId = 0;

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function readStateValue(key) {
    if (!S) return "";
    try {
      if (typeof S.get === "function") {
        const value = S.get(key);
        return value === undefined || value === null ? "" : String(value);
      }
      if (typeof S.getFieldValue === "function") {
        const value = S.getFieldValue(key);
        return value === undefined || value === null ? "" : String(value);
      }
      const value = S[key];
      return value === undefined || value === null ? "" : String(value);
    } catch {
      return "";
    }
  }

  function readDomValue(key) {
    const node = document.getElementById(key);
    if (!node || !("value" in node)) return null;
    return String(node.value ?? "").trim();
  }

  function readValue(key) {
    const domValue = readDomValue(key);
    if (domValue !== null) return domValue;
    return readStateValue(key);
  }

  function resolveLogoData(tplId) {
    const logoKeys = [
      "logo_data_url",
      "logo_url",
      "logo_src",
      "company_logo_url",
      "business_logo_url"
    ];

    for (const key of logoKeys) {
      const domValue = readDomValue(key);
      if (domValue !== null) return domValue;
    }

    const stateLogo =
      (typeof S?.getFieldValue === "function" ? S.getFieldValue("logo_url", tplId) : "") ||
      (typeof S?.getFieldValue === "function" ? S.getFieldValue("logo_data_url", tplId) : "") ||
      (S?.logoState?.dataUrlByTemplate?.get(tplId) || "");

    return String(stateLogo || "").trim();
  }

  function isInsideSvg(node) {
    let current = node?.parentNode;
    while (current) {
      if (current.nodeType === 1 && String(current.tagName || "").toLowerCase() === "svg") {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function isBlockedTextParent(el) {
    if (!el || el.nodeType !== 1) return true;
    const tag = String(el.tagName || "").toLowerCase();
    return ["script", "style", "template", "noscript"].includes(tag);
  }

  function getPreviewHost() {
    return document.getElementById("temp-render");
  }

  function getRenderedPreviewRoot(host) {
    if (!host) return null;

    const children = Array.from(host.children || []);
    if (!children.length) return null;

    for (const child of children) {
      if (child.classList && child.classList.contains("invoice-template")) {
        return child;
      }
    }

    return children[0] || null;
  }

  function resetPreviewHostStyles(host) {
    if (!host) return;

    host.style.width = "100%";
    host.style.maxWidth = "100%";
    host.style.minWidth = "0";
    host.style.boxSizing = "border-box";
    host.style.position = "relative";
    host.style.display = "block";
    host.style.overflowX = "visible";
    host.style.overflowY = "visible";
    host.style.margin = "0 auto";
    host.style.padding = "0";
  }

  function fitPreviewToViewport() {
    const host = getPreviewHost();
    const root = getRenderedPreviewRoot(host);
    if (!host || !root) return;

    resetPreviewHostStyles(host);

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || TEMPLATE_BASE_WIDTH;
    const hostWidth = Math.max(0, host.clientWidth || host.parentElement?.clientWidth || viewportWidth);

    const isMobile = viewportWidth <= MOBILE_BREAKPOINT;
    const availableWidth = isMobile ? Math.max(0, hostWidth - 2) : hostWidth;
    let scale = 1;

    if (isMobile && availableWidth > 0) {
      scale = Math.min(1, availableWidth / TEMPLATE_BASE_WIDTH);
      scale = Math.max(0.5, scale);
    }

    root.dataset.baseWidth = String(TEMPLATE_BASE_WIDTH);
    root.style.width = `${TEMPLATE_BASE_WIDTH}px`;
    root.style.maxWidth = `${TEMPLATE_BASE_WIDTH}px`;
    root.style.boxSizing = "border-box";
    root.style.display = "block";
    root.style.margin = "0 auto";
    root.style.position = "relative";
    root.style.left = "0";
    root.style.right = "0";
    root.style.transformOrigin = "top center";
    root.style.willChange = "transform";

    if (isMobile) {
      root.style.transform = `scale(${scale})`;
      root.style.marginBottom = `${Math.max(0, Math.round((1 - scale) * 40))}px`;
    } else {
      root.style.transform = "none";
      root.style.marginBottom = "0";
    }
  }

  function schedulePreviewFit() {
    if (resizeRafId) return;

    resizeRafId = window.requestAnimationFrame(() => {
      resizeRafId = 0;
      fitPreviewToViewport();
    });
  }

  function installPreviewResizeListener() {
    if (resizeListenerInstalled) return;
    resizeListenerInstalled = true;

    window.addEventListener("resize", schedulePreviewFit, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(schedulePreviewFit, 120);
    });
  }

  function buildInlineEditableHtml(html, data) {
    try {
      const container = document.createElement("div");
      container.innerHTML = String(html || "");

      const fieldEntries = INLINE_EDITABLE_FIELDS
        .map((field) => ({
          field,
          value: String(data?.[field] ?? "").trim(),
        }))
        .filter((entry) => entry.value.length > 0)
        .sort((a, b) => b.value.length - a.value.length);

      if (!fieldEntries.length) return container.innerHTML;

      const textNodes = [];
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || isBlockedTextParent(parent)) return NodeFilter.FILTER_REJECT;
          if (isInsideSvg(node)) return NodeFilter.FILTER_REJECT;
          if (!String(node.nodeValue || "").trim()) return NodeFilter.FILTER_REJECT;
          if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) textNodes.push(walker.currentNode);

      for (const node of textNodes) {
        const text = String(node.nodeValue || "");
        if (!text.trim()) continue;

        const bestMatch = fieldEntries.find((entry) => text.includes(entry.value));
        if (!bestMatch) continue;

        const pattern = new RegExp(escapeRegExp(bestMatch.value), "g");
        let lastIndex = 0;
        let matched = false;

        const fragment = document.createDocumentFragment();
        let match;

        while ((match = pattern.exec(text)) !== null) {
          matched = true;

          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }

          const span = document.createElement("span");
          span.setAttribute("contenteditable", "true");
          span.setAttribute("data-field", bestMatch.field);
          span.setAttribute("spellcheck", "false");
          span.className = "invoice-inline-edit";
          span.textContent = match[0];
          fragment.appendChild(span);

          lastIndex = match.index + match[0].length;
        }

        if (!matched) continue;

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
      }

      return container.innerHTML;
    } catch (err) {
      console.warn("Inline edit decoration skipped:", err);
      return String(html || "");
    }
  }

  function gatherData() {
    try {
      if (window.InvoiceEditorCore && typeof window.InvoiceEditorCore.calculateTotals === "function") {
        window.InvoiceEditorCore.calculateTotals();
      }

      const { tplId, config } = window.InvoiceEditorCore.getCurrentConfig();
      const data = {};

      Object.keys(S.masterFields || {}).forEach((key) => {
        const value = readValue(key);
        data[key] = value;

        if (key === "company_name") data.business_name = value;
        if (key === "business_name") data.company_name = value;

        if (key === "client_name") data.customer_name = value;
        if (key === "customer_name") data.client_name = value;

        if (key === "client_address") data.customer_address = value;
        if (key === "customer_address") data.client_address = value;

        if (key === "client_phone") data.customer_phone = value;
        if (key === "customer_phone") data.client_phone = value;

        if (key === "client_email") data.customer_email = value;
        if (key === "customer_email") data.client_email = value;

        if (key === "invoice_date") data.date = value;
        if (key === "date") data.invoice_date = value;

        if (key === "tax_amount") data.tax = value;
        if (key === "tax") data.tax_amount = value;

        if (key === "total") data.grand_total = value;
        if (key === "grand_total") data.total = value;

        if (key === "payment_info") data.payment_details = value;
        if (key === "payment_details") data.payment_info = value;

        if (key === "payment_terms") data.terms = value;
        if (key === "terms") data.payment_terms = value;
      });

      C.addTemplateSpecificFallbacks(data);

      const logoDataUrl = resolveLogoData(tplId);

      data.logo = logoDataUrl;
      data.logo_data = logoDataUrl;
      data.logo_url = logoDataUrl;
      data.logo_data_url = logoDataUrl;
      data.logo_src = logoDataUrl;
      data.company_logo_url = logoDataUrl;
      data.business_logo_url = logoDataUrl;
      data.logo_file_name = S.logoState?.fileNameByTemplate?.get(tplId) || "";

      data.date = data.date || data.invoice_date || new Date().toISOString().slice(0, 10);
      data.invoice_date = data.invoice_date || data.date;

      const { items, htmlRows } = C.buildItemsFromDom(config?.itemFields || S.DEFAULT_ITEM_FIELDS);

      data.items = items.map((item, index) => ({
        index: index + 1,
        ...item,
        description: item.description || item.item_description || "",
        item_description: item.item_description || item.description || "",
        qty: item.qty || item.quantity || "",
        quantity: item.quantity || item.qty || "",
        unit_price: item.unit_price || "",
        line_total: item.line_total || "",
        sku: item.sku || ""
      }));

      data.items_html = htmlRows;
      data.items_svg = C.buildItemsSvg(data.items, data.currency || "");
      data.notes_svg = C.buildTextLinesSvg(data.notes, 18, 38, 12, 10);
      data.payment_info_svg = C.buildTextLinesSvg(data.payment_info || data.payment_details, 122, 38, 12, 10);

      data.subtotal = readValue("subtotal") || data.subtotal || "0";
      data.shipping = readValue("shipping") || data.shipping || "0";
      data.tax_rate = readValue("tax_rate") || data.tax_rate || "0";
      data.tax_amount = readValue("tax_amount") || data.tax_amount || data.tax || "0";
      data.tax = data.tax_amount;
      data.discount = readValue("discount") || data.discount || "0";
      data.total = readValue("total") || data.total || readValue("grand_total") || "0";
      data.grand_total = readValue("grand_total") || data.grand_total || readValue("total") || "0";

      return data;
    } catch (err) {
      console.error("gatherData failed:", err);
      return {
        date: new Date().toISOString().slice(0, 10),
        invoice_date: new Date().toISOString().slice(0, 10),
        subtotal: "0",
        tax_rate: "0",
        tax_amount: "0",
        tax: "0",
        discount: "0",
        total: "0",
        grand_total: "0",
        items: [],
        items_html: "",
        items_svg: "",
      };
    }
  }

  function renderPreview() {
    try {
      const { tplId, template } = window.InvoiceEditorCore.getCurrentConfig();

      if (!template) {
        window.InvoiceEditorCore.setStatus("Template not available");
        window.InvoiceEditorCore.setPreviewHtml(
          "<p style='padding:20px;color:#b91c1c;font-weight:700'>Template not available</p>"
        );
        return;
      }

      const data = gatherData();
      let output = Mustache.render(template, data);
      output = buildInlineEditableHtml(output, data);

      if (!output || !String(output).trim()) {
        window.InvoiceEditorCore.setPreviewHtml(
          "<p style='padding:20px;color:#b91c1c;font-weight:700'>Empty template output</p>"
        );
        window.InvoiceEditorCore.setStatus("Template rendered empty output");
        return;
      }

      window.InvoiceEditorCore.setPreviewHtml(output);
      window.InvoiceEditorCore.normalizePreviewNode();

      installPreviewResizeListener();
      fitPreviewToViewport();
      schedulePreviewFit();

      window.InvoiceEditorCore.setStatus(`Preview updated for Template ${tplId}`);
    } catch (err) {
      console.error("renderPreview failed:", err);
      window.InvoiceEditorCore.setPreviewHtml(
        "<p style='padding:20px;color:#b91c1c;font-weight:700'>Preview could not load. Check the console for details.</p>"
      );
      window.InvoiceEditorCore.setStatus("Preview render failed");
    }
  }

  return {
    gatherData,
    renderPreview
  };
})();