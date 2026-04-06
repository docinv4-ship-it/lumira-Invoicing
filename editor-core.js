window.InvoiceEditorCore = (() => {
  const S = window.InvoiceEditorState;
  const U = window.InvoiceEditorUtils;
  const C = window.InvoiceEditorCalculations;
  const F = window.InvoiceEditorForm;
  const T = window.InvoiceEditorTemplate;

  let templateSelect = null;
  let formContainer = null;
  let tempRender = null;
  let downloadBtn = null;
  let downloadImageBtn = null;
  let previewBtn = null;
  let statusLine = null;

  function getCurrentConfig() {
    const tplId = parseInt(templateSelect?.value || String(S?.activeTemplateId || 1), 10) || 1;
    const config = window.templatesConfig?.[tplId] || { fields: [], itemFields: S?.DEFAULT_ITEM_FIELDS || [] };
    const template = window.templates?.[tplId] || null;
    return { tplId, config, template };
  }

  function status(message) {
    if (statusLine) statusLine.textContent = message;
  }

  function setStatus(message) {
    status(message);
  }

  function setFormMessage(message) {
    if (!formContainer) return;
    formContainer.innerHTML = `<p style="color:#b91c1c;font-weight:700">${message}</p>`;
  }

  function setPreviewHtml(html) {
    if (!tempRender) return;
    tempRender.innerHTML = html;
    tempRender.style.display = "block";
    tempRender.style.width = "100%";
    tempRender.style.maxWidth = "595px";
    tempRender.style.minHeight = "842px";
    tempRender.style.background = "#ffffff";
    tempRender.style.overflow = "visible";
    tempRender.style.visibility = "visible";
    tempRender.style.opacity = "1";
  }

  function normalizePreviewNode(root = tempRender?.firstElementChild) {
    if (!root) return;

    root.style.width = "595px";
    root.style.minHeight = "842px";
    root.style.position = "relative";
    root.style.background = "#ffffff";
    root.style.overflow = "hidden";
    root.style.boxSizing = "border-box";
    root.style.isolation = "isolate";
    root.style.margin = "0 auto";
    root.style.opacity = "1";
    root.style.visibility = "visible";
  }

  function calculateTotals() {
    C.calculateTotals();
  }

  function renderPreview() {
    T.renderPreview();
  }

  function gatherData() {
    return T.gatherData();
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function waitForTemplates(timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();

      const tick = () => {
        const ready =
          !!window.InvoiceEditorState &&
          !!window.InvoiceEditorUtils &&
          !!window.InvoiceEditorCalculations &&
          !!window.InvoiceEditorForm &&
          !!window.InvoiceEditorTemplate &&
          window.templatesConfig &&
          Object.keys(window.templatesConfig).length > 0;

        if (ready) {
          resolve(true);
          return;
        }

        if (Date.now() - start > timeoutMs) {
          reject(new Error("Templates config/modules did not load in time"));
          return;
        }

        setTimeout(tick, 50);
      };

      tick();
    });
  }

  async function waitForFontsAndPaint() {
    return U.waitForFontsAndPaint();
  }

  function escapeCssUrl(value) {
    return U.extractCssUrl(value);
  }

  async function sanitizeCloneForExport(node) {
    const clone = node.cloneNode(true);
    const allNodes = [clone, ...clone.querySelectorAll("*")];

    for (const elNode of allNodes) {
      if (!elNode || !elNode.tagName) continue;

      const tag = elNode.tagName.toLowerCase();

      if (tag === "img") {
        const src = elNode.getAttribute("src") || elNode.currentSrc || "";
        if (!src || U.isSafeUrl(src)) continue;

        try {
          const dataUrl = await U.fetchAsDataURL(src);
          elNode.setAttribute("src", dataUrl);
          elNode.setAttribute("crossorigin", "anonymous");
        } catch (_) {
          elNode.setAttribute("src", S.TRANSPARENT_PIXEL);
          elNode.style.visibility = "hidden";
          elNode.style.opacity = "0";
        }
      }

      if (tag === "image") {
        const href = elNode.getAttribute("href") || elNode.getAttribute("xlink:href") || "";
        if (!href || U.isSafeUrl(href)) continue;

        try {
          const dataUrl = await U.fetchAsDataURL(href);
          elNode.setAttribute("href", dataUrl);
          elNode.setAttribute("xlink:href", dataUrl);
        } catch (_) {
          elNode.setAttribute("href", S.TRANSPARENT_PIXEL);
          elNode.setAttribute("xlink:href", S.TRANSPARENT_PIXEL);
        }
      }

      if (elNode.style && elNode.style.backgroundImage) {
        const bgUrl = escapeCssUrl(elNode.style.backgroundImage);
        if (bgUrl && !U.isSafeUrl(bgUrl)) {
          try {
            const dataUrl = await U.fetchAsDataURL(bgUrl);
            elNode.style.backgroundImage = `url("${dataUrl}")`;
          } catch (_) {
            elNode.style.backgroundImage = "none";
          }
        }
      }
    }

    return clone;
  }

  async function svgToCanvas(svgEl, scale = 2) {
    let svgNode = svgEl;
    if (svgEl.tagName && svgEl.tagName.toLowerCase() !== "svg") {
      const childSvg = svgEl.querySelector("svg");
      if (!childSvg) throw new Error("No SVG found in export node");
      svgNode = childSvg;
    }

    const cloned = svgNode.cloneNode(true);
    cloned.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    cloned.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    const width = parseFloat(cloned.getAttribute("width")) || 595;
    const height = parseFloat(cloned.getAttribute("height")) || 842;

    const svgString = new XMLSerializer().serializeToString(cloned);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    try {
      const img = new Image();
      img.decoding = "async";
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function captureNodeToCanvas(node) {
    const html2canvasFn = window.html2canvas;
    if (typeof html2canvasFn !== "function") {
      throw new Error("html2canvas is missing");
    }

    return await html2canvasFn(node, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      foreignObjectRendering: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 595,
      windowHeight: 842
    });
  }

  function isRowBlank(imageData, width, y, threshold = 248) {
    const start = y * width * 4;

    for (let x = 0; x < width; x++) {
      const i = start + x * 4;
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];

      if (a > 0 && (r < threshold || g < threshold || b < threshold)) {
        return false;
      }
    }

    return true;
  }

  function cropCanvasToContent(canvas) {
    if (!canvas || !canvas.width || !canvas.height) return canvas;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return canvas;

    const { width, height } = canvas;
    let imageData;

    try {
      imageData = ctx.getImageData(0, 0, width, height).data;
    } catch (_) {
      return canvas;
    }

    let lastContentRow = -1;

    for (let y = height - 1; y >= 0; y--) {
      if (!isRowBlank(imageData, width, y)) {
        lastContentRow = y;
        break;
      }
    }

    if (lastContentRow < 0) return canvas;

    const cropHeight = Math.min(height, lastContentRow + 16);
    if (cropHeight >= height) return canvas;

    const trimmed = document.createElement("canvas");
    trimmed.width = width;
    trimmed.height = cropHeight;

    const tctx = trimmed.getContext("2d");
    tctx.fillStyle = "#ffffff";
    tctx.fillRect(0, 0, trimmed.width, trimmed.height);
    tctx.drawImage(canvas, 0, 0, width, cropHeight, 0, 0, width, cropHeight);

    return trimmed;
  }

  async function canvasToPagedPdf(canvas, filename) {
    const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFCtor) throw new Error("jsPDF is missing");

    const pdf = new jsPDFCtor({
      unit: "pt",
      format: "a4",
      orientation: "portrait"
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    if (!canvas || !canvas.width || !canvas.height) {
      throw new Error("Canvas is empty");
    }

    const trimmedCanvas = cropCanvasToContent(canvas);
    const finalCanvas = trimmedCanvas || canvas;

    const ratio = finalCanvas.width / pageW;
    const pageCanvasHeight = Math.floor(pageH * ratio);

    if (!Number.isFinite(ratio) || ratio <= 0) {
      throw new Error("Invalid canvas ratio");
    }

    if (finalCanvas.height <= pageCanvasHeight + 24) {
      const imgData = finalCanvas.toDataURL("image/png");
      const imgH = (finalCanvas.height * pageW) / finalCanvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH);
      pdf.save(filename);
      return;
    }

    let y = 0;
    let pageIndex = 0;

    while (y < finalCanvas.height) {
      const sliceHeight = Math.min(pageCanvasHeight, finalCanvas.height - y);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = finalCanvas.width;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(finalCanvas, 0, y, finalCanvas.width, sliceHeight, 0, 0, finalCanvas.width, sliceHeight);

      const imgData = pageCanvas.toDataURL("image/png");
      const imgH = sliceHeight / ratio;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH);

      y += sliceHeight;
      pageIndex++;
    }

    pdf.save(filename);
  }

  async function createExportStage(sourceNode) {
    const old = document.getElementById("pdf-export-stage");
    if (old) old.remove();

    const stage = document.createElement("div");
    stage.id = "pdf-export-stage";
    stage.style.position = "fixed";
    stage.style.left = "0";
    stage.style.top = "0";
    stage.style.transform = "translate(-200vw, 0)";
    stage.style.width = "595px";
    stage.style.height = "auto";
    stage.style.minHeight = "0";
    stage.style.background = "#ffffff";
    stage.style.overflow = "hidden";
    stage.style.zIndex = "-1";
    stage.style.pointerEvents = "none";
    stage.style.visibility = "visible";
    stage.style.opacity = "1";
    stage.style.display = "block";

    const clone = await sanitizeCloneForExport(sourceNode);
    stage.appendChild(clone);
    document.body.appendChild(stage);
    normalizePreviewNode(clone);

    return stage;
  }

  async function exportCanvasFromPreview() {
    await waitForFontsAndPaint();
    const previewNode = tempRender.firstElementChild || tempRender;
    if (!previewNode) throw new Error("Preview node not found");

    const stage = await createExportStage(previewNode);
    await waitForFontsAndPaint();

    const exportNode = stage.firstElementChild || stage;

    let canvas;
    if (exportNode.tagName && exportNode.tagName.toLowerCase() === "svg") {
      try {
        canvas = await svgToCanvas(exportNode, 4);
      } catch (_) {
        canvas = await captureNodeToCanvas(exportNode);
      }
    } else {
      canvas = await captureNodeToCanvas(exportNode);
    }

    return { canvas, stage };
  }

  function refreshPreviewFromState() {
    const tplId = getCurrentConfig().tplId;

    if (typeof S.requestLivePreview === "function") {
      S.requestLivePreview(tplId);
      return;
    }

    if (typeof S.saveSnapshotFromDom === "function") {
      try {
        S.saveSnapshotFromDom(tplId);
      } catch (err) {
        console.warn("Snapshot save failed:", err);
      }
    }

    calculateTotals();
    renderPreview();
  }

  const triggerLiveUpdate = (() => {
    let rafId = 0;

    return () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        refreshPreviewFromState();
      });
    };
  })();

  async function downloadPDF() {
    const { tplId, config, template } = getCurrentConfig();

    if (!template || !config) {
      alert("Template not available");
      return;
    }

    let stage = null;

    try {
      status("Preparing PDF...");

      calculateTotals();
      renderPreview();
      await waitForFontsAndPaint();

      const result = await exportCanvasFromPreview();
      stage = result.stage;

      const safeInvoiceNo = String(U.getVal("invoice_number") || Date.now()).replace(/[^\w-]+/g, "_");
      const filename = `invoice_${safeInvoiceNo}.pdf`;

      await canvasToPagedPdf(result.canvas, filename);

      status(`PDF downloaded successfully for Template ${tplId}!`);
    } catch (err) {
      console.error("PDF creation failed:", err);
      status("PDF creation failed");
      alert("PDF creation failed. Check console.");
    } finally {
      if (stage) stage.remove();
    }
  }

  async function downloadImage() {
    const { tplId, config, template } = getCurrentConfig();

    if (!template || !config) {
      alert("Template not available");
      return;
    }

    let stage = null;

    try {
      status("Preparing image...");

      calculateTotals();
      renderPreview();
      await waitForFontsAndPaint();

      const result = await exportCanvasFromPreview();
      stage = result.stage;

      if (!result.canvas || !result.canvas.width || !result.canvas.height) {
        throw new Error("Canvas creation failed");
      }

      const safeInvoiceNo = String(U.getVal("invoice_number") || Date.now()).replace(/[^\w-]+/g, "_");
      const filename = `invoice_${safeInvoiceNo}.png`;

      const link = document.createElement("a");
      link.href = result.canvas.toDataURL("image/png", 1.0);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      status(`Image downloaded successfully for Template ${tplId}!`);
    } catch (err) {
      console.error("Image export failed:", err);
      status("Image export failed");
      alert("Image export failed. Check console.");
    } finally {
      if (stage) stage.remove();
    }
  }

  function init() {
    if (!S || !U || !C || !F || !T) {
      console.error("Invoice editor modules are not ready");
      return;
    }

    templateSelect = document.getElementById("template-select");
    formContainer = document.getElementById("invoice-form");
    tempRender = document.getElementById("temp-render");
    downloadBtn = document.getElementById("download-btn");
    downloadImageBtn = document.getElementById("download-image-btn");
    previewBtn = document.getElementById("preview-btn");
    statusLine = document.getElementById("status-line");

    if (!templateSelect || !formContainer || !tempRender || !downloadBtn) {
      console.error("editor.js: required DOM nodes missing");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const templateFromUrl = parseInt(urlParams.get("template") || "", 10);
    if (templateFromUrl && [...templateSelect.options].some((opt) => parseInt(opt.value, 10) === templateFromUrl)) {
      templateSelect.value = String(templateFromUrl);
    }

    const initialTplId = parseInt(templateSelect.value || "1", 10) || 1;
    if (typeof S.setActiveTemplateId === "function") {
      S.setActiveTemplateId(initialTplId, { persist: false });
    }

    previewBtn?.addEventListener("click", () => {
      triggerLiveUpdate();
    });

    downloadBtn.addEventListener("click", downloadPDF);
    downloadImageBtn?.addEventListener("click", downloadImage);

    templateSelect.addEventListener("change", () => {
      const nextTplId = parseInt(templateSelect.value || "1", 10) || 1;
      if (typeof S.setActiveTemplateId === "function") {
        S.setActiveTemplateId(nextTplId);
      }
      F.renderForm();
      triggerLiveUpdate();
    });

    formContainer.addEventListener("input", () => {
      triggerLiveUpdate();
    }, true);

    formContainer.addEventListener("change", () => {
      triggerLiveUpdate();
    }, true);

    waitForTemplates()
      .then(() => {
        if (S.LOGO_ENABLED_TEMPLATES?.has(initialTplId)) {
          const saved = S.logoState?.dataUrlByTemplate?.get(initialTplId) || "";
          if (saved) {
            S.logoState.dataUrlByTemplate.set(initialTplId, saved);
          }
        }

        F.renderForm();
        triggerLiveUpdate();
      })
      .catch((err) => {
        console.error(err);
        formContainer.innerHTML = "<p style='color:#b91c1c;font-weight:700'>Templates config failed to load</p>";
      });

    window._invoice_editor = {
      renderForm: F.renderForm,
      renderPreview,
      calculateTotals,
      gatherData,
      downloadPDF,
      downloadImage,
      requestRefresh: triggerLiveUpdate,
      triggerLiveUpdate
    };
  }

  return {
    init,
    getCurrentConfig,
    status,
    setStatus,
    setFormMessage,
    setPreviewHtml,
    normalizePreviewNode,
    calculateTotals,
    renderPreview,
    gatherData,
    downloadPDF,
    downloadImage,
    triggerLiveUpdate,
    fileToDataUrl,
    waitForTemplates,
    waitForFontsAndPaint
  };
})();