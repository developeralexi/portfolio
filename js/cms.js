/**
 * DYNAMIC CONTENT MANAGEMENT SYSTEM (CMS STUDIO) ENGINE
 * Code With Alexi — Universal Profession Profile CMS
 */

const CMS = {
  activeTab: "hero",
  data: null,

  // Token & Authentication State Helpers
  getToken() {
    return sessionStorage.getItem("cms_auth_token");
  },

  setToken(token) {
    sessionStorage.setItem("cms_auth_token", token);
  },

  clearToken() {
    sessionStorage.removeItem("cms_auth_token");
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  init() {
    this.data = this.loadStoredData();
    this.bindEvents();
    this.renderActiveVisibility();
    this.checkInitialHashTrigger();
    console.log("⚡ Secure CMS Studio initialized.");
  },

  // Check URL Hash for secret trigger (#admin or #cms)
  checkInitialHashTrigger() {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#admin" || hash === "#cms" || hash === "#studio") {
      setTimeout(() => this.openModal(), 300);
    }
  },

  // Load data from LocalStorage or default baseline
  loadStoredData() {
    const saved = localStorage.getItem("cms_portfolio_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Object.assign({}, portfolioData, parsed);
      } catch (e) {
        console.warn("Failed to parse local storage data, using default portfolioData");
      }
    }
    return JSON.parse(JSON.stringify(portfolioData));
  },

  // Dual Persistence: LocalStorage + Server /api/cms endpoint with Bearer token header
  saveData(newData) {
    if (newData) {
      this.data = newData;
    }
    
    // Save to LocalStorage
    localStorage.setItem("cms_portfolio_data", JSON.stringify(this.data));
    
    // Sync to global window object
    window.currentPortfolioData = this.data;

    // Send to Node server API with Authorization header
    const token = this.getToken();
    fetch("/api/cms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify(this.data)
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          console.log("💾 CMS data securely persisted to disk server.");
        }
      }).catch(err => {
        // Quiet fallback for static hosts
      });

    // Re-render UI
    if (window.renderAllComponents) {
      window.renderAllComponents();
    }

    if (typeof showToast === "function") {
      showToast("✨ CMS changes saved successfully!");
    }
  },

  bindEvents() {
    // Secret Keyboard shortcut: Alt + Shift + C or Alt + C
    document.addEventListener("keydown", (e) => {
      if ((e.altKey && e.shiftKey && e.key.toLowerCase() === "c") || (e.altKey && e.key.toLowerCase() === "c")) {
        e.preventDefault();
        this.toggleModal();
      }
    });

    // Secret URL Hash Change Listener (#admin or #cms)
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash === "#cms" || hash === "#studio") {
        this.openModal();
      }
    });

    // Secret Footer Triple-Click Trigger
    let footerClicks = 0;
    let footerTimer = null;
    const footerEl = document.getElementById("footer-copyright");
    if (footerEl) {
      footerEl.addEventListener("click", () => {
        footerClicks++;
        if (footerClicks === 3) {
          footerClicks = 0;
          clearTimeout(footerTimer);
          this.openModal();
        } else {
          clearTimeout(footerTimer);
          footerTimer = setTimeout(() => { footerClicks = 0; }, 800);
        }
      });
    }

    // Global dragover events for image uploaders
    document.addEventListener("dragover", (e) => {
      if (e.target.closest(".image-uploader-box")) {
        e.preventDefault();
        e.target.closest(".image-uploader-box").classList.add("dragover");
      }
    });

    document.addEventListener("dragleave", (e) => {
      if (e.target.closest(".image-uploader-box")) {
        e.target.closest(".image-uploader-box").classList.remove("dragover");
      }
    });

    document.addEventListener("drop", (e) => {
      const dropzone = e.target.closest(".image-uploader-box");
      if (dropzone) {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files && files[0]) {
          const targetInputId = dropzone.dataset.targetInput;
          const targetPreviewId = dropzone.dataset.targetPreview;
          this.handleFileUpload(files[0], targetInputId, targetPreviewId);
        }
      }
    });
  },

  // Open Auth Modal for password entry
  openAuthModal() {
    const authModal = document.getElementById("cms-auth-modal");
    if (!authModal) return;
    const errorEl = document.getElementById("cms-auth-error");
    if (errorEl) errorEl.style.display = "none";
    
    const pwInput = document.getElementById("cms-passphrase-input");
    if (pwInput) pwInput.value = "";

    authModal.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => { if (pwInput) pwInput.focus(); }, 150);
  },

  closeAuthModal() {
    const authModal = document.getElementById("cms-auth-modal");
    if (authModal) {
      authModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  togglePasswordVisibility() {
    const pwInput = document.getElementById("cms-passphrase-input");
    if (pwInput) {
      pwInput.type = pwInput.type === "password" ? "text" : "password";
    }
  },

  // Submit Passphrase to Login Endpoint
  handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const pwInput = document.getElementById("cms-passphrase-input");
    const errorEl = document.getElementById("cms-auth-error");
    const cardEl = document.querySelector(".cms-auth-card");
    const loginBtn = document.getElementById("cms-login-btn");

    if (!pwInput) return;
    const passphrase = pwInput.value.trim();

    if (!passphrase) {
      if (errorEl) {
        errorEl.textContent = "Please enter the passphrase.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (loginBtn) loginBtn.disabled = true;

    // Call server API login endpoint
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase })
    })
    .then(res => res.json())
    .then(res => {
      if (loginBtn) loginBtn.disabled = false;

      if (res.success && res.token) {
        this.setToken(res.token);
        this.closeAuthModal();
        this.openStudioModal();
        if (typeof showToast === "function") {
          showToast("🔓 CMS Studio Unlocked Successfully!");
        }
      } else {
        const errorMsg = res.error || "Invalid passphrase.";
        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.style.display = "block";
        }
        if (cardEl) {
          cardEl.classList.remove("shake");
          void cardEl.offsetWidth; // trigger reflow
          cardEl.classList.add("shake");
        }
      }
    })
    .catch(() => {
      // Fallback for static servers (e.g. GitHub pages / standard static host)
      if (loginBtn) loginBtn.disabled = false;
      if (passphrase === "alexi@admin2026") {
        this.setToken("static-session-token-2026");
        this.closeAuthModal();
        this.openStudioModal();
        if (typeof showToast === "function") {
          showToast("🔓 CMS Studio Unlocked (Static Session)!");
        }
      } else {
        if (errorEl) {
          errorEl.textContent = "Invalid master passphrase.";
          errorEl.style.display = "block";
        }
        if (cardEl) {
          cardEl.classList.remove("shake");
          void cardEl.offsetWidth;
          cardEl.classList.add("shake");
        }
      }
    });
  },

  // Main Open Modal entry point (Auth-Gated)
  openModal(tabName = "hero") {
    if (!this.isAuthenticated()) {
      this.openAuthModal();
      return;
    }
    this.openStudioModal(tabName);
  },

  openStudioModal(tabName = "hero") {
    const modal = document.getElementById("cms-studio-modal");
    if (!modal) return;

    this.switchTab(tabName);
    this.populateForms();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    const modal = document.getElementById("cms-studio-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  // Lock / Logout CMS Studio
  logout() {
    this.clearToken();
    this.closeModal();
    if (typeof showToast === "function") {
      showToast("🔒 CMS Studio Locked & Session Ended");
    }
  },

  toggleModal() {
    const studioModal = document.getElementById("cms-studio-modal");
    const authModal = document.getElementById("cms-auth-modal");
    
    if ((studioModal && studioModal.classList.contains("active")) || (authModal && authModal.classList.contains("active"))) {
      this.closeModal();
      this.closeAuthModal();
    } else {
      this.openModal();
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    
    // Tab buttons active state
    document.querySelectorAll(".cms-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Tab panel active state
    document.querySelectorAll(".cms-panel").forEach(panel => {
      panel.classList.toggle("active", panel.id === `cms-panel-${tabName}`);
    });
  },

  populateForms() {
    const data = this.data;
    if (!data) return;

    // 1. Hero & Profile Form
    if (data.heroBanner) {
      this.setVal("cms-hero-name", data.heroBanner.name || data.personal.name);
      this.setVal("cms-hero-badge", data.heroBanner.badgeText || "");
      this.setVal("cms-hero-brand-badge", data.heroBanner.brandBadge || "");
      this.setVal("cms-hero-brand-name", data.heroBanner.brandName || data.personal.brandName);
      this.setVal("cms-hero-titles", (data.heroBanner.titles || data.personal.titles || []).join("\n"));
      this.setVal("cms-hero-bio-short", data.heroBanner.bioShort || data.personal.bioShort);
      this.setVal("cms-hero-bio-long", data.heroBanner.bioLong || data.personal.bioLong);
      this.setVal("cms-hero-cover-url", data.heroBanner.coverImage || "");
      this.setVal("cms-hero-avatar-url", data.heroBanner.avatarPhoto || "");
      this.setVal("cms-hero-cta-primary", data.heroBanner.ctaPrimaryText || "");
      this.setVal("cms-hero-cta-secondary", data.heroBanner.ctaSecondaryText || "");

      // Previews
      this.setSrc("cms-cover-preview", data.heroBanner.coverImage || "");
      this.setSrc("cms-avatar-preview", data.heroBanner.avatarPhoto || "assets/images/alexi-dhungel.jpg");
    }

    // 2. Section Visibility Toggles
    if (data.sectionVisibility) {
      Object.keys(data.sectionVisibility).forEach(secKey => {
        const checkbox = document.getElementById(`vis-toggle-${secKey}`);
        if (checkbox) {
          checkbox.checked = !!data.sectionVisibility[secKey];
        }
      });
    }

    // 3. YouTube Videos Manager
    this.renderYouTubeCMSList();

    // 4. Articles / Blog CMS Manager
    this.renderArticlesCMSList();

    // 5. Projects CMS Manager
    this.renderProjectsCMSList();

    // 6. Experience & Services CMS
    this.renderExperienceCMSList();

    // 7. Skills CMS
    this.renderSkillsCMSList();

    // 8. Social Links CMS
    this.populateSocialForms();

    // 9. Presets UI
    this.renderPresetsUI();
  },

  setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  },

  setSrc(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  },

  // Save Hero Banner Form
  saveHeroBanner() {
    const name = document.getElementById("cms-hero-name").value;
    const badgeText = document.getElementById("cms-hero-badge").value;
    const brandBadge = document.getElementById("cms-hero-brand-badge").value;
    const brandName = document.getElementById("cms-hero-brand-name").value;
    const titlesRaw = document.getElementById("cms-hero-titles").value;
    const bioShort = document.getElementById("cms-hero-bio-short").value;
    const bioLong = document.getElementById("cms-hero-bio-long").value;
    const coverImage = document.getElementById("cms-hero-cover-url").value;
    const avatarPhoto = document.getElementById("cms-hero-avatar-url").value;
    const ctaPrimaryText = document.getElementById("cms-hero-cta-primary").value;
    const ctaSecondaryText = document.getElementById("cms-hero-cta-secondary").value;

    const titles = titlesRaw.split("\n").map(t => t.trim()).filter(Boolean);

    this.data.heroBanner = {
      coverImage: coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
      avatarPhoto: avatarPhoto || "assets/images/alexi-dhungel.jpg",
      avatarStyle: "glow",
      badgeText,
      brandBadge,
      name,
      brandName,
      titles,
      bioShort,
      bioLong,
      ctaPrimaryText,
      ctaPrimaryLink: "#projects",
      ctaSecondaryText,
      ctaSecondaryLink: "#contact"
    };

    this.data.personal.name = name;
    this.data.personal.brandName = brandName;
    this.data.personal.titles = titles;
    this.data.personal.bioShort = bioShort;
    this.data.personal.bioLong = bioLong;

    this.saveData();
  },

  // File Upload Helper (converts image to Base64)
  handleFileUpload(file, targetInputId, targetPreviewId) {
    if (!file || !file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      if (targetInputId) {
        const inputEl = document.getElementById(targetInputId);
        if (inputEl) inputEl.value = base64Url;
      }
      if (targetPreviewId) {
        const previewEl = document.getElementById(targetPreviewId);
        if (previewEl) previewEl.src = base64Url;
      }
      showToast("🖼️ Image loaded successfully!");
    };
    reader.readAsDataURL(file);
  },

  // Parse YouTube link to get ID
  parseYouTubeId(url) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  },

  // 🎬 YouTube & Videos Management
  renderYouTubeCMSList() {
    const container = document.getElementById("cms-youtube-list");
    if (!container) return;

    const videos = this.data.youtubeVideos || [];
    container.innerHTML = videos.map((vid, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <img src="${vid.customThumbnail || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}" class="cms-item-thumb" alt="Thumbnail" />
          <div>
            <div class="cms-item-title">${this.escapeHtml(vid.title)}</div>
            <div class="cms-item-meta">${vid.category || "Video"} • ${vid.youtubeId}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${vid.active !== false ? 'active-pill' : 'disabled-pill'}">
            ${vid.active !== false ? 'Active' : 'Disabled'}
          </span>
          <label class="switch">
            <input type="checkbox" ${vid.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('youtubeVideos', ${idx})">
            <span class="slider"></span>
          </label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('youtubeVideos', ${idx})">🗑️</button>
        </div>
      </div>
    `).join("");
  },

  addYouTubeVideo() {
    const title = prompt("Enter Video Title:");
    if (!title) return;
    const url = prompt("Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...):");
    if (!url) return;

    const youtubeId = this.parseYouTubeId(url);
    const category = prompt("Enter Category (e.g. Tech, Java, Tutorial):", "Tech Showcase");
    const description = prompt("Enter Short Description:", "");

    if (!this.data.youtubeVideos) this.data.youtubeVideos = [];
    this.data.youtubeVideos.unshift({
      id: "vid-" + Date.now(),
      title,
      videoUrl: url,
      youtubeId,
      category: category || "Video",
      description: description || "",
      customThumbnail: "",
      active: true
    });

    this.saveData();
    this.renderYouTubeCMSList();
  },

  // ✍️ Dynamic Articles / Blog Management
  renderArticlesCMSList() {
    const container = document.getElementById("cms-articles-list");
    if (!container) return;

    const articles = this.data.articles || [];
    container.innerHTML = articles.map((art, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <img src="${art.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop'}" class="cms-item-thumb" alt="Cover" />
          <div>
            <div class="cms-item-title">${this.escapeHtml(art.title)}</div>
            <div class="cms-item-meta">${art.category || 'Blog'} • ${art.readTime || '5 min read'}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <button class="btn btn-secondary btn-sm" onclick="CMS.editArticle(${idx})">✏️ Edit</button>
          <span class="status-pill ${art.active !== false ? 'active-pill' : 'disabled-pill'}">
            ${art.active !== false ? 'Active' : 'Disabled'}
          </span>
          <label class="switch">
            <input type="checkbox" ${art.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('articles', ${idx})">
            <span class="slider"></span>
          </label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('articles', ${idx})">🗑️</button>
        </div>
      </div>
    `).join("");
  },

  addArticle() {
    const title = prompt("Enter Article Title:");
    if (!title) return;
    const category = prompt("Enter Category (e.g. Tech, Java, Banking):", "Technology");
    const summary = prompt("Enter Summary:", "");
    const content = prompt("Enter Article Content / Body (Markdown supported):", "");

    if (!this.data.articles) this.data.articles = [];
    this.data.articles.unshift({
      id: "art-" + Date.now(),
      title,
      category: category || "Tech",
      readTime: "5 min read",
      date: new Date().toISOString().split("T")[0],
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
      summary: summary || "",
      content: content || "### New Article\n\nContent coming soon...",
      active: true
    });

    this.saveData();
    this.renderArticlesCMSList();
  },

  editArticle(index) {
    const art = this.data.articles[index];
    if (!art) return;
    const newTitle = prompt("Edit Article Title:", art.title);
    if (newTitle !== null) art.title = newTitle;
    const newSummary = prompt("Edit Summary:", art.summary);
    if (newSummary !== null) art.summary = newSummary;
    const newContent = prompt("Edit Content:", art.content);
    if (newContent !== null) art.content = newContent;
    const newCover = prompt("Cover Image URL:", art.coverImage);
    if (newCover !== null) art.coverImage = newCover;

    this.saveData();
    this.renderArticlesCMSList();
  },

  // 📁 Projects Management
  renderProjectsCMSList() {
    const container = document.getElementById("cms-projects-list");
    if (!container) return;

    const projects = this.data.projects || [];
    container.innerHTML = projects.map((proj, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <img src="${proj.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop'}" class="cms-item-thumb" alt="Project" />
          <div>
            <div class="cms-item-title">${this.escapeHtml(proj.title)}</div>
            <div class="cms-item-meta">${proj.domain || 'Domain'}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${proj.active !== false ? 'active-pill' : 'disabled-pill'}">
            ${proj.active !== false ? 'Active' : 'Disabled'}
          </span>
          <label class="switch">
            <input type="checkbox" ${proj.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('projects', ${idx})">
            <span class="slider"></span>
          </label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('projects', ${idx})">🗑️</button>
        </div>
      </div>
    `).join("");
  },

  addProject() {
    const title = prompt("Enter Project Title:");
    if (!title) return;
    const domain = prompt("Enter Domain / Category:", "Software Engineering");
    const shortDesc = prompt("Enter Short Description:", "");
    const image = prompt("Image URL (leave blank for default):", "");

    if (!this.data.projects) this.data.projects = [];
    this.data.projects.unshift({
      id: "sol-" + Date.now(),
      title,
      category: "enterprise",
      domain: domain || "Technology",
      image: image || "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      shortDesc: shortDesc || "",
      fullDesc: shortDesc || "",
      technologies: ["JavaScript", "HTML5", "CSS3"],
      highlights: ["High-impact project architecture", "Scalable performance design"],
      active: true
    });

    this.saveData();
    this.renderProjectsCMSList();
  },

  // 💼 Experience CMS List
  renderExperienceCMSList() {
    const container = document.getElementById("cms-experience-list");
    if (!container) return;

    const exp = this.data.experience || [];
    container.innerHTML = exp.map((item, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(item.role)}</div>
            <div class="cms-item-meta">${item.period} • ${item.location}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${item.active !== false ? 'active-pill' : 'disabled-pill'}">
            ${item.active !== false ? 'Active' : 'Disabled'}
          </span>
          <label class="switch">
            <input type="checkbox" ${item.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('experience', ${idx})">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `).join("");
  },

  // 🛠️ Skills CMS List
  renderSkillsCMSList() {
    const container = document.getElementById("cms-skills-list");
    if (!container) return;

    const skills = this.data.skills || [];
    container.innerHTML = skills.map((sk, idx) => `
      <div class="cms-item-card" style="padding: 0.6rem 1rem;">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title" style="font-size: 0.9rem;">${this.escapeHtml(sk.name)}</div>
            <div class="cms-item-meta">${sk.category} • ${sk.level}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <label class="switch">
            <input type="checkbox" ${sk.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('skills', ${idx})">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `).join("");
  },

  // 🌐 Social Links Form
  populateSocialForms() {
    const p = this.data.personal || {};
    this.setVal("cms-social-email", p.email || "");
    this.setVal("cms-social-linkedin", p.linkedin || "");
    this.setVal("cms-social-github", p.github || "");
    this.setVal("cms-social-youtube", p.youtube || "");
    this.setVal("cms-social-twitter", p.twitter || "");
    this.setVal("cms-social-location", p.location || "");
  },

  saveSocials() {
    if (!this.data.personal) this.data.personal = {};
    this.data.personal.email = document.getElementById("cms-social-email").value;
    this.data.personal.linkedin = document.getElementById("cms-social-linkedin").value;
    this.data.personal.github = document.getElementById("cms-social-github").value;
    this.data.personal.youtube = document.getElementById("cms-social-youtube").value;
    this.data.personal.twitter = document.getElementById("cms-social-twitter").value;
    this.data.personal.location = document.getElementById("cms-social-location").value;

    this.saveData();
  },

  // Toggle active state for item in array
  toggleItemActive(arrayKey, index) {
    if (this.data && this.data[arrayKey] && this.data[arrayKey][index]) {
      const current = this.data[arrayKey][index].active !== false;
      this.data[arrayKey][index].active = !current;
      this.saveData();
    }
  },

  // Delete item from array
  deleteItem(arrayKey, index) {
    if (confirm("Are you sure you want to delete this item?")) {
      if (this.data && this.data[arrayKey]) {
        this.data[arrayKey].splice(index, 1);
        this.saveData();
        this.populateForms();
      }
    }
  },

  // Save master section visibility toggles
  saveSectionVisibility() {
    if (!this.data.sectionVisibility) {
      this.data.sectionVisibility = {};
    }

    const keys = ["hero", "stats", "videos", "whatIBuild", "about", "experience", "teaching", "skills", "projects", "articles", "education", "contact"];
    keys.forEach(k => {
      const el = document.getElementById(`vis-toggle-${k}`);
      if (el) {
        this.data.sectionVisibility[k] = el.checked;
      }
    });

    this.saveData();
    this.renderActiveVisibility();
  },

  // Hide or show sections on the live webpage
  renderActiveVisibility() {
    const vis = (this.data && this.data.sectionVisibility) ? this.data.sectionVisibility : portfolioData.sectionVisibility;
    if (!vis) return;

    Object.keys(vis).forEach(secKey => {
      const sectionEl = document.getElementById(secKey);
      if (sectionEl) {
        if (vis[secKey] === false) {
          sectionEl.style.display = "none";
        } else {
          sectionEl.style.display = "";
        }
      }
    });
  },

  // 🎭 Profession Preset Switcher
  renderPresetsUI() {
    const container = document.getElementById("cms-presets-grid");
    if (!container) return;

    const presets = portfolioData.professionPresets || {};
    const activeKey = this.data.activeProfession || "engineer";

    container.innerHTML = Object.keys(presets).map(key => {
      const preset = presets[key];
      const isActive = key === activeKey;
      return `
        <div class="preset-card ${isActive ? 'active-preset' : ''}" onclick="CMS.applyPreset('${key}')">
          <img src="${preset.coverImage}" class="preset-card-cover" alt="Cover" />
          <div class="preset-card-content">
            <span class="preset-card-badge">${preset.badge}</span>
            <div class="preset-card-title">${preset.name}</div>
            <div class="preset-card-desc">${preset.bioShort}</div>
            ${isActive ? '<span class="status-pill active-pill" style="margin-top: 0.5rem; align-self: flex-start;">✓ Active Profile</span>' : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  applyPreset(presetKey) {
    const presets = portfolioData.professionPresets || {};
    const preset = presets[presetKey];
    if (!preset) return;

    if (confirm(`Switch profile to ${preset.name}?`)) {
      this.data.activeProfession = presetKey;
      this.data.heroBanner.name = preset.heroName;
      this.data.heroBanner.badgeText = preset.badge;
      this.data.heroBanner.brandBadge = preset.brandBadge;
      this.data.heroBanner.brandName = preset.brandName;
      this.data.heroBanner.coverImage = preset.coverImage;
      this.data.heroBanner.titles = preset.titles;
      this.data.heroBanner.bioShort = preset.bioShort;

      this.data.personal.name = preset.heroName;
      this.data.personal.brandName = preset.brandName;
      this.data.personal.titles = preset.titles;
      this.data.personal.bioShort = preset.bioShort;

      this.saveData();
      this.populateForms();
      showToast(`🎉 Applied ${preset.name} preset!`);
    }
  },

  // Export JSON Config
  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `profile-cms-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Exported CMS config file.");
  },

  // Import JSON Config
  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        this.data = imported;
        this.saveData();
        this.populateForms();
        showToast("📤 Successfully imported CMS configuration!");
      } catch (err) {
        alert("Invalid JSON file format!");
      }
    };
    reader.readAsText(file);
  },

  // Reset to Default Data
  resetToDefault() {
    if (confirm("Are you sure you want to reset all CMS changes to the default benchmark data?")) {
      localStorage.removeItem("cms_portfolio_data");
      this.data = JSON.parse(JSON.stringify(portfolioData));
      this.saveData();
      this.populateForms();
      showToast("🔄 Reset to default data successfully.");
    }
  },

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CMS.init();
});
