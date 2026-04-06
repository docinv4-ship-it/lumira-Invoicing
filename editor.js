(async function () {
  const files = [
    "config.js",
    "templates/template1.js",
    "templates/template2.js",
    "templates/template3.js",
    "templates/template4.js",
    "templates/template5.js",
    "templates/template6.js",
    "templates/template7.js",
    "templates/template8.js",
    "templates/template9.js",
    "templates/template10.js",
    "templates/template11.js",
    "modules/state.js",
    "modules/utils.js",
    "modules/calculations.js",
    "modules/form-builder.js",
    "modules/template-render.js",
    "editor-core.js"
  ];

  function loadScript(src, optional = false) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;

      script.onload = () => resolve(true);
      script.onerror = () => {
        if (optional) {
          console.warn(`Optional file not loaded: ${src}`);
          resolve(false);
        } else {
          reject(new Error(`Failed to load ${src}`));
        }
      };

      document.head.appendChild(script);
    });
  }

  function waitForDomReady() {
    if (document.readyState === "loading") {
      return new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
      });
    }
    return Promise.resolve();
  }

  function isFormField(target) {
    if (!target || !target.matches) return false;

    return Boolean(
      target.matches("#invoice-form input") ||
      target.matches("#invoice-form textarea") ||
      target.matches("#invoice-form select") ||
      target.matches("#items-table input") ||
      target.matches("#items-table textarea") ||
      target.matches(".item-card input") ||
      target.matches(".item-card textarea") ||
      target.matches(".item-card select") ||
      target.matches('.item-card [contenteditable="true"][data-field]') ||
      target.matches('[contenteditable="true"][data-field]')
    );
  }

  function syncDomToState() {
    const state = window.InvoiceEditorState;
    if (!state || typeof state.saveSnapshotFromDom !== "function") return;

    const activeTemplateId = state.activeTemplateId || 1;
    try {
      state.saveSnapshotFromDom(activeTemplateId);
    } catch (err) {
      console.warn("Failed to sync DOM to state:", err);
    }
  }

  function getActiveEditorApi() {
    return window._invoice_editor || window.InvoiceEditorCore || null;
  }

  function flushPreviewNow() {
    const editor = getActiveEditorApi();
    if (!editor) return;

    try {
      syncDomToState();

      if (typeof editor.calculateTotals === "function") {
        editor.calculateTotals();
      }

      if (typeof editor.renderPreview === "function") {
        editor.renderPreview();
        return;
      }

      if (typeof editor.triggerLiveUpdate === "function") {
        editor.triggerLiveUpdate();
      }
    } catch (err) {
      console.error("Live preview update failed:", err);
    }
  }

  function handleRefresh() {
    const state = window.InvoiceEditorState;
    const form = window.InvoiceEditorForm;
    const template = window.InvoiceEditorTemplate;
    const editor = getActiveEditorApi();

    try {
      if (state && typeof state.resetActiveTemplate === "function") {
        state.resetActiveTemplate({ persist: true });
      } else if (state && typeof state.resetTemplateData === "function") {
        state.resetTemplateData(state.activeTemplateId || 1, { persist: true });
      }

      if (form && typeof form.renderForm === "function") {
        form.renderForm();
      }

      if (template && typeof template.renderPreview === "function") {
        template.renderPreview();
      } else if (editor && typeof editor.renderPreview === "function") {
        editor.renderPreview();
      }

      if (editor && typeof editor.calculateTotals === "function") {
        editor.calculateTotals();
      }

      if (editor && typeof editor.status === "function") {
        editor.status("Editor refreshed: form and preview cleared");
      } else if (editor && typeof editor.setStatus === "function") {
        editor.setStatus("Editor refreshed: form and preview cleared");
      }

      requestAnimationFrame(() => {
        const nextEditor = getActiveEditorApi();
        if (nextEditor && typeof nextEditor.renderPreview === "function") {
          nextEditor.renderPreview();
        }
      });
    } catch (err) {
      console.error("Refresh failed:", err);
      if (editor && typeof editor.setStatus === "function") {
        editor.setStatus("Refresh failed");
      }
    }
  }

  function installLivePreviewBridge() {
    if (window.__invoiceLivePreviewBridgeInstalled) return;
    window.__invoiceLivePreviewBridgeInstalled = true;

    let rafId = 0;

    const scheduleUpdate = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        flushPreviewNow();
      });
    };

    document.addEventListener(
      "input",
      (event) => {
        const target = event.target;
        if (!isFormField(target)) return;
        scheduleUpdate();
      },
      true
    );

    document.addEventListener(
      "change",
      (event) => {
        const target = event.target;
        if (!isFormField(target)) return;
        scheduleUpdate();
      },
      true
    );

    document.addEventListener(
      "keyup",
      (event) => {
        const target = event.target;
        if (!isFormField(target)) return;
        scheduleUpdate();
      },
      true
    );

    document.addEventListener(
      "blur",
      (event) => {
        const target = event.target;
        if (!isFormField(target)) return;
        scheduleUpdate();
      },
      true
    );

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!target || !target.closest) return;

        if (
          target.closest("#invoice-form button") ||
          target.closest("#items-table button") ||
          target.closest(".item-card button") ||
          target.closest('[contenteditable="true"][data-field]')
        ) {
          scheduleUpdate();
        }
      },
      true
    );

    window.addEventListener("paste", scheduleUpdate, true);
    window.addEventListener("cut", scheduleUpdate, true);
  }

  function bindRefreshButton() {
    const refreshButton =
      document.getElementById("preview-btn") ||
      document.getElementById("refresh-btn");

    if (refreshButton && !refreshButton.__lumiraRefreshBound) {
      refreshButton.__lumiraRefreshBound = true;
      refreshButton.addEventListener("click", handleRefresh);
    }

    const extraRefreshButton = document.getElementById("refresh-btn");
    if (extraRefreshButton && !extraRefreshButton.__lumiraRefreshBound) {
      extraRefreshButton.__lumiraRefreshBound = true;
      extraRefreshButton.addEventListener("click", handleRefresh);
    }
  }

  function installResponsiveEditorUX() {
    const mobileQuery = window.matchMedia("(max-width: 1180px)");
    const formViewBtn = document.getElementById("mobile-form-btn");
    const previewViewBtn = document.getElementById("mobile-preview-btn");
    const refreshDockBtn = document.getElementById("mobile-refresh-btn");

    function updateDockState(view) {
      const isPreview = view === "preview";
      document.body.dataset.editorView = isPreview ? "preview" : "form";

      if (formViewBtn) formViewBtn.classList.toggle("is-active", !isPreview);
      if (previewViewBtn) previewViewBtn.classList.toggle("is-active", isPreview);
    }

    function syncModeToViewport() {
      if (mobileQuery.matches) {
        updateDockState("form");
      } else {
        document.body.dataset.editorView = "desktop";
        if (formViewBtn) formViewBtn.classList.remove("is-active");
        if (previewViewBtn) previewViewBtn.classList.remove("is-active");
      }
    }

    function switchView(view, opts = {}) {
      if (!mobileQuery.matches) return;

      updateDockState(view);

      if (opts.persist !== false) {
        localStorage.setItem("lumira-editor-mobile-view", view);
      }

      if (opts.scroll !== false) {
        const target = view === "preview"
          ? document.querySelector(".preview-panel")
          : document.querySelector(".form-panel");

        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    formViewBtn?.addEventListener("click", () => switchView("form"));
    previewViewBtn?.addEventListener("click", () => switchView("preview"));
    refreshDockBtn?.addEventListener("click", () => {
      handleRefresh();
      switchView("form");
    });

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncModeToViewport);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(syncModeToViewport);
    }

    window.addEventListener("orientationchange", () => {
      setTimeout(syncModeToViewport, 120);
    });

    syncModeToViewport();

    window.InvoiceEditorMobileUX = {
      switchView,
      syncModeToViewport,
    };
  }

  try {
    for (const file of files) {
      const isOptional = file.includes("templates-config.js") || file.endsWith("/config.js");
      await loadScript(file, isOptional);
    }

    await waitForDomReady();

    if (window.InvoiceEditorCore && typeof window.InvoiceEditorCore.init === "function") {
      window.InvoiceEditorCore.init();
    } else {
      console.error("InvoiceEditorCore not available");
      return;
    }

    installLivePreviewBridge();
    bindRefreshButton();
    installResponsiveEditorUX();

    flushPreviewNow();
  } catch (err) {
    console.error("Editor bootstrap failed:", err);
  }
})();