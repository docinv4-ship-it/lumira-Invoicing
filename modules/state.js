window.InvoiceEditorState = (() => {
  const STATE = {};

  window.templates = window.templates || {};
  window.templatesConfig = window.templatesConfig || {};

  const STORAGE_KEY = "lumira.invoice-editor.v4";

  const CONFIG_LOGO_TEMPLATES = new Set(
    Object.entries(window.templatesConfig || {})
      .filter(([, cfg]) => Boolean(cfg && cfg.logoUpload === true))
      .map(([id]) => Number(id))
  );

  // Backward-safe fallback until config.js is fully updated everywhere.
  const LEGACY_LOGO_TEMPLATES = new Set([1, 3, 10, 11]);
  const LOGO_ENABLED_TEMPLATES =
    CONFIG_LOGO_TEMPLATES.size > 0 ? CONFIG_LOGO_TEMPLATES : LEGACY_LOGO_TEMPLATES;

  const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
  const DEFAULT_ITEM_FIELDS = ["description", "unit_price", "quantity", "line_total"];

  const REQUIRED_FIELD_IDS = new Set([
    "company_name",
    "business_name",
    "invoice_number",
    "invoice_date",
    "date",
    "due_date",
    "client_name",
    "customer_name"
  ]);

  const masterFields = {
    company_name: { label: "Company Name", type: "text" },
    business_name: { label: "Business Name", type: "text" },
    company_address: { label: "Company Address", type: "textarea" },
    business_address: { label: "Business Address", type: "textarea" },
    company_phone: { label: "Company Phone", type: "text" },
    business_phone: { label: "Business Phone", type: "text" },
    company_email: { label: "Company Email", type: "text" },
    business_email: { label: "Business Email", type: "text" },
    business_tax_id: { label: "Business Tax ID", type: "text" },

    invoice_number: { label: "Invoice Number", type: "text" },
    invoice_date: { label: "Invoice Date", type: "date" },
    date: { label: "Date", type: "date" },
    due_date: { label: "Due Date", type: "date" },
    currency: { label: "Currency", type: "text" },
    order_id: { label: "Order ID", type: "text" },
    po_number: { label: "PO Number", type: "text" },
    reference_number: { label: "Reference Number", type: "text" },

    client_name: { label: "Client Name", type: "text" },
    customer_name: { label: "Customer Name", type: "text" },
    client_address: { label: "Client Address", type: "textarea" },
    customer_address: { label: "Customer Address", type: "textarea" },
    client_phone: { label: "Client Phone", type: "text" },
    customer_phone: { label: "Customer Phone", type: "text" },
    client_email: { label: "Client Email", type: "text" },
    customer_email: { label: "Customer Email", type: "text" },
    client_tax_id: { label: "Client Tax ID", type: "text" },

    payment_method: { label: "Payment Method", type: "text", maxLength: 40 },
    payment_terms: { label: "Payment Terms", type: "textarea", maxLength: 120 },
    terms: { label: "Terms", type: "textarea", maxLength: 120 },
    bank_details: { label: "Bank Details", type: "textarea", maxLength: 180 },
    bank_name: { label: "Bank Name", type: "text" },
    bank_account: { label: "Bank Account", type: "text" },
    bank_routing: { label: "Bank Routing", type: "text" },
    account_number: { label: "Account Number", type: "text" },
    payment_info: { label: "Payment Info", type: "textarea", maxLength: 160 },
    payment_details: { label: "Payment Details", type: "textarea", maxLength: 160 },

    shipping: { label: "Shipping", type: "number" },
    subtotal: { label: "Subtotal", type: "text", readonly: true },
    tax_rate: { label: "Tax Rate (%)", type: "number" },
    tax_amount: { label: "Tax Amount", type: "text", readonly: true },
    discount: { label: "Discount", type: "number" },
    total: { label: "Total", type: "text", readonly: true },
    grand_total: { label: "Grand Total", type: "text", readonly: true },

    project_code: { label: "Project Code", type: "text" },
    thank_you_text: { label: "Thank You Text", type: "textarea", maxLength: 120 },
    notes: { label: "Notes", type: "textarea", maxLength: 160 },
    logo_url: { label: "Company Logo", type: "text", readonly: true }
  };

  const itemMaster = {
    description: { label: "Description", type: "text", placeholder: "Item description", maxLength: 80 },
    item_description: { label: "Item Description", type: "text", placeholder: "Item description", maxLength: 80 },
    sku: { label: "SKU", type: "text", placeholder: "SKU", maxLength: 30 },
    qty: { label: "Qty", type: "number", min: "0", step: "1", placeholder: "0" },
    quantity: { label: "Quantity", type: "number", min: "0", step: "1", placeholder: "0" },
    unit_price: { label: "Unit Price", type: "number", min: "0", step: "0.01", placeholder: "0.00" },
    discount: { label: "Discount", type: "number", min: "0", step: "0.01", placeholder: "0.00" },
    tax_rate: { label: "Tax Rate (%)", type: "number", min: "0", step: "0.01", placeholder: "0" },
    line_total: { label: "Line Total", type: "text", readonly: true, placeholder: "Auto calculated" }
  };

  const FIELD_GROUPS = [
    ["company_name", "business_name"],
    ["company_address", "business_address"],
    ["company_phone", "business_phone"],
    ["company_email", "business_email"],
    ["client_name", "customer_name"],
    ["client_address", "customer_address"],
    ["client_phone", "customer_phone"],
    ["client_email", "customer_email"],
    ["invoice_date", "date"],
    ["tax_amount", "tax"],
    ["total", "grand_total"],
    ["payment_info", "payment_details"],
    ["payment_terms", "terms"],
    ["logo_url", "logo_data_url", "logo_src", "company_logo_url", "business_logo_url"]
  ];

  const logoState = {
    dataUrlByTemplate: new Map(),
    fileNameByTemplate: new Map()
  };

  const dataByTemplate = new Map();
  let activeTemplateId = 1;
  let autosaveTimer = null;

  function isLogoUploadEnabled(tplId = activeTemplateId) {
    return LOGO_ENABLED_TEMPLATES.has(Number(tplId) || 1);
  }

  function clone(value) {
    if (value === undefined || value === null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeItem(item = {}) {
    const out = clone(item) || {};
    out.description = String(out.description ?? out.item_description ?? "").trim();
    out.item_description = String(out.item_description ?? out.description ?? "").trim();
    out.sku = String(out.sku ?? "").trim();
    out.qty = String(out.qty ?? out.quantity ?? "").trim();
    out.quantity = String(out.quantity ?? out.qty ?? "").trim();
    out.unit_price = String(out.unit_price ?? "").trim();
    out.discount = String(out.discount ?? "").trim();
    out.tax_rate = String(out.tax_rate ?? "").trim();
    out.line_total = String(out.line_total ?? out.total ?? "").trim();
    return out;
  }

  function applyFieldGroups(data) {
    FIELD_GROUPS.forEach((group) => {
      const firstValue = group.map((key) => String(data[key] ?? "").trim()).find(Boolean) || "";
      if (!firstValue) return;
      group.forEach((key) => {
        if (!String(data[key] ?? "").trim()) {
          data[key] = firstValue;
        }
      });
    });
    return data;
  }

  function normalizeInvoiceData(rawData) {
    const data = clone(rawData || {}) || {};

    data.company_name = String(data.company_name ?? data.business_name ?? "").trim();
    data.business_name = String(data.business_name ?? data.company_name ?? "").trim();

    data.company_address = String(data.company_address ?? data.business_address ?? "").trim();
    data.business_address = String(data.business_address ?? data.company_address ?? "").trim();

    data.company_phone = String(data.company_phone ?? data.business_phone ?? "").trim();
    data.business_phone = String(data.business_phone ?? data.company_phone ?? "").trim();

    data.company_email = String(data.company_email ?? data.business_email ?? "").trim();
    data.business_email = String(data.business_email ?? data.company_email ?? "").trim();

    data.client_name = String(data.client_name ?? data.customer_name ?? "").trim();
    data.customer_name = String(data.customer_name ?? data.client_name ?? "").trim();

    data.client_address = String(data.client_address ?? data.customer_address ?? "").trim();
    data.customer_address = String(data.customer_address ?? data.client_address ?? "").trim();

    data.client_phone = String(data.client_phone ?? data.customer_phone ?? "").trim();
    data.customer_phone = String(data.customer_phone ?? data.client_phone ?? "").trim();

    data.client_email = String(data.client_email ?? data.customer_email ?? "").trim();
    data.customer_email = String(data.customer_email ?? data.client_email ?? "").trim();

    data.invoice_date = String(data.invoice_date ?? data.date ?? "").trim();
    data.date = String(data.date ?? data.invoice_date ?? "").trim();

    data.tax_amount = String(data.tax_amount ?? data.tax ?? "").trim();
    data.tax = String(data.tax ?? data.tax_amount ?? "").trim();

    data.total = String(data.total ?? data.grand_total ?? "").trim();
    data.grand_total = String(data.grand_total ?? data.total ?? "").trim();

    data.payment_info = String(data.payment_info ?? data.payment_details ?? "").trim();
    data.payment_details = String(data.payment_details ?? data.payment_info ?? "").trim();

    data.payment_terms = String(data.payment_terms ?? data.terms ?? "").trim();
    data.terms = String(data.terms ?? data.payment_terms ?? "").trim();

    data.logo_url = String(
      data.logo_url ?? data.logo_data_url ?? data.logo_src ?? data.company_logo_url ?? data.business_logo_url ?? ""
    ).trim();
    data.logo_data_url = String(data.logo_data_url ?? data.logo_url ?? "").trim();
    data.logo_src = String(data.logo_src ?? data.logo_url ?? "").trim();
    data.company_logo_url = String(data.company_logo_url ?? data.logo_url ?? "").trim();
    data.business_logo_url = String(data.business_logo_url ?? data.logo_url ?? "").trim();
    data.logo_file_name = String(data.logo_file_name ?? "").trim();

    data.items = Array.isArray(data.items) ? data.items.map(normalizeItem) : [];
    return applyFieldGroups(data);
  }

  function createEmptyInvoice() {
    return normalizeInvoiceData({
      company_name: "",
      business_name: "",
      company_address: "",
      business_address: "",
      company_phone: "",
      business_phone: "",
      company_email: "",
      business_email: "",
      business_tax_id: "",

      client_name: "",
      customer_name: "",
      client_address: "",
      customer_address: "",
      client_phone: "",
      customer_phone: "",
      client_email: "",
      customer_email: "",
      client_tax_id: "",

      invoice_number: "",
      invoice_date: "",
      date: "",
      due_date: "",
      currency: "",
      order_id: "",
      po_number: "",
      reference_number: "",

      payment_method: "",
      payment_terms: "",
      terms: "",
      payment_info: "",
      payment_details: "",
      bank_details: "",
      bank_name: "",
      bank_account: "",
      bank_routing: "",
      account_number: "",

      shipping: "",
      subtotal: "",
      tax_rate: "",
      tax_amount: "",
      discount: "",
      total: "",
      grand_total: "",

      project_code: "",
      thank_you_text: "",
      notes: "",

      logo_url: "",
      logo_data_url: "",
      logo_src: "",
      company_logo_url: "",
      business_logo_url: "",
      logo_file_name: "",

      items: [
        {
          description: "",
          item_description: "",
          sku: "",
          qty: "",
          quantity: "",
          unit_price: "",
          discount: "",
          tax_rate: "",
          line_total: ""
        }
      ]
    });
  }

  function ensureTemplateData(tplId) {
    const id = Number(tplId) || 1;
    if (!dataByTemplate.has(id)) {
      dataByTemplate.set(id, createEmptyInvoice());
    }
    return dataByTemplate.get(id);
  }

  function syncLogoMapsFromData(tplId, data) {
    const id = Number(tplId) || 1;
    const logoValue = String(data?.logo_data_url || data?.logo_url || data?.logo_src || "").trim();
    const fileName = String(data?.logo_file_name || "").trim();

    if (logoValue) {
      logoState.dataUrlByTemplate.set(id, logoValue);
    } else {
      logoState.dataUrlByTemplate.delete(id);
    }

    if (fileName) {
      logoState.fileNameByTemplate.set(id, fileName);
    } else {
      logoState.fileNameByTemplate.delete(id);
    }
  }

  function hydrateRootFromActive() {
    const data = ensureTemplateData(activeTemplateId);

    const rootSyncKeys = [
      ...Object.keys(masterFields),
      "items",
      "subtotal",
      "shipping",
      "tax_rate",
      "tax_amount",
      "tax",
      "discount",
      "total",
      "grand_total",
      "logo_url",
      "logo_data_url",
      "logo_src",
      "company_logo_url",
      "business_logo_url",
      "logo_file_name",
      "invoice_date",
      "date",
      "payment_info",
      "payment_details",
      "payment_terms",
      "terms"
    ];

    rootSyncKeys.forEach((key) => {
      STATE[key] = clone(data[key] ?? "");
    });

    STATE.activeTemplateId = activeTemplateId;
    STATE.activeData = clone(data);
  }

  function persist() {
    try {
      const payload = {
        version: 1,
        activeTemplateId,
        templates: Object.fromEntries(
          [...dataByTemplate.entries()].map(([tplId, tplData]) => [String(tplId), clone(tplData)])
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("InvoiceEditorState persist failed:", err);
    }
  }

  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const savedTemplates = parsed?.templates || {};
      const savedActive = Number(parsed?.activeTemplateId || 1) || 1;

      Object.keys(savedTemplates).forEach((key) => {
        const tplId = Number(key) || 1;
        const merged = normalizeInvoiceData(savedTemplates[key]);
        dataByTemplate.set(tplId, merged);
        syncLogoMapsFromData(tplId, merged);
      });

      activeTemplateId = dataByTemplate.has(savedActive) ? savedActive : 1;
    } catch (err) {
      console.warn("InvoiceEditorState load failed:", err);
    }
  }

  function syncTemplateSelect() {
    const select = document.getElementById("template-select");
    if (select) {
      const nextValue = String(activeTemplateId || 1);
      if (select.value !== nextValue) {
        select.value = nextValue;
      }
    }
  }

  function setActiveTemplateId(tplId, options = {}) {
    const id = Number(tplId) || 1;
    activeTemplateId = id;
    ensureTemplateData(id);
    hydrateRootFromActive();
    syncTemplateSelect();
    if (options.persist !== false) persist();
  }

  function getTemplateData(tplId = activeTemplateId) {
    return clone(ensureTemplateData(tplId));
  }

  function getCurrentData() {
    return getTemplateData(activeTemplateId);
  }

  function getFieldValue(fieldId, tplId = activeTemplateId) {
    const data = ensureTemplateData(tplId);
    const direct = String(data?.[fieldId] ?? "").trim();
    if (direct) return direct;

    for (const group of FIELD_GROUPS) {
      if (!group.includes(fieldId)) continue;
      for (const key of group) {
        const value = String(data?.[key] ?? "").trim();
        if (value) return value;
      }
    }

    return "";
  }

  function applyFieldToData(data, fieldId, value) {
    const next = String(value ?? "").trim();
    const group = FIELD_GROUPS.find((items) => items.includes(fieldId));

    if (group) {
      group.forEach((key) => {
        data[key] = next;
      });
      return data;
    }

    data[fieldId] = next;
    return data;
  }

  function setFieldValue(fieldId, value, tplId = activeTemplateId, options = {}) {
    const id = Number(tplId) || activeTemplateId || 1;
    const data = ensureTemplateData(id);
    applyFieldToData(data, fieldId, value);
    normalizeInvoiceData(data);
    dataByTemplate.set(id, data);
    syncLogoMapsFromData(id, data);

    if (id === activeTemplateId) {
      hydrateRootFromActive();
    }

    if (options.persist !== false) {
      persist();
    }
  }

  function set(key, value) {
    const data = ensureTemplateData(activeTemplateId);
    applyFieldToData(data, key, value);
    normalizeInvoiceData(data);
    dataByTemplate.set(activeTemplateId, data);
    syncLogoMapsFromData(activeTemplateId, data);
    hydrateRootFromActive();
    persist();
  }

  function get(key) {
    return getFieldValue(key, activeTemplateId);
  }

  function collectDomSnapshot(tplId = activeTemplateId) {
    const current = clone(ensureTemplateData(tplId));

    Object.keys(masterFields).forEach((key) => {
      const node = document.getElementById(key);
      if (node && "value" in node) {
        current[key] = String(node.value ?? "").trim();
      }
    });

    ["logo_url", "logo_data_url", "logo_src", "company_logo_url", "business_logo_url", "logo_file_name"].forEach((key) => {
      const node = document.getElementById(key);
      if (node && "value" in node) {
        current[key] = String(node.value ?? "").trim();
      }
    });

    const rows = document.querySelectorAll("#items-table tbody tr");
    if (rows && rows.length) {
      current.items = [...rows].map((row) => {
        const item = {};
        row.querySelectorAll("input").forEach((input) => {
          const field = String(input.dataset.field || "").trim();
          if (!field) return;
          item[field] = String(input.value ?? "").trim();
        });
        return normalizeItem(item);
      });
    } else {
      current.items = [normalizeItem({})];
    }

    return normalizeInvoiceData(current);
  }

  function saveSnapshotFromDom(tplId = activeTemplateId) {
    const snapshot = collectDomSnapshot(tplId);
    dataByTemplate.set(Number(tplId) || 1, snapshot);
    syncLogoMapsFromData(tplId, snapshot);

    if (Number(tplId) === activeTemplateId) {
      hydrateRootFromActive();
    }

    persist();
  }

  function scheduleAutosave(tplId = activeTemplateId) {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      saveSnapshotFromDom(tplId);
    }, 180);
  }

  function resetTemplateData(tplId = activeTemplateId, options = {}) {
    const id = Number(tplId) || 1;
    const blank = createEmptyInvoice();
    dataByTemplate.set(id, blank);
    syncLogoMapsFromData(id, blank);

    if (id === activeTemplateId) {
      hydrateRootFromActive();
    }

    if (options.persist !== false) {
      persist();
    }

    return clone(blank);
  }

  function resetActiveTemplate(options = {}) {
    return resetTemplateData(activeTemplateId, options);
  }

  function injectInlineStyle() {
    if (document.getElementById("invoice-inline-edit-style")) return;

    const style = document.createElement("style");
    style.id = "invoice-inline-edit-style";
    style.textContent = `
      .invoice-inline-edit {
        cursor: text;
        outline: none;
      }
      .invoice-inline-edit:focus {
        outline: 2px solid #60a5fa;
        outline-offset: 2px;
        background: rgba(96, 165, 250, 0.08);
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  function escapeCss(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function setDomValue(fieldId, value) {
    const escaped = escapeCss(fieldId);
    const byId = document.getElementById(fieldId);
    if (byId && "value" in byId) {
      byId.value = value;
      return true;
    }

    const fallback = document.querySelector(`#items-table [data-field="${escaped}"]`);
    if (fallback && "value" in fallback) {
      fallback.value = value;
      return true;
    }

    return false;
  }

  function getPreviewEditableTarget(target) {
    if (!target) return null;
    if (target.matches && target.matches('[contenteditable="true"][data-field]')) return target;
    if (typeof target.closest === "function") {
      return target.closest('[contenteditable="true"][data-field]');
    }
    return null;
  }

  function handlePreviewEdit(target) {
    if (!target || !target.dataset || !target.dataset.field) return;

    const fieldId = String(target.dataset.field).trim();
    if (!fieldId) return;

    const value = String(target.textContent || target.innerText || "")
      .replace(/\u00a0/g, " ")
      .trim();

    setFieldValue(fieldId, value, activeTemplateId, { persist: false });

    const linked = FIELD_GROUPS.find((group) => group.includes(fieldId)) || [fieldId];
    linked.forEach((id) => setDomValue(id, value));

    scheduleAutosave(activeTemplateId);

    if (window._invoice_editor && typeof window._invoice_editor.triggerLiveUpdate === "function") {
      window._invoice_editor.triggerLiveUpdate();
    } else if (window.InvoiceEditorCore && typeof window.InvoiceEditorCore.triggerLiveUpdate === "function") {
      window.InvoiceEditorCore.triggerLiveUpdate();
    }
  }

  function installAutosaveBridge() {
    document.addEventListener(
      "input",
      (event) => {
        const target = event.target;
        if (!target) return;

        const previewTarget = getPreviewEditableTarget(target);
        if (previewTarget) {
          handlePreviewEdit(previewTarget);
          return;
        }

        if (
          target.matches &&
          (target.matches("#invoice-form input") ||
            target.matches("#invoice-form textarea") ||
            target.matches("#invoice-form select"))
        ) {
          scheduleAutosave(activeTemplateId);
        }
      },
      true
    );

    document.addEventListener(
      "change",
      (event) => {
        const target = event.target;
        if (!target) return;

        const previewTarget = getPreviewEditableTarget(target);
        if (previewTarget) {
          handlePreviewEdit(previewTarget);
          return;
        }

        if (
          target.matches &&
          (target.matches("#invoice-form input") ||
            target.matches("#invoice-form textarea") ||
            target.matches("#invoice-form select"))
        ) {
          scheduleAutosave(activeTemplateId);
        }
      },
      true
    );

    document.addEventListener(
      "blur",
      (event) => {
        const previewTarget = getPreviewEditableTarget(event.target);
        if (previewTarget) {
          saveSnapshotFromDom(activeTemplateId);

          if (window._invoice_editor && typeof window._invoice_editor.renderPreview === "function") {
            window._invoice_editor.renderPreview();
          } else if (window.InvoiceEditorCore && typeof window.InvoiceEditorCore.renderPreview === "function") {
            window.InvoiceEditorCore.renderPreview();
          }
        }
      },
      true
    );

    window.addEventListener("beforeunload", () => {
      try {
        saveSnapshotFromDom(activeTemplateId);
      } catch (_) {}
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        try {
          saveSnapshotFromDom(activeTemplateId);
        } catch (_) {}
      }
    });
  }

  loadPersistedState();
  ensureTemplateData(activeTemplateId);
  hydrateRootFromActive();
  injectInlineStyle();
  installAutosaveBridge();
  syncTemplateSelect();

  STATE.STORAGE_KEY = STORAGE_KEY;
  STATE.LOGO_ENABLED_TEMPLATES = LOGO_ENABLED_TEMPLATES;
  STATE.isLogoUploadEnabled = isLogoUploadEnabled;
  STATE.TRANSPARENT_PIXEL = TRANSPARENT_PIXEL;
  STATE.DEFAULT_ITEM_FIELDS = DEFAULT_ITEM_FIELDS;
  STATE.masterFields = masterFields;
  STATE.itemMaster = itemMaster;
  STATE.REQUIRED_FIELD_IDS = REQUIRED_FIELD_IDS;
  STATE.logoState = logoState;
  STATE.FIELD_GROUPS = FIELD_GROUPS;

  STATE.get = get;
  STATE.set = set;
  STATE.getFieldValue = getFieldValue;
  STATE.setFieldValue = setFieldValue;
  STATE.getTemplateData = getTemplateData;
  STATE.getCurrentData = getCurrentData;
  STATE.setActiveTemplateId = setActiveTemplateId;
  STATE.collectDomSnapshot = collectDomSnapshot;
  STATE.saveSnapshotFromDom = saveSnapshotFromDom;
  STATE.scheduleAutosave = scheduleAutosave;
  STATE.hydrateRootFromActive = hydrateRootFromActive;
  STATE.normalizeInvoiceData = normalizeInvoiceData;
  STATE.normalizeItem = normalizeItem;
  STATE.createEmptyInvoice = createEmptyInvoice;
  STATE.resetTemplateData = resetTemplateData;
  STATE.resetActiveTemplate = resetActiveTemplate;

  return STATE;
})();
