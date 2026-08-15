/**
 * MAIN APPLICATION LOGIC
 * Alexi Dhungel, Er. — Portfolio Website
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Management
  initTheme();

  // 2. Navigation & Mobile Menu
  initNavigation();

  // 3. Render Dynamic Data Components
  renderWhatIBuild();
  renderExperience();
  renderTeaching();
  renderSkills();
  renderProjects();
  renderArticles();
  renderEducation();

  // 4. Interactive Filters & Search
  initSkillFilters();
  initProjectFilters();

  // 5. Contact Form Validation
  initContactForm();

  // 6. Scroll Reveal Observer & Back to Top
  initScrollEffects();
});

/* ==========================================================================
   1. THEME MANAGEMENT (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const storedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "dark");
  document.documentElement.setAttribute("data-theme", initialTheme);
  updateThemeIcon(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
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
    // Show Moon icon for light mode (to switch to dark)
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Show Sun icon for dark mode (to switch to light)
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
  const navLinkItems = document.querySelectorAll(".nav-link");

  // Sticky navbar shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightActiveNav();
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-active");
    });

    // Close mobile menu when clicking a link
    navLinkItems.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-active");
      });
    });
  }

  // Active section scrollspy
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

/* ==========================================================================
   3. DYNAMIC RENDERING
   ========================================================================== */

// Helper to get SVG icon markup
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
    "book-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
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

// 1. Render "What I Build"
function renderWhatIBuild() {
  const container = document.getElementById("what-i-build-container");
  if (!container) return;

  container.innerHTML = portfolioData.whatIBuild.map((item, index) => `
    <div class="expertise-card reveal reveal-delay-${(index % 3) + 1}">
      <div class="expertise-icon-box">
        ${getIconSvg(item.icon)}
      </div>
      <h3 class="expertise-title">${item.title}</h3>
      <p class="expertise-desc">${item.description}</p>
      <div class="expertise-tags">
        ${item.tags.map(t => `<span class="mini-tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

// 2. Render Experience Timeline
function renderExperience() {
  const container = document.getElementById("experience-timeline-container");
  if (!container) return;

  container.innerHTML = `
    <div class="timeline-line"></div>
    ${portfolioData.experience.map((exp, index) => `
      <div class="timeline-item reveal reveal-delay-${index + 1}">
        <div class="timeline-node"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div class="timeline-role-info">
              <h3>${exp.role}</h3>
              <div class="company-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z"/></svg>
                ${exp.company}
              </div>
            </div>
            <div class="timeline-period">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${exp.period}
            </div>
          </div>

          <div class="timeline-highlights">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Deliverables & Systems Engineered
            </h4>
            <div class="highlight-chips">
              ${exp.highlights.map(h => `<div class="highlight-chip">✔ ${h}</div>`).join("")}
            </div>
          </div>

          <div class="timeline-tech-stack">
            <span class="tech-stack-label">Core Technologies:</span>
            ${exp.technologies.map(t => `<span class="tech-tag">${t}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("")}
  `;
}

// 3. Render Teaching Experience & Expertise
function renderTeaching() {
  const container = document.getElementById("teaching-grid-container");
  if (!container) return;

  container.innerHTML = portfolioData.teaching.map((item, index) => `
    <div class="teaching-card reveal reveal-delay-${index + 1}">
      <span class="teaching-badge">${item.badge}</span>
      <h3 class="teaching-institution">${item.expertise}</h3>
      <div class="teaching-subject">${item.subject}</div>
      <div style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 1.25rem;">
        Domain: ${item.period}
      </div>
      <div class="teaching-topics">
        <h5>Instructional Focus & Topics</h5>
        <div class="topics-list">
          ${item.topics.map(t => `<span class="topic-chip">${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

// 4. Render Skills
function renderSkills(filteredSkills = null) {
  const container = document.getElementById("skills-grid-container");
  if (!container) return;

  const dataToRender = filteredSkills || portfolioData.skills;

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
        <span class="skill-name">${skill.name}</span>
        <span class="skill-category-label">${skill.level}</span>
      </div>
    </div>
  `).join("");
}

// 5. Render Generalized Solutions & Tech Stack
function renderProjects(category = "all") {
  const container = document.getElementById("projects-grid-container");
  if (!container) return;

  const filtered = category === "all" 
    ? portfolioData.projects 
    : portfolioData.projects.filter(p => p.category === category);

  container.innerHTML = filtered.map((proj, index) => `
    <div class="project-card reveal active reveal-delay-${(index % 2) + 1}">
      <div class="project-card-header">
        <span class="project-domain-badge">${proj.domain}</span>
        <div class="project-icon-indicator">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
      </div>

      <h3 class="project-title">${proj.title}</h3>
      <p class="project-desc">${proj.shortDesc}</p>

      <div style="margin-top: auto; margin-bottom: 1.25rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Specified Tech Stack:
        </div>
        <div class="project-tech-tags" style="margin-top: 0; margin-bottom: 0;">
          ${proj.technologies.map(t => `<span class="project-tech-pill">${t}</span>`).join("")}
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

// 6. Render Articles
function renderArticles() {
  const container = document.getElementById("articles-grid-container");
  if (!container) return;

  container.innerHTML = portfolioData.articles.map((art, index) => `
    <div class="article-card reveal reveal-delay-${(index % 3) + 1}">
      <div class="article-meta">
        <span class="article-category">${art.category}</span>
        <span class="article-read-time">${art.readTime}</span>
      </div>
      <h3 class="article-title">${art.title}</h3>
      <p class="article-summary">${art.summary}</p>
      <div class="article-footer">
        <span class="article-read-link" onclick="ModalController.showArticle('${art.id}')">
          Read Deep-Dive
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </div>
  `).join("");
}

// 7. Render Education & Qualifications
function renderEducation() {
  const container = document.getElementById("education-grid-container");
  if (!container) return;

  container.innerHTML = portfolioData.education.map((edu, index) => `
    <div class="education-card reveal reveal-delay-${index + 1}">
      <span class="education-badge">${edu.badge}</span>
      <h3 class="education-degree">${edu.degree}</h3>
      <div class="education-institution">${edu.field}</div>
      <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
        ${edu.period}
      </div>
      <div class="education-spec">${edu.description}</div>
    </div>
  `).join("");
}

/* ==========================================================================
   4. INTERACTIVE FILTERS & SEARCH
   ========================================================================= */
function initSkillFilters() {
  const searchInput = document.getElementById("skills-search-input");
  const categoryTabs = document.querySelectorAll(".skills-category-tabs .category-tab");

  let activeCategory = "all";
  let searchQuery = "";

  function filterData() {
    let result = portfolioData.skills;

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

    // Reset error states
    form.querySelectorAll(".form-group").forEach(fg => fg.classList.remove("error"));

    // Name check
    if (!nameInput.value.trim()) {
      showFieldError(nameInput, "Please enter your full name.");
      isValid = false;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    // Subject check
    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput, "Please enter a subject.");
      isValid = false;
    }

    // Message check
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, "Message must be at least 10 characters long.");
      isValid = false;
    }

    if (!isValid) return;

    // Compose mailto fallback / simulation
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
    const mailtoBody = encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`);
    
    // Launch mail client
    window.location.href = `mailto:ingr.alexi@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

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
   6. SCROLL EFFECTS, REVEAL OBSERVER & BACK TO TOP
   ========================================================================== */
function initScrollEffects() {
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
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

  // Dynamically observe future elements created by renderers
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.active)").forEach(el => revealObserver.observe(el));
  }, 100);

  // Back to Top button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS
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
