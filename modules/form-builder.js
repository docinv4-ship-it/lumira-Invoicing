window.InvoiceEditorForm = (() => {
  const S = window.InvoiceEditorState;
  const U = window.InvoiceEditorUtils;
  const C = window.InvoiceEditorCalculations;

  const FIELD_CHAR_LIMITS = {
    notes: 50,
    payment_info: 16,
    payment_details: 160,
    payment_method: 60,
    payment_terms: 120,
    terms: 120,
    description: 80,
    item_description: 80
  };

  const SECTION_ORDER = [
    "logo",
    "business",
    "client",
    "invoice",
    "items",
    "totals",
    "notes",
    "other"
  ];

  const SECTION_LABELS = {
    logo: "Logo Upload",
    business: "Business Details",
    client: "Client Details",
    invoice: "Invoice Details",
    items: "Items / Services",
    totals: "Totals / Billing",
    notes: "Notes & Payment",
    other: "Other Fields"
  };

  const SECTION_FIELD_ORDER = {
    logo: ["logo_upload"],

    business: [
      "company_name",
      "business_name",
      "company_address",
      "business_address",
      "company_phone",
      "business_phone",
      "company_email",
      "business_email",
      "business_tax_id"
    ],

    client: [
      "client_name",
      "customer_name",
      "client_address",
      "customer_address",
      "client_phone",
      "customer_phone",
      "client_email",
      "customer_email",
      "client_tax_id"
    ],

    invoice: [
      "invoice_number",
      "invoice_date",
      "date",
      "due_date",
      "currency",
      "order_id",
      "po_number",
      "reference_number"
    ],

    totals: [
      "subtotal",
      "shipping",
      "tax_rate",
      "tax_amount",
      "discount",
      "total",
      "grand_total"
    ],

    notes: [
      "notes",
      "payment_info",
      "payment_details",
      "payment_method",
      "payment_terms",
      "terms",
      "bank_details",
      "bank_name",
      "bank_account",
      "bank_routing",
      "account_number"
    ],

    other: [
      "project_code",
      "thank_you_text"
    ]
  };

  const FIELD_PRIORITY = {
    logo_upload: 1,

    company_name: 10,
    business_name: 11,
    company_address: 12,
    business_address: 13,
    company_phone: 14,
    business_phone: 15,
    company_email: 16,
    business_email: 17,
    business_tax_id: 18,

    client_name: 20,
    customer_name: 21,
    client_address: 22,
    customer_address: 23,
    client_phone: 24,
    customer_phone: 25,
    client_email: 26,
    customer_email: 27,
    client_tax_id: 28,

    invoice_number: 40,
    invoice_date: 41,
    date: 42,
    due_date: 43,
    currency: 44,
    order_id: 45,
    po_number: 46,
    reference_number: 47,

    subtotal: 60,
    shipping: 61,
    tax_rate: 62,
    tax_amount: 63,
    discount: 64,
    total: 65,
    grand_total: 66,

    notes: 70,
    payment_info: 71,
    payment_details: 72,
    payment_method: 73,
    payment_terms: 74,
    terms: 75,
    bank_details: 90,
    bank_name: 91,
    bank_account: 92,
    bank_routing: 93,
    account_number: 94,

    project_code: 95,
    thank_you_text: 96
  };

  function getFormContainer() {
    return document.getElementById("invoice-form");
  }

  function getVisibleItemsList() {
    return document.getElementById("items-visible-list");
  }

  function getHiddenItemsBody() {
    return document.querySelector("#items-table tbody");
  }

  function getCurrentValue(fieldId, tplId) {
    if (typeof S.getFieldValue === "function") {
      return String(S.getFieldValue(fieldId, tplId) || "");
    }
    return String(S[fieldId] ?? "").trim();
  }

  function getFieldDef(fieldId) {
    return S.masterFields[fieldId] || {
      label: fieldId.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      type: "text",
      placeholder: fieldId
    };
  }

  function getItemDef(fieldId) {
    return S.itemMaster[fieldId] || {
      label: fieldId.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      type: "text",
      placeholder: fieldId
    };
  }

  function getFieldPriority(fieldId) {
    return FIELD_PRIORITY[fieldId] ?? 9999;
  }

  function sortFields(fields = [], sectionKey = "") {
    const preferred = SECTION_FIELD_ORDER[sectionKey] || [];
    const preferredIndex = new Map(preferred.map((field, index) => [field, index]));

    return [...fields].sort((a, b) => {
      const ai = preferredIndex.has(a) ? preferredIndex.get(a) : 999;
      const bi = preferredIndex.has(b) ? preferredIndex.get(b) : 999;

      if (ai !== bi) return ai - bi;

      const pa = getFieldPriority(a);
      const pb = getFieldPriority(b);
      if (pa !== pb) return pa - pb;

      return String(a).localeCompare(String(b));
    });
  }

  function classifyField(fieldId) {
    if (fieldId === "logo_upload") return "logo";

    if (SECTION_FIELD_ORDER.business.includes(fieldId)) return "business";
    if (SECTION_FIELD_ORDER.client.includes(fieldId)) return "client";
    if (SECTION_FIELD_ORDER.invoice.includes(fieldId)) return "invoice";
    if (SECTION_FIELD_ORDER.totals.includes(fieldId)) return "totals";
    if (SECTION_FIELD_ORDER.notes.includes(fieldId)) return "notes";
    if (SECTION_FIELD_ORDER.other.includes(fieldId)) return "other";

    return "other";
  }

  function groupFieldsForForm(fields = []) {
    const grouped = {
      logo: [],
      business: [],
      client: [],
      invoice: [],
      totals: [],
      notes: [],
      other: []
    };

    for (const fieldId of fields) {
      const section = classifyField(fieldId);
      grouped[section].push(fieldId);
    }

    for (const key of Object.keys(grouped)) {
      grouped[key] = sortFields(grouped[key], key);
    }

    return grouped;
  }

  function createFieldLabel(fieldId, def) {
    const label = U.el("label", { for: fieldId });
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "6px";
    label.style.margin = "0 0 6px 0";
    label.style.fontWeight = "700";
    label.style.color = "var(--text)";
    label.style.fontSize = "13px";
    label.style.lineHeight = "1.2";

    const text = U.el("span", {}, def.label);
    label.appendChild(text);

    if (U.isRequiredField(fieldId)) {
      const star = U.el("span", {}, "*");
      star.style.color = "#dc2626";
      star.style.fontWeight = "800";
      star.style.lineHeight = "1";
      label.appendChild(star);
    }

    return label;
  }

  function getCharacterLimit(fieldId) {
    return FIELD_CHAR_LIMITS[fieldId] || 0;
  }

  function getCharacterLimitText(fieldId, currentLength = 0) {
    const limit = getCharacterLimit(fieldId);
    if (!limit) return "";
    return `${currentLength}/${limit} characters`;
  }

  function createLimitHint(fieldId, currentValue = "") {
    const limit = getCharacterLimit(fieldId);
    if (!limit) return null;

    const helper = U.el("div");
    helper.dataset.role = "char-helper";
    helper.dataset.field = fieldId;
    helper.style.marginTop = "6px";
    helper.style.fontSize = "12px";
    helper.style.color = "var(--muted)";
    helper.style.lineHeight = "1.35";
    helper.textContent = getCharacterLimitText(fieldId, String(currentValue || "").length);
    return helper;
  }

  function trimToLimit(value, limit) {
    const text = String(value ?? "");
    if (!limit || text.length <= limit) return text;
    return text.slice(0, limit);
  }

  function updateLimitHint(fieldId, inputNode, hintNode) {
    if (!hintNode) return;
    const limit = getCharacterLimit(fieldId);
    if (!limit) return;
    hintNode.textContent = getCharacterLimitText(fieldId, String(inputNode?.value ?? "").length);
  }

  function bindCharacterLimit(fieldId, inputNode, hintNode) {
    const limit = getCharacterLimit(fieldId);
    if (!limit || !inputNode) return;

    inputNode.maxLength = limit;

    const sync = () => {
      const cleaned = trimToLimit(inputNode.value, limit);
      if (cleaned !== inputNode.value) {
        inputNode.value = cleaned;
      }
      updateLimitHint(fieldId, inputNode, hintNode);
    };

    inputNode.addEventListener("input", sync);
    inputNode.addEventListener("paste", () => setTimeout(sync, 0));
    inputNode.addEventListener("blur", sync);

    sync();
  }

  function createInput(fieldId, def, currentValue = "") {
    let node;
    if (def.type === "textarea") {
      node = document.createElement("textarea");
      node.rows = 3;
    } else {
      node = document.createElement("input");
      node.type = def.type || "text";
      if (def.min !== undefined) node.min = def.min;
      if (def.step !== undefined) node.step = def.step;
    }

    node.id = fieldId;
    node.placeholder = def.placeholder || def.label || fieldId;
    node.style.width = "100%";
    node.style.maxWidth = "none";
    node.style.padding = "12px 14px";
    node.style.border = "1px solid var(--border-strong)";
    node.style.borderRadius = "14px";
    node.style.background = def.readonly ? "var(--bg-soft)" : "var(--panel)";
    node.style.color = "var(--text)";
    node.style.boxSizing = "border-box";
    node.style.fontSize = "14px";
    node.style.lineHeight = "1.45";
    node.style.outline = "none";
    node.value = currentValue || "";

    const limit = getCharacterLimit(fieldId);
    if (limit) {
      node.maxLength = limit;
      node.setAttribute("aria-describedby", `${fieldId}-limit`);
      node.value = trimToLimit(node.value, limit);
    }

    if (def.readonly) {
      node.readOnly = true;
      node.style.cursor = "default";
    }

    return node;
  }

  function createItemInput(fieldId, def, currentValue = "") {
    const node = document.createElement("input");
    node.type = def.type || "text";
    node.placeholder = def.placeholder || def.label || fieldId;
    node.style.width = "100%";
    node.style.padding = "10px 12px";
    node.style.border = "1px solid var(--border-strong)";
    node.style.borderRadius = "12px";
    node.style.background = def.readonly ? "var(--bg-soft)" : "var(--panel)";
    node.style.color = "var(--text)";
    node.style.boxSizing = "border-box";
    node.style.fontSize = "13px";
    node.style.lineHeight = "1.4";
    node.style.outline = "none";
    node.value = currentValue || "";

    const limit = getCharacterLimit(fieldId);
    if (limit) {
      node.maxLength = limit;
      node.setAttribute("aria-describedby", `${fieldId}-limit`);
      node.value = trimToLimit(node.value, limit);
    }

    if (def.min !== undefined) node.min = def.min;
    if (def.step !== undefined) node.step = def.step;
    if (def.readonly) {
      node.readOnly = true;
      node.style.cursor = "default";
    }

    node.dataset.field = fieldId;
    return node;
  }

  function setLogoHiddenValues(tplId, dataUrl = "", fileName = "") {
    const logoValue = dataUrl || "";
    const fields = ["logo_url", "logo_data_url", "logo_src", "company_logo_url", "business_logo_url"];

    fields.forEach((field) => {
      U.setVal(field, logoValue);
      if (typeof S.setFieldValue === "function") {
        S.setFieldValue(field, logoValue, tplId, { persist: false });
      }
    });

    U.setVal("logo_file_name", fileName || "");
    if (typeof S.setFieldValue === "function") {
      S.setFieldValue("logo_file_name", fileName || "", tplId, { persist: false });
    }

    if (S.logoState?.dataUrlByTemplate) S.logoState.dataUrlByTemplate.set(tplId, logoValue);
    if (S.logoState?.fileNameByTemplate) S.logoState.fileNameByTemplate.set(tplId, fileName || "");
  }

  function clearLogoHiddenValues(tplId) {
    const fields = ["logo_url", "logo_data_url", "logo_src", "company_logo_url", "business_logo_url"];

    fields.forEach((field) => {
      U.setVal(field, "");
      if (typeof S.setFieldValue === "function") {
        S.setFieldValue(field, "", tplId, { persist: false });
      }
    });

    U.setVal("logo_file_name", "");
    if (typeof S.setFieldValue === "function") {
      S.setFieldValue("logo_file_name", "", tplId, { persist: false });
    }

    if (S.logoState?.dataUrlByTemplate) S.logoState.dataUrlByTemplate.delete(tplId);
    if (S.logoState?.fileNameByTemplate) S.logoState.fileNameByTemplate.delete(tplId);
  }

  function createLogoSection(tplId) {
    const box = U.el("div");
    box.className = "form-section logo-section full-span";
    box.style.marginBottom = "14px";
    box.style.padding = "14px";
    box.style.border = "1px solid var(--border)";
    box.style.borderRadius = "18px";
    box.style.background = "var(--panel)";
    box.style.overflow = "hidden";

    const header = U.el("div", {}, "Logo Upload");
    header.style.fontWeight = "800";
    header.style.fontSize = "15px";
    header.style.marginBottom = "8px";
    box.appendChild(header);

    const hint = U.el("div", {}, "Upload a company logo for this template.");
    hint.style.fontSize = "12px";
    hint.style.color = "var(--muted)";
    hint.style.marginBottom = "12px";
    box.appendChild(hint);

    const row = U.el("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.flexWrap = "wrap";

    const previewWrap = U.el("div");
    previewWrap.style.width = "88px";
    previewWrap.style.height = "88px";
    previewWrap.style.borderRadius = "16px";
    previewWrap.style.border = "1px dashed var(--border-strong)";
    previewWrap.style.background = "var(--panel)";
    previewWrap.style.display = "grid";
    previewWrap.style.placeItems = "center";
    previewWrap.style.overflow = "hidden";
    previewWrap.style.flex = "0 0 auto";

    const currentLogo =
      typeof S.getFieldValue === "function"
        ? (S.getFieldValue("logo_url", tplId) || S.getFieldValue("logo_data_url", tplId) || "")
        : (U.getVal("logo_url") || "");

    if (currentLogo) {
      const img = document.createElement("img");
      img.alt = "Logo preview";
      img.src = currentLogo;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";
      previewWrap.appendChild(img);
    } else {
      const emptyLabel = U.el("div", {}, "No logo");
      emptyLabel.style.color = "var(--muted-2)";
      emptyLabel.style.fontSize = "12px";
      emptyLabel.style.fontWeight = "700";
      previewWrap.appendChild(emptyLabel);
    }

    const controls = U.el("div");
    controls.style.display = "grid";
    controls.style.gap = "10px";
    controls.style.minWidth = "260px";
    controls.style.flex = "1 1 260px";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
    fileInput.style.padding = "10px 12px";
    fileInput.style.border = "1px solid var(--border-strong)";
    fileInput.style.borderRadius = "12px";
    fileInput.style.background = "var(--panel)";
    fileInput.style.width = "100%";

    const actions = U.el("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.flexWrap = "wrap";

    const removeBtn = U.el("button", { type: "button", class: "item-remove-btn" }, "Remove Logo");
    removeBtn.style.padding = "10px 14px";
    removeBtn.style.borderRadius = "12px";
    removeBtn.style.border = "0";
    removeBtn.style.background = "#334155";
    removeBtn.style.color = "#fff";
    removeBtn.style.fontWeight = "800";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "inline-flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.position = "relative";
    removeBtn.style.zIndex = "5";
    removeBtn.style.visibility = "visible";
    removeBtn.style.opacity = "1";
    removeBtn.style.flex = "0 0 auto";

    function renderPreview(src) {
      previewWrap.innerHTML = "";
      if (!src) {
        const emptyLabel = U.el("div", {}, "No logo");
        emptyLabel.style.color = "var(--muted-2)";
        emptyLabel.style.fontSize = "12px";
        emptyLabel.style.fontWeight = "700";
        previewWrap.appendChild(emptyLabel);
        return;
      }

      const img = document.createElement("img");
      img.alt = "Logo preview";
      img.src = src;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";
      previewWrap.appendChild(img);
    }

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        window.InvoiceEditorCore.status("Please upload a valid image file.");
        fileInput.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        window.InvoiceEditorCore.status("Logo file is too large. Use an image under 5MB.");
        fileInput.value = "";
        return;
      }

      try {
        window.InvoiceEditorCore.status("Uploading logo...");
        const dataUrl = await U.fileToDataUrl(file);

        setLogoHiddenValues(tplId, dataUrl, file.name);
        renderPreview(dataUrl);

        if (typeof S.scheduleAutosave === "function") {
          S.scheduleAutosave(tplId);
        }

        window.InvoiceEditorCore.triggerLiveUpdate();
        window.InvoiceEditorCore.status("Logo uploaded successfully.");
      } catch (err) {
        console.error(err);
        window.InvoiceEditorCore.status("Logo upload failed.");
      }
    });

    removeBtn.addEventListener("click", () => {
      fileInput.value = "";
      renderPreview("");
      clearLogoHiddenValues(tplId);

      if (typeof S.scheduleAutosave === "function") {
        S.scheduleAutosave(tplId);
      }

      window.InvoiceEditorCore.triggerLiveUpdate();
      window.InvoiceEditorCore.status("Logo removed.");
    });

    const hiddenWrap = U.el("div", { style: "display:none" });
    ["logo_url", "logo_data_url", "logo_src", "company_logo_url", "business_logo_url", "logo_file_name"].forEach((id) => {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.id = id;
      hidden.value = id === "logo_file_name" ? "" : (currentLogo || "");
      hiddenWrap.appendChild(hidden);
    });

    actions.appendChild(removeBtn);
    controls.appendChild(fileInput);
    controls.appendChild(actions);

    row.appendChild(previewWrap);
    row.appendChild(controls);
    box.appendChild(row);
    box.appendChild(hiddenWrap);

    return box;
  }

  function getItemValue(item, fieldId) {
    return String(item?.[fieldId] ?? "").trim();
  }

  function createItemFieldCell(fieldId, value, rowKey, opts = {}) {
    const def = getItemDef(fieldId);
    const cell = U.el("div");
    cell.style.display = "flex";
    cell.style.flexDirection = "column";
    cell.style.minWidth = "0";
    cell.style.width = "100%";
    cell.style.overflow = "visible";

    if (opts.fullSpan) {
      cell.style.gridColumn = "1 / -1";
    }

    const label = U.el("label", { for: `${fieldId}-${rowKey}` });
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "6px";
    label.style.margin = "0 0 6px 0";
    label.style.fontWeight = "700";
    label.style.color = "var(--text)";
    label.style.fontSize = "12px";
    label.style.lineHeight = "1.2";
    label.textContent = def.label || fieldId;

    const input = createItemInput(fieldId, def, value);
    input.id = `${fieldId}-${rowKey}`;
    input.dataset.field = fieldId;
    input.style.fontSize = "13px";
    input.style.padding = "10px 12px";
    input.style.minHeight = "42px";
    input.style.width = "100%";
    input.style.maxWidth = "100%";
    input.style.overflow = "hidden";
    input.style.textOverflow = "ellipsis";

    if (fieldId === "line_total") {
      input.readOnly = true;
      input.style.background = "rgba(37, 99, 235, 0.06)";
      input.style.borderColor = "rgba(37, 99, 235, 0.22)";
      input.style.fontWeight = "800";
      input.style.color = "var(--text)";
      input.style.cursor = "default";
    }

    if (def.type === "textarea") {
      input.style.minHeight = "84px";
      input.rows = 3;
    }

    const limit = getCharacterLimit(fieldId);
    let hint = null;
    if (limit) {
      hint = createLimitHint(fieldId, input.value);
      if (hint) {
        hint.id = `${input.id}-limit`;
        input.setAttribute("aria-describedby", hint.id);
      }
      bindCharacterLimit(fieldId, input, hint);
    }

    cell.appendChild(label);
    cell.appendChild(input);
    if (hint) cell.appendChild(hint);

    return { cell, input };
  }

  function renumberItemCards() {
    const cards = Array.from(document.querySelectorAll(".item-card"));
    cards.forEach((card, index) => {
      const title = card.querySelector(".item-card-title");
      if (title) {
        title.textContent = `Item ${index + 1}`;
      }
    });
  }

  function syncVisibleLineTotals() {
    const visibleList = getVisibleItemsList();
    const hiddenBody = getHiddenItemsBody();
    if (!visibleList || !hiddenBody) return;

    const visibleCards = Array.from(visibleList.querySelectorAll(".item-card"));
    const hiddenRows = Array.from(hiddenBody.querySelectorAll("tr"));

    visibleCards.forEach((card, index) => {
      const hiddenRow = hiddenRows[index];
      if (!hiddenRow) return;

      const hiddenLineTotal = hiddenRow.querySelector('input[data-field="line_total"]');
      const visibleLineTotal = card.querySelector('input[data-field="line_total"]');

      if (hiddenLineTotal && visibleLineTotal) {
        visibleLineTotal.value = String(hiddenLineTotal.value ?? "").trim();
      }
    });
  }

  function addItemRow(itemFields, initialItem = {}) {
    const visibleList = getVisibleItemsList();
    const hiddenBody = getHiddenItemsBody();
    if (!visibleList || !hiddenBody) return;

    const rowKey = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const visibleCard = U.el("div");
    visibleCard.className = "item-card";
    visibleCard.style.border = "1px solid var(--border)";
    visibleCard.style.borderRadius = "18px";
    visibleCard.style.background = "var(--panel)";
    visibleCard.style.boxShadow = "var(--shadow-soft)";
    visibleCard.style.padding = "14px";
    visibleCard.style.display = "grid";
    visibleCard.style.gap = "12px";
    visibleCard.style.overflow = "visible";
    visibleCard.style.position = "relative";

    const cardHeader = U.el("div");
    cardHeader.className = "item-card-header";
    cardHeader.style.display = "flex";
    cardHeader.style.alignItems = "center";
    cardHeader.style.justifyContent = "space-between";
    cardHeader.style.gap = "12px";
    cardHeader.style.flexWrap = "nowrap";
    cardHeader.style.minWidth = "0";
    cardHeader.style.overflow = "visible";

    const title = U.el("div", { class: "item-card-title" }, `Item ${hiddenBody.children.length + 1}`);
    title.style.fontSize = "14px";
    title.style.fontWeight = "900";
    title.style.letterSpacing = "-0.01em";
    title.style.color = "var(--text)";
    title.style.minWidth = "0";
    title.style.flex = "1 1 auto";
    title.style.overflow = "hidden";
    title.style.textOverflow = "ellipsis";
    title.style.whiteSpace = "nowrap";

    const removeBtn = U.el("button", { type: "button", class: "item-remove-btn" }, "Remove");
    removeBtn.style.padding = "9px 12px";
    removeBtn.style.borderRadius = "12px";
    removeBtn.style.border = "0";
    removeBtn.style.background = "#ef4444";
    removeBtn.style.color = "#fff";
    removeBtn.style.fontWeight = "800";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.flex = "0 0 auto";
    removeBtn.style.position = "relative";
    removeBtn.style.zIndex = "10";
    removeBtn.style.whiteSpace = "nowrap";
    removeBtn.style.display = "inline-flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.visibility = "visible";
    removeBtn.style.opacity = "1";

    cardHeader.appendChild(title);
    cardHeader.appendChild(removeBtn);
    visibleCard.appendChild(cardHeader);

    const grid = U.el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    grid.style.gap = "10px";
    grid.style.minWidth = "0";
    grid.style.overflow = "visible";

    const mirrorRow = document.createElement("tr");
    mirrorRow.style.display = "none";

    const fieldsToRender = Array.from(new Set([...(itemFields || []), "line_total"]));

    fieldsToRender.forEach((fieldId) => {
      const value = getItemValue(initialItem, fieldId);
      const fullSpan = fieldId === "description" || fieldId === "item_description" || fieldId === "line_total";
      const { cell, input } = createItemFieldCell(fieldId, value, rowKey, { fullSpan });

      const td = document.createElement("td");
      td.style.padding = "0";
      td.style.border = "0";

      const hiddenInput = document.createElement("input");
      hiddenInput.type = "text";
      hiddenInput.value = value;
      hiddenInput.dataset.field = fieldId;
      hiddenInput.id = `mirror-${fieldId}-${rowKey}`;
      hiddenInput.style.display = "none";

      input.addEventListener("input", () => {
        hiddenInput.value = input.value;
        if (typeof S.scheduleAutosave === "function") S.scheduleAutosave();
        window.InvoiceEditorCore.triggerLiveUpdate();
        requestAnimationFrame(() => syncVisibleLineTotals());
      });

      input.addEventListener("blur", () => {
        hiddenInput.value = input.value;
        if (typeof S.scheduleAutosave === "function") S.scheduleAutosave();
        window.InvoiceEditorCore.triggerLiveUpdate();
        requestAnimationFrame(() => syncVisibleLineTotals());
      });

      td.appendChild(hiddenInput);
      mirrorRow.appendChild(td);
      grid.appendChild(cell);
    });

    const tdAction = document.createElement("td");
    tdAction.style.padding = "0";
    tdAction.style.border = "0";
    mirrorRow.appendChild(tdAction);

    removeBtn.addEventListener("click", () => {
      visibleCard.remove();
      mirrorRow.remove();
      renumberItemCards();

      if (typeof S.scheduleAutosave === "function") S.scheduleAutosave();
      window.InvoiceEditorCore.triggerLiveUpdate();
      requestAnimationFrame(() => syncVisibleLineTotals());
    });

    visibleCard.appendChild(grid);
    visibleList.appendChild(visibleCard);
    hiddenBody.appendChild(mirrorRow);

    requestAnimationFrame(() => syncVisibleLineTotals());
  }

  function renderForm() {
    const formContainer = getFormContainer();
    if (!formContainer) {
      window.InvoiceEditorCore.setStatus("Form container not found");
      return;
    }

    const { tplId, config, template } = window.InvoiceEditorCore.getCurrentConfig();

    if (!template) {
      window.InvoiceEditorCore.setFormMessage("Template not available");
      return;
    }

    if (typeof S.setActiveTemplateId === "function") {
      S.setActiveTemplateId(tplId);
    }

    const currentData = typeof S.getTemplateData === "function" ? S.getTemplateData(tplId) : {};
    const currentItems = Array.isArray(currentData.items) && currentData.items.length ? currentData.items : [{}];

    formContainer.innerHTML = "";

    const pageTitle = U.el("div", {}, "Fill details");
    pageTitle.style.marginBottom = "12px";
    pageTitle.style.fontSize = "15px";
    pageTitle.style.fontWeight = "900";
    pageTitle.style.letterSpacing = "-0.01em";
    pageTitle.style.color = "var(--text)";
    formContainer.appendChild(pageTitle);

    const logoEnabled =
      typeof S.isLogoUploadEnabled === "function"
        ? S.isLogoUploadEnabled(tplId)
        : (S.LOGO_ENABLED_TEMPLATES && typeof S.LOGO_ENABLED_TEMPLATES.has === "function" && S.LOGO_ENABLED_TEMPLATES.has(tplId));

    if (logoEnabled) {
      formContainer.appendChild(createLogoSection(tplId));
    }

    const visibleFields = (config.fields || []).filter((fieldId) => fieldId !== "logo_upload");
    const grouped = groupFieldsForForm(visibleFields);

    SECTION_ORDER.forEach((sectionKey) => {
      if (sectionKey === "logo" || sectionKey === "items") return;

      const fields = grouped[sectionKey] || [];
      if (!fields.length) return;

      const sectionBox = U.el("div");
      sectionBox.className = "form-section";
      sectionBox.style.display = "grid";
      sectionBox.style.gridTemplateColumns = "repeat(auto-fit, minmax(230px, 1fr))";
      sectionBox.style.gap = "12px 14px";
      sectionBox.style.marginBottom = "14px";
      sectionBox.style.padding = "14px";
      sectionBox.style.border = "1px solid var(--border)";
      sectionBox.style.borderRadius = "18px";
      sectionBox.style.background = "var(--panel)";
      sectionBox.style.alignItems = "start";
      sectionBox.style.overflow = "visible";

      const header = U.el("div", {}, SECTION_LABELS[sectionKey] || sectionKey);
      header.className = "section-title";
      header.style.gridColumn = "1 / -1";
      header.style.fontWeight = "800";
      header.style.fontSize = "15px";
      header.style.marginBottom = "2px";
      header.style.color = "var(--text)";
      sectionBox.appendChild(header);

      fields.forEach((fieldId) => {
        const def = getFieldDef(fieldId);
        const wrapper = U.el("div", { class: "field-row" });
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.margin = "0";
        wrapper.style.minWidth = "0";

        if (def.type === "textarea") {
          wrapper.style.gridColumn = "1 / -1";
        }

        const label = createFieldLabel(fieldId, def);
        const currentValue = getCurrentValue(fieldId, tplId);
        const input = createInput(fieldId, def, currentValue);

        input.addEventListener("input", () => {
          const limit = getCharacterLimit(fieldId);
          if (limit) {
            const trimmed = trimToLimit(input.value, limit);
            if (trimmed !== input.value) input.value = trimmed;
          }

          if (typeof S.setFieldValue === "function") {
            S.setFieldValue(fieldId, input.value, tplId, { persist: false });
          }

          const helper = wrapper.querySelector('[data-role="char-helper"]');
          updateLimitHint(fieldId, input, helper);

          if (typeof S.scheduleAutosave === "function") {
            S.scheduleAutosave(tplId);
          }

          window.InvoiceEditorCore.triggerLiveUpdate();
        });

        input.addEventListener("blur", () => {
          const limit = getCharacterLimit(fieldId);
          if (limit) {
            input.value = trimToLimit(input.value, limit);
          }
          if (typeof S.setFieldValue === "function") {
            S.setFieldValue(fieldId, input.value, tplId, { persist: false });
          }
          window.InvoiceEditorCore.triggerLiveUpdate();
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);

        const hint = createLimitHint(fieldId, input.value);
        if (hint) {
          hint.id = `${fieldId}-limit`;
          wrapper.appendChild(hint);
          bindCharacterLimit(fieldId, input, hint);
        }

        sectionBox.appendChild(wrapper);
      });

      formContainer.appendChild(sectionBox);
    });

    const itemsSection = U.el("div");
    itemsSection.className = "form-section items-section full-span";
    itemsSection.style.display = "block";
    itemsSection.style.marginBottom = "14px";
    itemsSection.style.padding = "14px";
    itemsSection.style.border = "1px solid var(--border)";
    itemsSection.style.borderRadius = "18px";
    itemsSection.style.background = "var(--panel)";
    itemsSection.style.overflow = "visible";

    const itemsTitle = U.el("div", {}, SECTION_LABELS.items);
    itemsTitle.className = "section-title";
    itemsTitle.style.fontWeight = "800";
    itemsTitle.style.fontSize = "15px";
    itemsTitle.style.marginBottom = "6px";
    itemsTitle.style.color = "var(--text)";
    itemsSection.appendChild(itemsTitle);

    const itemsHint = U.el("div", {}, "Each item is shown as a stacked SaaS-style card for easier editing.");
    itemsHint.style.fontSize = "12px";
    itemsHint.style.color = "var(--muted)";
    itemsHint.style.marginBottom = "12px";
    itemsSection.appendChild(itemsHint);

    const visibleList = U.el("div", { id: "items-visible-list" });
    visibleList.style.display = "grid";
    visibleList.style.gap = "12px";
    visibleList.style.marginBottom = "12px";
    visibleList.style.overflow = "visible";
    itemsSection.appendChild(visibleList);

    const hiddenTableWrap = U.el("div");
    hiddenTableWrap.style.display = "none";

    const table = U.el("table", {
      id: "items-table",
      style: "width:100%;border-collapse:collapse"
    });

    const thead = U.el("thead");
    const headRow = U.el("tr");

    (config.itemFields || S.DEFAULT_ITEM_FIELDS).forEach((fieldId) => {
      const th = U.el("th", {}, getItemDef(fieldId).label || fieldId);
      headRow.appendChild(th);
    });

    const thActions = U.el("th", {}, "Actions");
    headRow.appendChild(thActions);
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = U.el("tbody");
    table.appendChild(tbody);
    hiddenTableWrap.appendChild(table);
    itemsSection.appendChild(hiddenTableWrap);

    const addItemBtn = U.el("button", { type: "button" }, "Add Item");
    addItemBtn.style.marginTop = "2px";
    addItemBtn.style.padding = "10px 14px";
    addItemBtn.style.borderRadius = "12px";
    addItemBtn.style.border = "0";
    addItemBtn.style.background = "linear-gradient(135deg, #2563eb, #7c3aed)";
    addItemBtn.style.color = "#fff";
    addItemBtn.style.fontWeight = "800";
    addItemBtn.style.cursor = "pointer";
    addItemBtn.addEventListener("click", () => {
      addItemRow(config.itemFields || S.DEFAULT_ITEM_FIELDS, {});
      if (typeof S.scheduleAutosave === "function") S.scheduleAutosave();
      window.InvoiceEditorCore.triggerLiveUpdate();
      requestAnimationFrame(() => syncVisibleLineTotals());
    });
    itemsSection.appendChild(addItemBtn);

    formContainer.appendChild(itemsSection);

    currentItems.forEach((item) => addItemRow(config.itemFields || S.DEFAULT_ITEM_FIELDS, item));
    renumberItemCards();

    const taxRateInput = document.getElementById("tax_rate");
    const discountInput = document.getElementById("discount");
    taxRateInput?.addEventListener("input", window.InvoiceEditorCore.triggerLiveUpdate);
    discountInput?.addEventListener("input", window.InvoiceEditorCore.triggerLiveUpdate);

    if (typeof C.calculateTotals === "function") {
      C.calculateTotals();
    }

    if (typeof S.scheduleAutosave === "function") {
      S.scheduleAutosave(tplId);
    }

    window.InvoiceEditorCore.triggerLiveUpdate();
    requestAnimationFrame(() => syncVisibleLineTotals());
    window.InvoiceEditorCore.setStatus(`Form loaded successfully for Template ${tplId}`);
  }

  return {
    createFieldLabel,
    createInput,
    createItemInput,
    getFieldDef,
    getItemDef,
    createLogoSection,
    addItemRow,
    renderForm
  };
})();
