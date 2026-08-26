/**
 * MAIN APPLICATION LOGIC & DYNAMIC RENDERING ENGINE
 * Universal Profile & Portfolio — Fully Dynamic Platform
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Management
  initTheme();

  // 2. Navigation & Mobile Menu Setup
  initNavigation();

  // 3. Initial Dynamic Rendering of All Components
  renderAllComponents();

  // 4. Interactive Filters & Search
  initSkillFilters();
  initProjectFilters();

  // 5. Contact Form Validation
  initContactForm();

  // 6. Scroll Reveal Observer & Back to Top
  initScrollEffects();
});

// XSS Protection & HTML Sanitization Helper for Secure Dynamic System
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  if (typeof str !== "string") return String(str);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
window.escapeHTML = escapeHTML;
window.escapeHtml = escapeHTML;

// Helper to retrieve active state data (from CMS or portfolioData default)
function getActiveData() {
  let data = null;
  if (window.CMS && window.CMS.data) {
    data = window.CMS.data;
  } else {
    const saved = localStorage.getItem("cms_portfolio_data");
    if (saved) {
      try { data = JSON.parse(saved); } catch (e) {}
    }
  }
  if (!data) {
    data = typeof portfolioData !== "undefined" ? portfolioData : {};
  }

  // Ensure official contact values are always guaranteed
  if (!data.personal) data.personal = {};
  if (!data.personal.phone || data.personal.phone.includes("9800000000")) {
    data.personal.phone = "+9779740832433";
  }
  if (!data.personal.whatsapp || data.personal.whatsapp.includes("9800000000")) {
    data.personal.whatsapp = "+9779740832433";
  }

  return data;
}
window.getActiveData = getActiveData;

// Master Render All Components
window.renderAllComponents = function() {
  renderNavigation();
  renderHeroBanner();
  renderStats();
  renderVideos();
  renderWhatIBuild();
  renderAbout();
  renderExperience();
  renderTeaching();
  renderSkills();
  renderProjects();
  renderArticles();
  renderEducation();
  renderContact();
  renderFooter();

  if (window.CMS && window.CMS.renderActiveVisibility) {
    window.CMS.renderActiveVisibility();
  }

  // Re-bind interactive animation effects
  if (typeof initCardSpotlights === "function") initCardSpotlights();
  if (typeof initCard3DTilt === "function") initCard3DTilt();
  if (typeof initAnimatedCounters === "function") initAnimatedCounters();
  if (typeof initCyberTextScramble === "function") initCyberTextScramble();
  if (typeof initTimelineSignalEffect === "function") initTimelineSignalEffect();
};

/* ==========================================================================
   1. THEME MANAGEMENT (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const storedTheme = localStorage.getItem("theme");
  
  const initialTheme = storedTheme || "light";
  document.documentElement.setAttribute("data-theme", initialTheme);
  updateThemeIcon(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} Mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById("theme-icon");
  if (!iconContainer) return;
  
  if (theme === "light") {
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
}

/* ==========================================================================
   2. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightActiveNav();
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-active");
    });
  }

  function highlightActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }
}

// 🧭 Dynamically Render Navigation Bar & Brand Identity
function renderNavigation() {
  const data = getActiveData();
  const navConfig = data.navigation || {};
  const personal = data.personal || {};
  const hero = data.heroBanner || {};
  const visibility = data.sectionVisibility || {};

  // 1. Dynamic Brand Logo & Initials
  const brandSymbolEl = document.getElementById("brand-symbol");
  if (brandSymbolEl) {
    brandSymbolEl.textContent = navConfig.brandInitials || personal.brandInitials || "AD";
  }

  const brandNameEl = document.getElementById("brand-name-display");
  if (brandNameEl) {
    const rawName = navConfig.brandName || hero.name || personal.name || "Alexi Dhungel, Er.";
    if (rawName.includes(", Er.")) {
      brandNameEl.innerHTML = `${escapeHTML(rawName.replace(", Er.", ""))} <span style="font-size: 0.85rem; color: var(--brand-cyan-light);">Er.</span>`;
    } else {
      brandNameEl.textContent = rawName;
    }
  }

  const brandTitleEl = document.getElementById("brand-title-display");
  if (brandTitleEl) {
    brandTitleEl.textContent = navConfig.brandTitle || hero.brandName || personal.brandName || "Code With Alexi";
  }

  // 2. Dynamic Nav Links (Filtered by Section Visibility)
  const navContainer = document.getElementById("nav-links");
  if (!navContainer) return;

  const defaultNavLinks = [
    { id: "nav-about", label: "About", href: "#about", sectionKey: "about", active: true },
    { id: "nav-videos", label: "Videos & Media", href: "#videos", sectionKey: "videos", active: true },
    { id: "nav-whatibuild", label: "What I Build", href: "#expertise", sectionKey: "whatIBuild", active: true },
    { id: "nav-experience", label: "Experience", href: "#experience", sectionKey: "experience", active: true },
    { id: "nav-teaching", label: "Teaching", href: "#teaching", sectionKey: "teaching", active: true },
    { id: "nav-skills", label: "Skills", href: "#skills", sectionKey: "skills", active: true },
    { id: "nav-projects", label: "Solutions & Tech", href: "#projects", sectionKey: "projects", active: true },
    { id: "nav-articles", label: "Knowledge Hub", href: "#articles", sectionKey: "articles", active: true },
    { id: "nav-education", label: "Qualifications", href: "#education", sectionKey: "education", active: true },
    { id: "nav-contact", label: "Contact", href: "#contact", sectionKey: "contact", active: true }
  ];

  const linksToProcess = (navConfig.navLinks && navConfig.navLinks.length > 0) ? navConfig.navLinks : defaultNavLinks;

  // Filter out any link whose sectionKey is explicitly false in visibility
  const activeLinks = linksToProcess.filter(link => {
    if (link.active === false) return false;
    if (link.sectionKey && visibility[link.sectionKey] === false) return false;
    return true;
  });

  navContainer.innerHTML = activeLinks.map(link => `
    <a href="${escapeHTML(link.href)}" class="nav-link" data-section="${escapeHTML(link.sectionKey || '')}">${escapeHTML(link.label)}</a>
  `).join("");

  // Re-bind click event for mobile navigation
  navContainer.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navContainer.classList.remove("mobile-active");
    });
  });
}

/* ==========================================================================
   3. DYNAMIC RENDERING HELPERS & ICONS
   ========================================================================== */

function getIconSvg(iconName) {
  const icons = {
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z"/></svg>`,
    graduation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    landmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 3L2 10h20L12 3z"/><line x1="6" y1="10" x2="6" y2="21"/><line x1="10" y1="10" x2="10" y2="21"/><line x1="14" y1="10" x2="14" y2="21"/><line x1="18" y1="10" x2="18" y2="21"/></svg>`,
    network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><line x1="5" y1="8" x2="5" y2="12"/><line x1="5" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="19" y2="12"/><line x1="19" y1="12" x2="19" y2="16"/></svg>`,
    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    "book-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 1 3-3h7z"/></svg>`,
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    "qr-code": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    "check-circle": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    "git-branch": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    layout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
  };
  return icons[iconName] || icons.code;
}

// 🏠 Render Hero Banner Elements Dynamically
function renderHeroBanner() {
  const data = getActiveData();
  const hero = data.heroBanner || (typeof portfolioData !== "undefined" ? portfolioData.heroBanner : {});
  if (!hero) return;

  // 1. Banner background image
  const bgEl = document.getElementById("hero-banner-bg");
  if (bgEl && hero.coverImage) {
    bgEl.style.backgroundImage = `url('${hero.coverImage}')`;
  }

  // 2. Badges & Titles
  const badgeEl = document.querySelector(".engineer-badge span:nth-child(2)");
  if (badgeEl && hero.badgeText) badgeEl.textContent = hero.badgeText;

  const brandBadgeEl = document.querySelector(".brand-tag-badge span");
  if (brandBadgeEl && hero.brandBadge) brandBadgeEl.textContent = hero.brandBadge;

  const titleEl = document.querySelector(".hero-title");
  if (titleEl && hero.name) {
    if (hero.name.includes(", Er.")) {
      titleEl.innerHTML = `${escapeHTML(hero.name.replace(", Er.", ""))} <span class="text-gradient">, Er.</span>`;
    } else {
      titleEl.innerHTML = `${escapeHTML(hero.name)}`;
    }
  }

  const subtitleEl = document.querySelector(".hero-subtitle-role");
  if (subtitleEl && hero.titles) {
    subtitleEl.innerHTML = hero.titles.map((t, idx) => `
      <span>${escapeHTML(t)}</span>
      ${idx < hero.titles.length - 1 ? '<span class="role-divider">•</span>' : ''}
    `).join("");
  }

  const descEl = document.querySelector(".hero-desc");
  if (descEl && hero.bioShort) descEl.textContent = hero.bioShort;

  // 3. CTA Buttons
  const ctaBtn = document.getElementById("hero-cta-primary-btn");
  if (ctaBtn) {
    if (hero.ctaPrimaryText) {
      ctaBtn.querySelector("span").textContent = hero.ctaPrimaryText;
    }
    if (hero.ctaPrimaryLink) {
      ctaBtn.href = hero.ctaPrimaryLink;
    }
  }

  // 4. Avatar Photo & Badge
  const avatarEl = document.querySelector(".avatar-photo");
  if (avatarEl && hero.avatarPhoto) avatarEl.src = hero.avatarPhoto;

  const avatarNameEl = document.querySelector(".avatar-info-header h3");
  if (avatarNameEl && hero.name) avatarNameEl.textContent = hero.name;

  const avatarRoleEl = document.querySelector(".avatar-info-header p");
  if (avatarRoleEl && hero.titles && hero.titles.length > 0) {
    avatarRoleEl.textContent = hero.titles[0];
  }

  const avatarBadgeTextEl = document.getElementById("hero-avatar-badge-text");
  if (avatarBadgeTextEl) {
    avatarBadgeTextEl.textContent = hero.avatarBadge || "Senior Engineer";
  }

  // 5. Dynamic Floating Tech Nodes
  const techNodesContainer = document.getElementById("hero-tech-nodes");
  if (techNodesContainer) {
    const techList = hero.floatingTech || ["Java", ".NET / C#", "REST APIs", "SQL Server", "Banking Switches"];
    techNodesContainer.innerHTML = techList.map(item => `
      <span class="tech-node-pill">${escapeHTML(item)}</span>
    `).join("");
  }
}

// 📊 Render Key Stats Ribbon Dynamically
function renderStats() {
  const container = document.getElementById("stats-grid-container");
  if (!container) return;

  const data = getActiveData();
  const stats = (data.stats || []).filter(s => s.active !== false);

  if (stats.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 1rem;">
        <p>No active stats configured.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = stats.map(stat => `
    <div class="stat-card reveal active">
      <div class="stat-icon-wrapper">
        ${getIconSvg(stat.icon || "code")}
      </div>
      <div>
        <div class="stat-value">${escapeHTML(stat.value)}</div>
        <div class="stat-label">${escapeHTML(stat.label)}</div>
      </div>
    </div>
  `).join("");
}

// 👤 Render About Me Section Dynamically
function renderAbout() {
  const container = document.getElementById("about-content-container");
  if (!container) return;

  const data = getActiveData();
  const about = data.about || {};
  const personal = data.personal || {};
  const hero = data.heroBanner || {};

  const tag = about.tag || "Background & Philosophy";
  const title = about.title || "Senior Engineering with Financial Depth";
  const photo = about.photo || hero.avatarPhoto || "assets/images/alexi-dhungel.jpg";

  let paragraphs = about.paragraphs;
  if (!paragraphs || paragraphs.length === 0) {
    paragraphs = [
      personal.bioLong || hero.bioLong || "Building reliable software, digital banking solutions, APIs, integrations and practical technology knowledge."
    ];
  }

  const specs = about.specs || [
    { label: "Education", value: "B.E. Computer • MBA" },
    { label: "Experience", value: "8+ Years Enterprise" },
    { label: "Licensure", value: "NEC Registered (Er.)" },
    { label: "Focus", value: "FinTech & Banking Rails" }
  ];

  container.innerHTML = `
    <div class="about-grid">
      <div class="about-text-content reveal active">
        <span class="section-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${escapeHTML(tag)}
        </span>
        <h2 class="section-title">${escapeHTML(title)}</h2>
        ${paragraphs.map(p => `<p>${p}</p>`).join("")}
      </div>

      <div class="about-profile-card-wrapper reveal active reveal-delay-2">
        <div class="about-profile-card">
          <div class="about-photo-wrapper">
            <img src="${escapeHTML(photo)}" alt="${escapeHTML(personal.name || hero.name || 'Profile')}" class="about-profile-img" loading="lazy" />
          </div>
          <div class="about-card-details">
            <div class="about-spec-row">
              ${specs.map(s => `
                <div class="spec-item">
                  <span class="spec-label">${escapeHTML(s.label)}</span>
                  <span class="spec-val">${escapeHTML(s.value)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 🎬 Render YouTube & Video Showcase
function renderVideos() {
  const container = document.getElementById("videos-grid-container");
  if (!container) return;

  const data = getActiveData();
  const videos = (data.youtubeVideos || []).filter(v => v.active !== false);

  if (videos.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No active videos configured.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = videos.map(vid => {
    const thumb = vid.customThumbnail || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`;
    return `
      <div class="video-card reveal active">
        <div class="video-card-thumb-wrapper" onclick="openVideoModal('${vid.youtubeId}', '${escapeHtml(vid.title)}')">
          <img src="${thumb}" class="video-card-thumb" alt="${escapeHtml(vid.title)}" loading="lazy" />
          <div class="video-play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        <div class="video-card-body">
          <span class="video-card-category">${escapeHtml(vid.category || "Featured Video")}</span>
          <h3 class="video-card-title">${escapeHtml(vid.title)}</h3>
          <p class="video-card-desc">${escapeHtml(vid.description)}</p>
          <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="openVideoModal('${vid.youtubeId}', '${escapeHtml(vid.title)}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Watch Video</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Play YouTube Video in Modal
window.openVideoModal = function(youtubeId, title) {
  const modal = document.getElementById("youtube-player-modal");
  const modalTitle = document.getElementById("youtube-modal-title");
  const iframeContainer = document.getElementById("youtube-iframe-container");

  if (!modal || !iframeContainer) return;

  modalTitle.textContent = title || "Video Player";
  iframeContainer.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
      title="${escapeHtml(title)}" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeVideoModal = function() {
  const modal = document.getElementById("youtube-player-modal");
  const iframeContainer = document.getElementById("youtube-iframe-container");

  if (modal) modal.classList.remove("active");
  if (iframeContainer) iframeContainer.innerHTML = "";
  document.body.style.overflow = "";
};

// 🏗️ Render "What I Build" Services
function renderWhatIBuild() {
  const container = document.getElementById("what-i-build-container");
  if (!container) return;

  const data = getActiveData();
  const items = (data.whatIBuild || []).filter(i => i.active !== false);

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No items configured.</div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="expertise-card reveal active reveal-delay-${(index % 3) + 1}">
      <div class="expertise-icon-box">
        ${getIconSvg(item.icon)}
      </div>
      <h3 class="expertise-title">${escapeHtml(item.title)}</h3>
      <p class="expertise-desc">${escapeHtml(item.description)}</p>
      <div class="expertise-tags">
        ${(item.tags || []).map(t => `<span class="mini-tag">${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

// 💼 Render Experience Timeline
function renderExperience() {
  const container = document.getElementById("experience-timeline-container");
  if (!container) return;

  const data = getActiveData();
  const items = (data.experience || []).filter(e => e.active !== false);

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:2rem;">No experience entries active.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="timeline-line"></div>
    ${items.map((exp, index) => `
      <div class="timeline-item reveal active reveal-delay-${(index % 3) + 1}">
        <div class="timeline-node">
          <span class="timeline-node-inner"></span>
        </div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div class="timeline-role-info">
              <div class="timeline-badges-row">
                <span class="timeline-domain-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  ${escapeHtml(exp.domain || "Enterprise Systems")}
                </span>
                ${exp.type ? `<span class="timeline-type-badge">${escapeHtml(exp.type)}</span>` : ''}
              </div>
              <h3 class="timeline-role-title">${escapeHtml(exp.role)}</h3>
            </div>
            
            <div class="timeline-meta-group">
              <div class="timeline-period">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${escapeHtml(exp.period)}
              </div>
              ${exp.location ? `
                <div class="timeline-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${escapeHtml(exp.location)}
                </div>
              ` : ''}
            </div>
          </div>

          ${exp.summary ? `
            <div class="timeline-summary">
              <p>${escapeHtml(exp.summary)}</p>
            </div>
          ` : ''}

          ${exp.metrics && exp.metrics.length > 0 ? `
            <div class="timeline-metrics-grid">
              ${exp.metrics.map(m => `
                <div class="timeline-metric-item">
                  <span class="metric-val">${escapeHtml(m.value)}</span>
                  <span class="metric-lbl">${escapeHtml(m.label)}</span>
                </div>
              `).join("")}
            </div>
          ` : ''}

          ${exp.highlights && exp.highlights.length > 0 ? `
            <div class="timeline-highlights">
              <h4 class="timeline-highlights-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Key Deliverables & Architectural Solutions
              </h4>
              <div class="deliverables-grid">
                ${exp.highlights.map(h => typeof h === 'object' ? `
                  <div class="deliverable-card">
                    <div class="deliverable-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div class="deliverable-body">
                      <strong>${escapeHtml(h.title)}:</strong>
                      <span>${escapeHtml(h.desc)}</span>
                    </div>
                  </div>
                ` : `
                  <div class="deliverable-card">
                    <div class="deliverable-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div class="deliverable-body">
                      <span>${escapeHtml(h)}</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}

          ${exp.technologies && exp.technologies.length > 0 ? `
            <div class="timeline-footer">
              <div class="timeline-tech-stack">
                <span class="tech-stack-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Core Technologies:
                </span>
                <div class="tech-tags-list">
                  ${exp.technologies.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `).join("")}
  `;
}

// 📚 Render Teaching Experience
function renderTeaching() {
  const container = document.getElementById("teaching-grid-container");
  if (!container) return;

  const data = getActiveData();
  const items = (data.teaching || []).filter(t => t.active !== false);

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No teaching modules configured.</div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="teaching-card reveal active reveal-delay-${index + 1}">
      <span class="teaching-badge">${escapeHtml(item.badge)}</span>
      <h3 class="teaching-institution">${escapeHtml(item.expertise)}</h3>
      <div class="teaching-subject">${escapeHtml(item.subject)}</div>
      <div style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 1.25rem;">
        Domain: ${escapeHtml(item.period)}
      </div>
      <div class="teaching-topics">
        <h5>Instructional Focus & Topics</h5>
        <div class="topics-list">
          ${(item.topics || []).map(t => `<span class="topic-chip">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

// 🛠️ Render Skills Matrix
function renderSkills(filteredSkills = null) {
  const container = document.getElementById("skills-grid-container");
  if (!container) return;

  const data = getActiveData();
  const allActive = (data.skills || []).filter(s => s.active !== false);
  const dataToRender = filteredSkills || allActive;

  if (dataToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>No matching technologies found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = dataToRender.map(skill => `
    <div class="skill-card reveal active">
      <div class="skill-icon">
        ${getIconSvg(skill.icon)}
      </div>
      <div class="skill-info">
        <span class="skill-name">${escapeHtml(skill.name)}</span>
        <span class="skill-category-label">${escapeHtml(skill.level)}</span>
      </div>
    </div>
  `).join("");
}

// 📁 Render Solutions & Tech Stack (Portfolio Projects)
function renderProjects(category = "all") {
  const container = document.getElementById("projects-grid-container");
  if (!container) return;

  const data = getActiveData();
  const allActive = (data.projects || []).filter(p => p.active !== false);

  const filtered = category === "all" 
    ? allActive 
    : allActive.filter(p => p.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No projects in this domain.</div>`;
    return;
  }

  container.innerHTML = filtered.map((proj, index) => `
    <div class="project-card reveal active reveal-delay-${(index % 2) + 1}">
      <div class="project-card-header">
        <span class="project-domain-badge">${escapeHtml(proj.domain)}</span>
        <div class="project-icon-indicator">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
      </div>

      <h3 class="project-title">${escapeHtml(proj.title)}</h3>
      <p class="project-desc">${escapeHtml(proj.shortDesc)}</p>

      <div style="margin-top: auto; margin-bottom: 1.25rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Specified Tech Stack:
        </div>
        <div class="project-tech-tags" style="margin-top: 0; margin-bottom: 0;">
          ${(proj.technologies || []).map(t => `<span class="project-tech-pill">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>

      <div class="project-actions">
        <button class="btn btn-secondary btn-sm" onclick="ModalController.showProjectDetails('${proj.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          View Architecture & Tech Specs
        </button>
      </div>
    </div>
  `).join("");
}

// ✍️ Render Dynamic Articles / Blog
function renderArticles() {
  const container = document.getElementById("articles-grid-container");
  if (!container) return;

  const data = getActiveData();
  const articles = (data.articles || []).filter(a => a.active !== false);

  if (articles.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No published articles yet.</div>`;
    return;
  }

  container.innerHTML = articles.map((art, index) => `
    <div class="article-card reveal active reveal-delay-${(index % 3) + 1}">
      <div class="article-meta">
        <span class="article-category">${escapeHtml(art.category)}</span>
        <span class="article-read-time">${escapeHtml(art.readTime)}</span>
      </div>
      <h3 class="article-title">${escapeHtml(art.title)}</h3>
      <p class="article-summary">${escapeHtml(art.summary)}</p>
      <div class="article-footer">
        <span class="article-read-link" onclick="ModalController.showArticle('${art.id}')">
          Read Deep-Dive
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </div>
  `).join("");
}

// 🎓 Render Education & Qualifications
function renderEducation() {
  const container = document.getElementById("education-grid-container");
  if (!container) return;

  const data = getActiveData();
  const items = (data.education || []).filter(e => e.active !== false);

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No credentials listed.</div>`;
    return;
  }

  container.innerHTML = items.map((edu, index) => `
    <div class="education-card reveal active reveal-delay-${index + 1}">
      <span class="education-badge">${escapeHtml(edu.badge)}</span>
      <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
      <div class="education-institution">${escapeHtml(edu.field)}</div>
      <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
        ${escapeHtml(edu.period)}
      </div>
      <div class="education-spec">${escapeHtml(edu.description)}</div>
    </div>
  `).join("");
}

// 🌐 Render Contact Channels Panel Dynamically
function renderContact() {
  const container = document.getElementById("contact-info-container");
  if (!container) return;

  const data = getActiveData();
  const personal = data.personal || {};

  const email = personal.email || "ingr.alexi@gmail.com";
  const rawPhone = personal.phone || "+9779740832433";
  const phone = (rawPhone && !rawPhone.includes("9800000000")) ? rawPhone : "+9779740832433";
  const rawWhatsapp = personal.whatsapp || "+9779740832433";
  const whatsapp = (rawWhatsapp && !rawWhatsapp.includes("9800000000")) ? rawWhatsapp : "+9779740832433";
  const linkedin = personal.linkedin || "https://www.linkedin.com/in/alexi-dhungel-01b65b146/";
  const github = personal.github || "https://github.com/alexidhungel";
  const youtube = personal.youtube || "";
  const location = personal.location || "Kathmandu, Nepal";

  const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
  const cleanWhatsappDigits = whatsapp.replace(/[^0-9]/g, '');

  container.innerHTML = `
    <div class="contact-card-box">
      <h3 style="font-size: 1.35rem; margin-bottom: 1.6rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
        <span class="status-live-dot"></span> Official Contact Channels
      </h3>
      
      <div class="contact-method-item">
        <div class="contact-icon-box" style="color: var(--brand-cyan);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="contact-method-text">
          <h4>Phone / Mobile</h4>
          <a href="tel:+${escapeHTML(cleanPhoneDigits)}" style="font-family: var(--font-mono); font-weight: 700;">+977 9740832433</a>
        </div>
      </div>

      <div class="contact-method-item">
        <div class="contact-icon-box" style="background: rgba(37, 211, 102, 0.15); border-color: rgba(37, 211, 102, 0.4); color: #25D366; box-shadow: 0 0 16px rgba(37, 211, 102, 0.25);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>
        <div class="contact-method-text">
          <h4 style="color: #34D399;">WhatsApp Instant Chat</h4>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <a href="https://wa.me/${escapeHTML(cleanWhatsappDigits)}" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-weight: 700; color: #25D366;">+977 9740832433</a>
            <a href="https://wa.me/${escapeHTML(cleanWhatsappDigits)}" target="_blank" rel="noopener" class="mini-tag" style="background: rgba(37, 211, 102, 0.18); border-color: rgba(37, 211, 102, 0.4); color: #25D366; cursor: pointer;">⚡ Open WhatsApp</a>
          </div>
        </div>
      </div>

      ${email ? `
        <div class="contact-method-item">
          <div class="contact-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div class="contact-method-text">
            <h4>Direct Email</h4>
            <a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a>
          </div>
        </div>
      ` : ''}

      ${linkedin ? `
        <div class="contact-method-item">
          <div class="contact-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </div>
          <div class="contact-method-text">
            <h4>LinkedIn Profile</h4>
            <a href="${escapeHTML(linkedin)}" target="_blank" rel="noopener">${escapeHTML(linkedin.replace('https://www.linkedin.com/in/', 'linkedin.com/in/'))}</a>
          </div>
        </div>
      ` : ''}

      ${github ? `
        <div class="contact-method-item">
          <div class="contact-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </div>
          <div class="contact-method-text">
            <h4>GitHub Profile</h4>
            <a href="${escapeHTML(github)}" target="_blank" rel="noopener">${escapeHTML(github.replace('https://github.com/', 'github.com/'))}</a>
          </div>
        </div>
      ` : ''}

      ${location ? `
        <div class="contact-method-item">
          <div class="contact-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="contact-method-text">
            <h4>Primary Location</h4>
            <span style="font-weight:600;color:var(--text-primary);">${escapeHTML(location)}</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// 📄 Render Dynamic Footer
function renderFooter() {
  const data = getActiveData();
  const footerData = data.footer || {};
  const personal = data.personal || {};

  const copyrightEl = document.getElementById("footer-copyright");
  if (copyrightEl) {
    const rawCopyright = footerData.copyright || `© 2026 ${personal.name || 'Alexi Dhungel, Er.'} • Universal Dynamic Content Management Platform`;
    copyrightEl.innerHTML = escapeHTML(rawCopyright);
  }
}

/* ==========================================================================
   4. INTERACTIVE FILTERS & SEARCH
   ========================================================================== */
function initSkillFilters() {
  const searchInput = document.getElementById("skills-search-input");
  const categoryTabs = document.querySelectorAll(".skills-category-tabs .category-tab");

  let activeCategory = "all";
  let searchQuery = "";

  function filterData() {
    const data = getActiveData();
    let result = (data.skills || []).filter(s => s.active !== false);

    if (activeCategory !== "all") {
      result = result.filter(s => s.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.level.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    renderSkills(result);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      filterData();
    });
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.getAttribute("data-category");
      filterData();
    });
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".project-filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");
      renderProjects(category);
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM VALIDATION & DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    let isValid = true;
    form.querySelectorAll(".form-group").forEach(fg => fg.classList.remove("error"));

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, "Please enter your full name.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput, "Please enter a subject.");
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, "Message must be at least 10 characters long.");
      isValid = false;
    }

    if (!isValid) return;

    const data = getActiveData();
    const destinationEmail = (data.personal && data.personal.email) || "ingr.alexi@gmail.com";

    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
    const mailtoBody = encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`);
    
    window.location.href = `mailto:${destinationEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    showToast("Opening email client... Thank you for reaching out!");
    form.reset();
  });

  function showFieldError(inputElem, message) {
    const parent = inputElem.closest(".form-group");
    if (parent) {
      parent.classList.add("error");
      const feedback = parent.querySelector(".form-feedback");
      if (feedback) feedback.textContent = message;
    }
  }
}

/* ==========================================================================
   6. SCROLL EFFECTS & REVEAL OBSERVER
   ========================================================================== */
function initScrollEffects() {
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.active)").forEach(el => revealObserver.observe(el));
  }, 100);

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS & UTILS
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;
