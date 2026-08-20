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
    this.applyThemeColors();
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
      this.setSrc("cms-cover-preview", data.heroBanner.coverImage || "");
      this.setSrc("cms-avatar-preview", data.heroBanner.avatarPhoto || "assets/images/alexi-dhungel.jpg");
    }

    // 2. Section Visibility Toggles
    if (data.sectionVisibility) {
      Object.keys(data.sectionVisibility).forEach(secKey => {
        const checkbox = document.getElementById(`vis-toggle-${secKey}`);
        if (checkbox) checkbox.checked = !!data.sectionVisibility[secKey];
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

    // 10. Stats CMS
    this.renderStatsCMSList();

    // 11. What I Build CMS
    this.renderWhatIBuildCMSList();

    // 12. Teaching CMS
    this.renderTeachingCMSList();

    // 13. Education CMS
    this.renderEducationCMSList();

    // 14. Theme Colors Panel
    this.renderThemeColorPanel();
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
    if (videos.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No videos added yet.</p>'; return; }
    container.innerHTML = videos.map((vid, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <img src="${vid.customThumbnail || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}" class="cms-item-thumb" alt="Thumbnail" />
          <div>
            <div class="cms-item-title">${this.escapeHtml(vid.title)}</div>
            <div class="cms-item-meta">${vid.category || 'Video'} • ${vid.youtubeId}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${vid.active !== false ? 'active-pill' : 'disabled-pill'}">${vid.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${vid.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('youtubeVideos', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('vid-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('youtubeVideos', ${idx})">🗑️</button>
        </div>
        <div id="vid-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group full-width">
              <label class="cms-label">Video Title</label>
              <input type="text" class="cms-input" id="vid-title-${idx}" value="${this.escapeHtml(vid.title)}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">YouTube URL or Video ID</label>
              <input type="text" class="cms-input" id="vid-url-${idx}" value="${this.escapeHtml(vid.videoUrl || vid.youtubeId)}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Category</label>
              <input type="text" class="cms-input" id="vid-cat-${idx}" value="${this.escapeHtml(vid.category || '')}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Description</label>
              <textarea class="cms-textarea" rows="2" id="vid-desc-${idx}">${this.escapeHtml(vid.description || '')}</textarea>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Custom Thumbnail URL (blank = YouTube auto)</label>
              <input type="text" class="cms-input" id="vid-thumb-${idx}" value="${this.escapeHtml(vid.customThumbnail || '')}" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveVideoItem(${idx})">💾 Save Video</button>
        </div>
      </div>
    `).join("");
  },

  saveVideoItem(idx) {
    if (!this.data.youtubeVideos || !this.data.youtubeVideos[idx]) return;
    const url = document.getElementById(`vid-url-${idx}`).value;
    this.data.youtubeVideos[idx].title = document.getElementById(`vid-title-${idx}`).value;
    this.data.youtubeVideos[idx].videoUrl = url;
    this.data.youtubeVideos[idx].youtubeId = this.parseYouTubeId(url) || url;
    this.data.youtubeVideos[idx].category = document.getElementById(`vid-cat-${idx}`).value;
    this.data.youtubeVideos[idx].description = document.getElementById(`vid-desc-${idx}`).value;
    this.data.youtubeVideos[idx].customThumbnail = document.getElementById(`vid-thumb-${idx}`).value;
    this.saveData();
    this.renderYouTubeCMSList();
    if (typeof showToast === 'function') showToast('✅ Video updated!');
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
    if (projects.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No projects yet.</p>'; return; }
    container.innerHTML = projects.map((proj, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <img src="${proj.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop'}" class="cms-item-thumb" alt="Project" />
          <div>
            <div class="cms-item-title">${this.escapeHtml(proj.title)}</div>
            <div class="cms-item-meta">${this.escapeHtml(proj.domain || 'Domain')}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${proj.active !== false ? 'active-pill' : 'disabled-pill'}">${proj.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${proj.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('projects', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('proj-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('projects', ${idx})">🗑️</button>
        </div>
        <div id="proj-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group full-width">
              <label class="cms-label">Project Title</label>
              <input type="text" class="cms-input" id="proj-title-${idx}" value="${this.escapeHtml(proj.title)}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Domain Label</label>
              <input type="text" class="cms-input" id="proj-domain-${idx}" value="${this.escapeHtml(proj.domain || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Category</label>
              <select class="cms-input" id="proj-cat-${idx}">
                <option value="banking" ${proj.category === 'banking' ? 'selected' : ''}>Digital Banking</option>
                <option value="enterprise" ${proj.category === 'enterprise' ? 'selected' : ''}>Enterprise Systems</option>
                <option value="fintech" ${proj.category === 'fintech' ? 'selected' : ''}>FinTech</option>
              </select>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Short Description</label>
              <textarea class="cms-textarea" rows="2" id="proj-sdesc-${idx}">${this.escapeHtml(proj.shortDesc || '')}</textarea>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Full Description</label>
              <textarea class="cms-textarea" rows="3" id="proj-fdesc-${idx}">${this.escapeHtml(proj.fullDesc || '')}</textarea>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Technologies (comma-separated)</label>
              <input type="text" class="cms-input" id="proj-tech-${idx}" value="${this.escapeHtml((proj.technologies || []).join(', '))}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Key Highlights (one per line)</label>
              <textarea class="cms-textarea" rows="3" id="proj-hl-${idx}">${(proj.highlights || []).map(h => this.escapeHtml(h)).join('\n')}</textarea>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Cover Image URL</label>
              <input type="text" class="cms-input" id="proj-img-${idx}" value="${this.escapeHtml(proj.image || '')}" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveProjectItem(${idx})">💾 Save Project</button>
        </div>
      </div>
    `).join("");
  },

  saveProjectItem(idx) {
    if (!this.data.projects || !this.data.projects[idx]) return;
    this.data.projects[idx].title = document.getElementById(`proj-title-${idx}`).value;
    this.data.projects[idx].domain = document.getElementById(`proj-domain-${idx}`).value;
    this.data.projects[idx].category = document.getElementById(`proj-cat-${idx}`).value;
    this.data.projects[idx].shortDesc = document.getElementById(`proj-sdesc-${idx}`).value;
    this.data.projects[idx].fullDesc = document.getElementById(`proj-fdesc-${idx}`).value;
    this.data.projects[idx].technologies = document.getElementById(`proj-tech-${idx}`).value.split(',').map(t => t.trim()).filter(Boolean);
    this.data.projects[idx].highlights = document.getElementById(`proj-hl-${idx}`).value.split('\n').map(h => h.trim()).filter(Boolean);
    this.data.projects[idx].image = document.getElementById(`proj-img-${idx}`).value;
    this.saveData();
    this.renderProjectsCMSList();
    if (typeof showToast === 'function') showToast('✅ Project updated!');
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

  // 💼 Experience CMS List — Full Inline Edit
  renderExperienceCMSList() {
    const container = document.getElementById("cms-experience-list");
    if (!container) return;
    const exp = this.data.experience || [];
    if (exp.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No experience entries.</p>'; return; }
    container.innerHTML = exp.map((item, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(item.role)}</div>
            <div class="cms-item-meta">${this.escapeHtml(item.period || '')} • ${this.escapeHtml(item.location || '')}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${item.active !== false ? 'active-pill' : 'disabled-pill'}">${item.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${item.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('experience', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('exp-edit-${idx}')">✏️ Edit</button>
        </div>
        <div id="exp-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group full-width">
              <label class="cms-label">Role / Job Title</label>
              <input type="text" class="cms-input" id="exp-role-${idx}" value="${this.escapeHtml(item.role || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Domain</label>
              <input type="text" class="cms-input" id="exp-domain-${idx}" value="${this.escapeHtml(item.domain || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Employment Type</label>
              <input type="text" class="cms-input" id="exp-type-${idx}" value="${this.escapeHtml(item.type || '')}" placeholder="e.g. Full-Time • Lead" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Period</label>
              <input type="text" class="cms-input" id="exp-period-${idx}" value="${this.escapeHtml(item.period || '')}" placeholder="e.g. 2020 – Present" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Location</label>
              <input type="text" class="cms-input" id="exp-loc-${idx}" value="${this.escapeHtml(item.location || '')}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Summary</label>
              <textarea class="cms-textarea" rows="2" id="exp-sum-${idx}">${this.escapeHtml(item.summary || '')}</textarea>
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Technologies (comma-separated)</label>
              <input type="text" class="cms-input" id="exp-tech-${idx}" value="${this.escapeHtml((item.technologies || []).join(', '))}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Tags (comma-separated)</label>
              <input type="text" class="cms-input" id="exp-tags-${idx}" value="${this.escapeHtml((item.tags || []).join(', '))}" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveExperienceItem(${idx})">💾 Save Experience</button>
        </div>
      </div>
    `).join("");
  },

  saveExperienceItem(idx) {
    if (!this.data.experience || !this.data.experience[idx]) return;
    this.data.experience[idx].role = document.getElementById(`exp-role-${idx}`).value;
    this.data.experience[idx].domain = document.getElementById(`exp-domain-${idx}`).value;
    this.data.experience[idx].type = document.getElementById(`exp-type-${idx}`).value;
    this.data.experience[idx].period = document.getElementById(`exp-period-${idx}`).value;
    this.data.experience[idx].location = document.getElementById(`exp-loc-${idx}`).value;
    this.data.experience[idx].summary = document.getElementById(`exp-sum-${idx}`).value;
    this.data.experience[idx].technologies = document.getElementById(`exp-tech-${idx}`).value.split(',').map(t => t.trim()).filter(Boolean);
    this.data.experience[idx].tags = document.getElementById(`exp-tags-${idx}`).value.split(',').map(t => t.trim()).filter(Boolean);
    this.saveData();
    this.renderExperienceCMSList();
    if (typeof showToast === 'function') showToast('✅ Experience updated!');
  },

  // 🛠️ Skills CMS List — Full Edit + Add
  renderSkillsCMSList() {
    const container = document.getElementById("cms-skills-list");
    if (!container) return;
    const skills = this.data.skills || [];
    container.innerHTML = skills.map((sk, idx) => `
      <div class="cms-item-card" style="padding:0.6rem 1rem;">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title" style="font-size:0.9rem;">${this.escapeHtml(sk.name)}</div>
            <div class="cms-item-meta">${this.escapeHtml(sk.category)} • ${this.escapeHtml(sk.level)}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <label class="switch"><input type="checkbox" ${sk.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('skills', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('sk-edit-${idx}')">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('skills', ${idx})">🗑️</button>
        </div>
        <div id="sk-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid" style="grid-template-columns:1fr 1fr 1fr;">
            <div class="cms-form-group">
              <label class="cms-label">Skill Name</label>
              <input type="text" class="cms-input" id="sk-name-${idx}" value="${this.escapeHtml(sk.name)}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Category</label>
              <select class="cms-input" id="sk-cat-${idx}">
                <option value="programming" ${sk.category === 'programming' ? 'selected' : ''}>Programming</option>
                <option value="web" ${sk.category === 'web' ? 'selected' : ''}>Web & APIs</option>
                <option value="database" ${sk.category === 'database' ? 'selected' : ''}>Databases</option>
                <option value="enterprise" ${sk.category === 'enterprise' ? 'selected' : ''}>Enterprise</option>
                <option value="practices" ${sk.category === 'practices' ? 'selected' : ''}>Practices</option>
              </select>
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Level / Proficiency</label>
              <input type="text" class="cms-input" id="sk-level-${idx}" value="${this.escapeHtml(sk.level)}" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.5rem;" onclick="CMS.saveSkillItem(${idx})">💾 Save Skill</button>
        </div>
      </div>
    `).join("");
  },

  saveSkillItem(idx) {
    if (!this.data.skills || !this.data.skills[idx]) return;
    this.data.skills[idx].name = document.getElementById(`sk-name-${idx}`).value;
    this.data.skills[idx].category = document.getElementById(`sk-cat-${idx}`).value;
    this.data.skills[idx].level = document.getElementById(`sk-level-${idx}`).value;
    this.saveData();
    this.renderSkillsCMSList();
    if (typeof showToast === 'function') showToast('✅ Skill updated!');
  },

  addSkill() {
    if (!this.data.skills) this.data.skills = [];
    this.data.skills.push({ id: 'sk-' + Date.now(), name: 'New Skill', category: 'programming', level: 'Proficient', icon: 'code', active: true });
    this.saveData();
    this.renderSkillsCMSList();
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
  },

  // ─── UTILITY: Toggle inline edit panel ────────────────────────────────────
  toggleEditPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  },

  // ─── STATS CRUD ────────────────────────────────────────────────────────────
  renderStatsCMSList() {
    const container = document.getElementById("cms-stats-list");
    if (!container) return;
    const stats = this.data.stats || [];
    if (stats.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No stats yet. Add one above.</p>'; return; }
    container.innerHTML = stats.map((stat, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(stat.value)} — ${this.escapeHtml(stat.label)}</div>
            <div class="cms-item-meta">ID: ${stat.id}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${stat.active !== false ? 'active-pill' : 'disabled-pill'}">${stat.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${stat.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('stats', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('stat-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('stats', ${idx})">🗑️</button>
        </div>
        <div id="stat-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid" style="grid-template-columns:1fr 1fr;">
            <div class="cms-form-group">
              <label class="cms-label">Stat Value</label>
              <input type="text" class="cms-input" id="stat-val-${idx}" value="${this.escapeHtml(stat.value)}" placeholder="e.g. 8+" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Stat Label</label>
              <input type="text" class="cms-input" id="stat-lbl-${idx}" value="${this.escapeHtml(stat.label)}" placeholder="e.g. Years Engineering" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveStatItem(${idx})">💾 Save Stat</button>
        </div>
      </div>
    `).join("");
  },

  saveStatItem(idx) {
    if (!this.data.stats || !this.data.stats[idx]) return;
    this.data.stats[idx].value = document.getElementById(`stat-val-${idx}`).value;
    this.data.stats[idx].label = document.getElementById(`stat-lbl-${idx}`).value;
    this.saveData();
    this.renderStatsCMSList();
    if (typeof showToast === 'function') showToast('✅ Stat updated!');
  },

  addStat() {
    if (!this.data.stats) this.data.stats = [];
    this.data.stats.push({ id: 'stat-' + Date.now(), value: '0', label: 'New Metric', icon: 'code', active: true });
    this.saveData();
    this.renderStatsCMSList();
  },

  // ─── WHAT I BUILD CRUD ────────────────────────────────────────────────────
  renderWhatIBuildCMSList() {
    const container = document.getElementById("cms-whatibuild-list");
    if (!container) return;
    const items = this.data.whatIBuild || [];
    if (items.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No service cards yet.</p>'; return; }
    container.innerHTML = items.map((item, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(item.title)}</div>
            <div class="cms-item-meta">${(item.tags || []).join(', ')}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${item.active !== false ? 'active-pill' : 'disabled-pill'}">${item.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${item.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('whatIBuild', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('wib-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('whatIBuild', ${idx})">🗑️</button>
        </div>
        <div id="wib-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group">
              <label class="cms-label">Card Title</label>
              <input type="text" class="cms-input" id="wib-title-${idx}" value="${this.escapeHtml(item.title)}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Tags (comma-separated)</label>
              <input type="text" class="cms-input" id="wib-tags-${idx}" value="${this.escapeHtml((item.tags || []).join(', '))}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Description</label>
              <textarea class="cms-textarea" rows="2" id="wib-desc-${idx}">${this.escapeHtml(item.description || '')}</textarea>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveWhatIBuildItem(${idx})">💾 Save Card</button>
        </div>
      </div>
    `).join("");
  },

  saveWhatIBuildItem(idx) {
    if (!this.data.whatIBuild || !this.data.whatIBuild[idx]) return;
    this.data.whatIBuild[idx].title = document.getElementById(`wib-title-${idx}`).value;
    this.data.whatIBuild[idx].description = document.getElementById(`wib-desc-${idx}`).value;
    this.data.whatIBuild[idx].tags = document.getElementById(`wib-tags-${idx}`).value.split(',').map(t => t.trim()).filter(Boolean);
    this.saveData();
    this.renderWhatIBuildCMSList();
    if (typeof showToast === 'function') showToast('✅ Service card updated!');
  },

  addWhatIBuildItem() {
    if (!this.data.whatIBuild) this.data.whatIBuild = [];
    this.data.whatIBuild.push({ id: 'wib-' + Date.now(), title: 'New Service Card', description: 'Describe what you build here.', icon: 'code', tags: ['Technology'], active: true });
    this.saveData();
    this.renderWhatIBuildCMSList();
  },

  // ─── TEACHING CRUD ────────────────────────────────────────────────────────
  renderTeachingCMSList() {
    const container = document.getElementById("cms-teaching-list");
    if (!container) return;
    const items = this.data.teaching || [];
    if (items.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No teaching cards yet.</p>'; return; }
    container.innerHTML = items.map((item, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(item.expertise)}</div>
            <div class="cms-item-meta">${this.escapeHtml(item.badge || '')} • ${this.escapeHtml(item.period || '')}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${item.active !== false ? 'active-pill' : 'disabled-pill'}">${item.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${item.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('teaching', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('teach-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('teaching', ${idx})">🗑️</button>
        </div>
        <div id="teach-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group">
              <label class="cms-label">Expertise / Card Title</label>
              <input type="text" class="cms-input" id="teach-exp-${idx}" value="${this.escapeHtml(item.expertise || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Subject</label>
              <input type="text" class="cms-input" id="teach-sub-${idx}" value="${this.escapeHtml(item.subject || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Period / Domain Label</label>
              <input type="text" class="cms-input" id="teach-per-${idx}" value="${this.escapeHtml(item.period || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Badge Label</label>
              <input type="text" class="cms-input" id="teach-badge-${idx}" value="${this.escapeHtml(item.badge || '')}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Topics (one per line)</label>
              <textarea class="cms-textarea" rows="5" id="teach-topics-${idx}">${(item.topics || []).join('\n')}</textarea>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveTeachingItem(${idx})">💾 Save Teaching Card</button>
        </div>
      </div>
    `).join("");
  },

  saveTeachingItem(idx) {
    if (!this.data.teaching || !this.data.teaching[idx]) return;
    this.data.teaching[idx].expertise = document.getElementById(`teach-exp-${idx}`).value;
    this.data.teaching[idx].subject = document.getElementById(`teach-sub-${idx}`).value;
    this.data.teaching[idx].period = document.getElementById(`teach-per-${idx}`).value;
    this.data.teaching[idx].badge = document.getElementById(`teach-badge-${idx}`).value;
    this.data.teaching[idx].topics = document.getElementById(`teach-topics-${idx}`).value.split('\n').map(t => t.trim()).filter(Boolean);
    this.saveData();
    this.renderTeachingCMSList();
    if (typeof showToast === 'function') showToast('✅ Teaching card updated!');
  },

  addTeachingItem() {
    if (!this.data.teaching) this.data.teaching = [];
    this.data.teaching.push({ id: 'teach-' + Date.now(), expertise: 'New Teaching Area', subject: 'Subject Title', period: 'Specialized Instruction', badge: 'Specialty', topics: ['Topic 1', 'Topic 2'], active: true });
    this.saveData();
    this.renderTeachingCMSList();
  },

  // ─── EDUCATION CRUD ───────────────────────────────────────────────────────
  renderEducationCMSList() {
    const container = document.getElementById("cms-education-list");
    if (!container) return;
    const items = this.data.education || [];
    if (items.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No education entries yet.</p>'; return; }
    container.innerHTML = items.map((item, idx) => `
      <div class="cms-item-card">
        <div class="cms-item-main">
          <div>
            <div class="cms-item-title">${this.escapeHtml(item.degree)}</div>
            <div class="cms-item-meta">${this.escapeHtml(item.field || '')} • ${this.escapeHtml(item.badge || '')}</div>
          </div>
        </div>
        <div class="cms-item-actions">
          <span class="status-pill ${item.active !== false ? 'active-pill' : 'disabled-pill'}">${item.active !== false ? 'Active' : 'Disabled'}</span>
          <label class="switch"><input type="checkbox" ${item.active !== false ? 'checked' : ''} onchange="CMS.toggleItemActive('education', ${idx})"><span class="slider"></span></label>
          <button class="btn btn-secondary btn-sm" onclick="CMS.toggleEditPanel('edu-edit-${idx}')">✏️ Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="CMS.deleteItem('education', ${idx})">🗑️</button>
        </div>
        <div id="edu-edit-${idx}" class="cms-inline-edit" style="display:none;">
          <div class="cms-form-grid">
            <div class="cms-form-group full-width">
              <label class="cms-label">Degree / Qualification Title</label>
              <input type="text" class="cms-input" id="edu-deg-${idx}" value="${this.escapeHtml(item.degree || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Field / Specialization</label>
              <input type="text" class="cms-input" id="edu-field-${idx}" value="${this.escapeHtml(item.field || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Period / Year</label>
              <input type="text" class="cms-input" id="edu-per-${idx}" value="${this.escapeHtml(item.period || '')}" />
            </div>
            <div class="cms-form-group">
              <label class="cms-label">Badge Label</label>
              <input type="text" class="cms-input" id="edu-badge-${idx}" value="${this.escapeHtml(item.badge || '')}" />
            </div>
            <div class="cms-form-group full-width">
              <label class="cms-label">Description</label>
              <textarea class="cms-textarea" rows="3" id="edu-desc-${idx}">${this.escapeHtml(item.description || '')}</textarea>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:0.6rem;" onclick="CMS.saveEducationItem(${idx})">💾 Save Education</button>
        </div>
      </div>
    `).join("");
  },

  saveEducationItem(idx) {
    if (!this.data.education || !this.data.education[idx]) return;
    this.data.education[idx].degree = document.getElementById(`edu-deg-${idx}`).value;
    this.data.education[idx].field = document.getElementById(`edu-field-${idx}`).value;
    this.data.education[idx].period = document.getElementById(`edu-per-${idx}`).value;
    this.data.education[idx].badge = document.getElementById(`edu-badge-${idx}`).value;
    this.data.education[idx].description = document.getElementById(`edu-desc-${idx}`).value;
    this.saveData();
    this.renderEducationCMSList();
    if (typeof showToast === 'function') showToast('✅ Education entry updated!');
  },

  addEducationItem() {
    if (!this.data.education) this.data.education = [];
    this.data.education.push({ id: 'edu-' + Date.now(), degree: 'New Qualification', field: 'Field of Study', period: 'Year', badge: 'Credential', description: 'Describe this qualification.', active: true });
    this.saveData();
    this.renderEducationCMSList();
  },

  // ─── THEME & BRAND COLORS ─────────────────────────────────────────────────
  renderThemeColorPanel() {
    const container = document.getElementById("cms-theme-panel-content");
    if (!container) return;
    const stored = this.data.themeColors || {};
    const fields = [
      { id: 'brand-cyan',    label: 'Primary Brand (Cyan/Blue)',   varName: '--brand-cyan',    def: '#06B6D4' },
      { id: 'brand-blue',    label: 'Secondary Accent (Blue)',      varName: '--brand-blue',    def: '#3B82F6' },
      { id: 'brand-indigo',  label: 'Indigo Accent',               varName: '--brand-indigo',  def: '#6366F1' },
      { id: 'brand-emerald', label: 'Emerald / Success Color',     varName: '--brand-emerald', def: '#10B981' },
      { id: 'brand-amber',   label: 'Amber / Warning Color',       varName: '--brand-amber',   def: '#F59E0B' },
      { id: 'brand-rose',    label: 'Rose / Danger Color',         varName: '--brand-rose',    def: '#F43F5E' },
      { id: 'bg-primary',    label: 'BG Primary (Dark Mode)',      varName: '--bg-primary',    def: '#070B14' },
      { id: 'bg-secondary',  label: 'BG Secondary (Dark Mode)',    varName: '--bg-secondary',  def: '#0B1120' },
    ];
    container.innerHTML = `
      <div class="theme-color-grid">
        ${fields.map(f => {
          const val = stored[f.varName] || f.def;
          return `
            <div class="theme-color-item">
              <label class="cms-label">${f.label}</label>
              <div class="theme-color-input-row">
                <input type="color" id="clr-${f.id}" value="${val}"
                  oninput="document.getElementById('clr-txt-${f.id}').value=this.value" />
                <input type="text" class="cms-input" id="clr-txt-${f.id}" value="${val}"
                  oninput="document.getElementById('clr-${f.id}').value=this.value" />
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary btn-lg" onclick="CMS.saveThemeColors()">🎨 Apply Theme Colors</button>
        <button class="btn btn-secondary btn-sm" onclick="CMS.resetThemeColors()">🔄 Reset to Defaults</button>
      </div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.75rem;">Colors apply live to the page and are saved with your profile data.</p>
    `;
  },

  saveThemeColors() {
    const fields = [
      { id: 'brand-cyan',    varName: '--brand-cyan' },
      { id: 'brand-blue',    varName: '--brand-blue' },
      { id: 'brand-indigo',  varName: '--brand-indigo' },
      { id: 'brand-emerald', varName: '--brand-emerald' },
      { id: 'brand-amber',   varName: '--brand-amber' },
      { id: 'brand-rose',    varName: '--brand-rose' },
      { id: 'bg-primary',    varName: '--bg-primary' },
      { id: 'bg-secondary',  varName: '--bg-secondary' },
    ];
    if (!this.data.themeColors) this.data.themeColors = {};
    fields.forEach(f => {
      const textEl = document.getElementById(`clr-txt-${f.id}`);
      const colorEl = document.getElementById(`clr-${f.id}`);
      const val = (textEl ? textEl.value : '') || (colorEl ? colorEl.value : '');
      if (val) this.data.themeColors[f.varName] = val;
    });
    this.applyThemeColors();
    this.saveData();
    if (typeof showToast === 'function') showToast('🎨 Theme colors applied!');
  },

  applyThemeColors() {
    if (!this.data || !this.data.themeColors) return;
    const root = document.documentElement;
    Object.entries(this.data.themeColors).forEach(([varName, value]) => {
      if (value) root.style.setProperty(varName, value);
    });
  },

  resetThemeColors() {
    if (!confirm('Reset all custom colors to defaults?')) return;
    this.data.themeColors = {};
    const vars = ['--brand-cyan','--brand-blue','--brand-indigo','--brand-emerald','--brand-amber','--brand-rose','--bg-primary','--bg-secondary'];
    vars.forEach(v => document.documentElement.style.removeProperty(v));
    this.saveData();
    this.renderThemeColorPanel();
    if (typeof showToast === 'function') showToast('🔄 Colors reset to defaults!');
  }

};

document.addEventListener("DOMContentLoaded", () => {
  CMS.init();
});
