window.InvoiceEditorUtils = (() => {
  function debounce(fn, wait = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  function el(tag, attrs = {}, html = "") {
    const node = document.createElement(tag);
    for (const key in attrs) node.setAttribute(key, attrs[key]);
    if (html) node.innerHTML = html;
    return node;
  }

  function getVal(id) {
    const node = document.getElementById(id);
    return node ? String(node.value ?? "").trim() : "";
  }

  function setVal(id, value) {
    const node = document.getElementById(id);
    if (node) node.value = value;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeXml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function safeText(value, fallback = "—") {
    const text = String(value ?? "").trim();
    return text ? text : fallback;
  }

  function formatMoney(value, currency) {
    const num = Number(value) || 0;
    const amount = num.toFixed(2);
    return currency ? `${currency} ${amount}` : amount;
  }

  function wrapText(text, maxChars = 34, maxLines = 4) {
    const raw = String(text || "").trim();
    if (!raw) return [""];

    const words = raw.split(/\s+/);
    const lines = [];
    let current = "";

    for (const word of words) {
      if (!current) {
        if (word.length > maxChars) {
          const chunks = word.match(new RegExp(`.{1,${maxChars}}`, "g")) || [word];
          for (const chunk of chunks) {
            if (lines.length >= maxLines) break;
            lines.push(chunk);
          }
          current = "";
        } else {
          current = word;
        }
        continue;
      }

      const next = `${current} ${word}`;
      if (next.length <= maxChars) {
        current = next;
      } else {
        lines.push(current);
        if (lines.length >= maxLines) return lines;
        current = word.length > maxChars ? word.slice(0, maxChars) : word;
      }
    }

    if (current && lines.length < maxLines) lines.push(current);
    if (lines.length > maxLines) lines.length = maxLines;
    return lines;
  }

  function nextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function waitForFontsAndPaint() {
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch (_) {}
    await nextPaint();
  }

  function resolveUrl(raw) {
    try {
      return new URL(raw, window.location.href).href;
    } catch (_) {
      return "";
    }
  }

  function isSafeUrl(raw) {
    const href = resolveUrl(raw);
    if (!href) return false;
    try {
      const url = new URL(href);
      return href.startsWith("data:") || href.startsWith("blob:") || url.origin === window.location.origin;
    } catch {
      return href.startsWith("data:") || href.startsWith("blob:");
    }
  }

  function extractCssUrl(value) {
    const match = /url\((['"]?)(.*?)\1\)/i.exec(value || "");
    return match ? match[2] : "";
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Failed to read blob"));
      reader.readAsDataURL(blob);
    });
  }

  async function fetchAsDataURL(url) {
    const abs = resolveUrl(url);
    if (!abs) throw new Error("Invalid asset url");

    const res = await fetch(abs, {
      mode: "cors",
      credentials: "omit"
    });

    if (!res.ok) {
      throw new Error(`Asset fetch failed: ${res.status}`);
    }

    const blob = await res.blob();
    return await blobToDataURL(blob);
  }

  // ✅ ✅ ADD THIS (missing function fix)
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");

      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Failed to convert file"));

      reader.readAsDataURL(file);
    });
  }

  function isRequiredField(fieldId) {
    return window.InvoiceEditorState.REQUIRED_FIELD_IDS.has(fieldId);
  }

  return {
    debounce,
    el,
    getVal,
    setVal,
    escapeHtml,
    escapeXml,
    safeText,
    formatMoney,
    wrapText,
    nextPaint,
    waitForFontsAndPaint,
    resolveUrl,
    isSafeUrl,
    extractCssUrl,
    blobToDataURL,
    fetchAsDataURL,
    fileToDataUrl, // ✅ exported
    isRequiredField
  };
})();
