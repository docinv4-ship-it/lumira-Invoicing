document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('templateGrid');
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const countValue = document.getElementById('countValue');
  const year = document.getElementById('year');

  if (!grid || !searchInput || !filterSelect || !countValue) {
    console.error('gallery.js: required DOM elements are missing');
    return;
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const templates = [
    {
      id: 1,
      name: 'Executive Blue',
      category: 'business',
      badge: 'Popular',
      image: 'assets/templates/template-1.png',
      description: 'Strong business look with a clean structure and premium invoice feel.',
      tags: ['Business', 'Premium', 'Client-ready']
    },
    {
      id: 2,
      name: 'Minimal Pro',
      category: 'minimal',
      badge: 'Simple',
      image: 'assets/templates/template-2.png',
      description: 'A calm minimal layout for quick billing and focused presentation.',
      tags: ['Minimal', 'Clean', 'Simple']
    },
    {
      id: 3,
      name: 'Modern Slate',
      category: 'business',
      badge: 'New',
      image: 'assets/templates/template-3.png',
      description: 'Sharp headings and balanced spacing for a professional client workflow.',
      tags: ['Modern', 'Business', 'Sharp']
    },
    {
      id: 4,
      name: 'Creative Accent',
      category: 'creative',
      badge: 'Bold',
      image: 'assets/templates/template-4.png',
      description: 'A more expressive invoice style with a polished creative feel.',
      tags: ['Creative', 'Bold', 'Fresh']
    },
    {
      id: 5,
      name: 'Dark Premium',
      category: 'dark',
      badge: 'Premium',
      image: 'assets/templates/template-5.png',
      description: 'Dark theme with a rich visual style for a premium SaaS impression.',
      tags: ['Dark', 'Luxury', 'Premium']
    },
    {
      id: 6,
      name: 'Soft Gray',
      category: 'minimal',
      badge: 'Clean',
      image: 'assets/templates/template-6.png',
      description: 'Soft tones and an airy layout for simple daily invoicing.',
      tags: ['Minimal', 'Soft', 'Fresh']
    },
    {
      id: 7,
      name: 'Agency Flow',
      category: 'business',
      badge: 'Agency',
      image: 'assets/templates/template-7.png',
      description: 'Great for agencies that want a structured and easy-to-scan invoice.',
      tags: ['Agency', 'Business', 'Structured']
    },
    {
      id: 8,
      name: 'Compact Invoice',
      category: 'minimal',
      badge: 'Compact',
      image: 'assets/templates/template-8.png',
      description: 'Compact design optimized for speed without losing the premium look.',
      tags: ['Compact', 'Fast', 'Minimal']
    },
    {
      id: 9,
      name: 'Royal Gradient',
      category: 'creative',
      badge: 'Stylish',
      image: 'assets/templates/template-9.png',
      description: 'Stylish gradient feel that makes the template stand out visually.',
      tags: ['Creative', 'Gradient', 'Stylish']
    },
    {
      id: 10,
      name: 'Charcoal Edge',
      category: 'dark',
      badge: 'Sleek',
      image: 'assets/templates/template-10.png',
      description: 'Dark professional invoice with a sharper visual identity.',
      tags: ['Dark', 'Sleek', 'Professional']
    },
    {
      id: 11,
      name: 'Fintech Clean',
      category: 'business',
      badge: 'Latest',
      image: 'assets/templates/template-11.png',
      description: 'A crisp modern invoice layout inspired by fintech-style products.',
      tags: ['Business', 'Fintech', 'Clean']
    }
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[match]));

  function openTemplate(id) {
    window.location.href = `editor.html?template=${id}`;
  }

  function buildFallbackSvg(template) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="950" viewBox="0 0 1200 950">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#111827" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#60a5fa" />
            <stop offset="100%" stop-color="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="1200" height="950" fill="url(#g)"/>
        <rect x="70" y="70" width="1060" height="810" rx="40" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/>
        <rect x="110" y="120" width="280" height="26" rx="13" fill="url(#g2)" opacity="0.9"/>
        <text x="110" y="220" fill="#e5eefc" font-family="Arial" font-size="54" font-weight="700">${escapeHtml(template.name)}</text>
        <text x="110" y="280" fill="#a6b3cb" font-family="Arial" font-size="28">Preview image missing</text>
        <rect x="110" y="360" width="360" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
        <rect x="110" y="396" width="500" height="16" rx="8" fill="rgba(255,255,255,0.10)"/>
        <rect x="110" y="432" width="440" height="16" rx="8" fill="rgba(255,255,255,0.10)"/>
        <rect x="110" y="680" width="220" height="54" rx="18" fill="url(#g2)" opacity="0.95"/>
        <text x="130" y="715" fill="#ffffff" font-family="Arial" font-size="24" font-weight="700">Use Template</text>
      </svg>
    `)}`;
  }

  function createCard(template) {
    const article = document.createElement('article');
    article.className = 'template-card';
    article.innerHTML = `
      <div class="template-preview">
        <div class="template-badge">${escapeHtml(template.badge)}</div>
        <img src="${escapeHtml(template.image)}" alt="${escapeHtml(template.name)} preview" loading="lazy" />
      </div>
      <div class="template-body">
        <div class="template-title-row">
          <div>
            <h3>${escapeHtml(template.name)}</h3>
            <span>Template #${template.id}</span>
          </div>
          <span>${escapeHtml(template.category)}</span>
        </div>
        <p>${escapeHtml(template.description)}</p>
        <div class="template-tags">
          ${template.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="template-actions">
          <button class="btn btn-secondary" type="button" data-action="preview">Preview</button>
          <button class="btn btn-primary" type="button" data-action="use">Use Template</button>
        </div>
      </div>
    `;

    const img = article.querySelector('img');
    img.addEventListener('error', () => {
      img.onerror = null;
      img.src = buildFallbackSvg(template);
    });

    article.querySelector('[data-action="preview"]').addEventListener('click', () => openTemplate(template.id));
    article.querySelector('[data-action="use"]').addEventListener('click', () => openTemplate(template.id));
    article.addEventListener('dblclick', () => openTemplate(template.id));

    return article;
  }

  function renderGallery() {
    const query = searchInput.value.trim().toLowerCase();
    const category = filterSelect.value;

    const filtered = templates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description} ${template.tags.join(' ')}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = category === 'all' || template.category === category;
      return matchesQuery && matchesCategory;
    });

    grid.innerHTML = '';

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,0.10); border-radius: 24px; background: rgba(255,255,255,0.05); color: #a6b3cb;">
          No templates found. Try a different search or category.
        </div>
      `;
      countValue.textContent = '0';
      return;
    }

    filtered.forEach((template) => grid.appendChild(createCard(template)));
    countValue.textContent = String(filtered.length);
  }

  searchInput.addEventListener('input', renderGallery);
  filterSelect.addEventListener('change', renderGallery);

  renderGallery();
});