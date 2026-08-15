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
