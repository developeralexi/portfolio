/**
 * MODAL CONTROLLER & DIALOGS
 * Alexi Dhungel, Er. — Portfolio
 */

const ModalController = {
  activeModal: null,

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    this.activeModal = modal;

    // Focus close button for accessibility
    const closeBtn = modal.querySelector(".modal-close-btn");
    if (closeBtn) closeBtn.focus();
  },

  close() {
    if (!this.activeModal) return;
    this.activeModal.classList.remove("active");
    document.body.style.overflow = "";
    this.activeModal = null;
  },

  showProjectDetails(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project) return;

    const modalBody = document.getElementById("project-modal-body");
    const modalTitle = document.getElementById("project-modal-title");

    if (modalTitle) modalTitle.textContent = project.title;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="project-modal-content">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <span class="project-domain-badge">${project.domain}</span>
            <span class="mini-tag" style="color: var(--brand-cyan-light);">Domain: ${project.category.toUpperCase()}</span>
          </div>

          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">Architecture & Capability Overview</h4>
          <p style="font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.5rem;">
            ${project.fullDesc}
          </p>

          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">Key Architectural Highlights</h4>
          <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.75rem; color: var(--text-secondary);">
            ${project.highlights.map(h => `<li style="margin-bottom: 0.5rem; line-height: 1.5;">${h}</li>`).join("")}
          </ul>

          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">Specified Technology Stack</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${project.technologies.map(t => `<span class="tech-tag" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${t}</span>`).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
            <button class="btn btn-secondary btn-sm" onclick="ModalController.close()">Close</button>
            <a href="#contact" class="btn btn-primary btn-sm" onclick="ModalController.close()">Inquire Technical Implementation</a>
          </div>
        </div>
      `;
    }

    this.open("project-details-modal");
  },

  showArticle(articleId) {
    const article = portfolioData.articles.find(a => a.id === articleId);
    if (!article) return;

    const modalBody = document.getElementById("article-modal-body");
    const modalTitle = document.getElementById("article-modal-title");

    if (modalTitle) modalTitle.textContent = article.title;

    if (modalBody) {
      // Basic markdown conversion for paragraphs, headings, and code blocks
      let formattedContent = article.content
        .replace(/### (.*)/g, '<h3 style="font-size: 1.3rem; margin: 1.5rem 0 0.75rem 0; color: var(--text-primary);">$1</h3>')
        .replace(/#### (.*)/g, '<h4 style="font-size: 1.1rem; margin: 1.25rem 0 0.5rem 0; color: var(--brand-cyan-light);">$1</h4>')
        .replace(/```([a-z]+)?\n([\s\S]*?)```/g, '<pre style="background: #090D16; border: 1px solid var(--border-medium); border-radius: 8px; padding: 1.25rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.85rem; color: #38BDF8; margin: 1rem 0;"><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code style="background: rgba(56, 189, 248, 0.1); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); color: #38BDF8;">$1</code>')
        .replace(/\n\n/g, '<br/><br/>');

      modalBody.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
            <span class="section-tag" style="margin-bottom: 0;">${article.category}</span>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">${article.readTime} • By Alexi Dhungel</span>
          </div>
          <div style="font-size: 1.02rem; line-height: 1.8; color: var(--text-secondary);">
            ${formattedContent}
          </div>
          <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.9rem; color: var(--text-muted);">Published under <strong>Code With Alexi</strong></span>
            <button class="btn btn-secondary btn-sm" onclick="ModalController.close()">Close Article</button>
          </div>
        </div>
      `;
    }

    this.open("article-reader-modal");
  },

  showCvModal() {
    const modalBody = document.getElementById("cv-modal-body");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="cv-viewer-container">
        <!-- Header -->
        <div class="cv-header-block">
          <div class="cv-header-layout">
            <img src="assets/images/alexi-dhungel.jpg" alt="${portfolioData.personal.name}" class="cv-avatar-photo" />
            <div class="cv-header-main">
              <h2>${portfolioData.personal.name}</h2>
              <div class="cv-titles">${portfolioData.personal.titles.join(" • ")}</div>
              <div class="cv-contact-row">
                <span>📍 Kathmandu, Nepal</span>
                <span>📧 <a href="mailto:${portfolioData.personal.email}">${portfolioData.personal.email}</a></span>
                <span>🔗 <a href="${portfolioData.personal.linkedin}" target="_blank" rel="noopener">LinkedIn</a></span>
                <span>⚡ <strong>Code With Alexi</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="cv-section-title">Professional Summary</div>
        <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.25rem;">
          ${portfolioData.personal.bioLong}
        </p>

        <!-- Professional Experience -->
        <div class="cv-section-title">Professional Experience</div>
        ${portfolioData.experience.map(exp => `
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 0.25rem;">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${exp.role}</h4>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--brand-cyan-light); font-weight: 600;">${exp.period}</span>
            </div>
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--brand-cyan-light); margin-bottom: 0.5rem;">
              ${exp.company} — ${exp.location}
            </div>
            <ul style="list-style-type: disc; margin-left: 1.25rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.5rem;">
              ${exp.highlights.map(h => `<li>${h}</li>`).join("")}
            </ul>
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">
              <strong>Core Tech:</strong> ${exp.technologies.join(" • ")}
            </div>
          </div>
        `).join("")}

        <!-- Teaching & Mentoring -->
        <div class="cv-section-title">Instruction & Mentoring Specializations</div>
        ${portfolioData.teaching.map(t => `
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <strong style="color: var(--text-primary); font-size: 0.98rem;">${t.expertise}</strong>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--brand-cyan-light);">${t.period}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--brand-cyan-light); margin-bottom: 0.25rem;">${t.subject}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">
              <strong>Curriculum:</strong> ${t.topics.join(", ")}
            </div>
          </div>
        `).join("")}

        <!-- Technical Competencies -->
        <div class="cv-section-title">Technical Competencies</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem; margin-bottom: 1.25rem;">
          <div><strong>Languages:</strong> Java, C#, .NET, JavaScript, T-SQL</div>
          <div><strong>Web & APIs:</strong> ASP.NET, Web API, REST, HTML5, CSS3</div>
          <div><strong>Databases:</strong> MS SQL Server, MySQL, SQLite, Stored Procedures</div>
          <div><strong>Banking Tech:</strong> Dynamic QR, Smart QR, Switch Integrations, SSA</div>
          <div><strong>Security:</strong> OAuth2, JWT, 2FA, AES-256, HMAC Signing</div>
          <div><strong>Methodologies:</strong> Agile, Scrum, System Architecture, ETL</div>
        </div>

        <!-- Education & Credentials -->
        <div class="cv-section-title">Education & Credentials</div>
        ${portfolioData.education.map(edu => `
          <div style="margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <strong style="color: var(--text-primary); font-size: 0.95rem;">${edu.degree}</strong>
              <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">${edu.period}</span>
            </div>
            <div style="font-size: 0.88rem; color: var(--brand-cyan-light);">${edu.field}</div>
            <div style="font-size: 0.84rem; color: var(--text-secondary);">${edu.description}</div>
          </div>
        `).join("")}

        <!-- CV Actions -->
        <div class="no-print" style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
          <button class="btn btn-secondary btn-sm" onclick="ModalController.close()">Close</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    `;

    this.open("cv-viewer-modal");
  }
};

// Global Listeners for Modal Closing
document.addEventListener("DOMContentLoaded", () => {
  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ModalController.activeModal) {
      ModalController.close();
    }
  });

  // Close on overlay backdrop click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        ModalController.close();
      }
    });
  });
});
