/**
 * CINEMATIC PAGE-LOADING ENGINE (Awwwards-Grade Portfolio Preloader)
 * Alexi Dhungel, Er. — Software Engineer | Digital Innovator
 *
 * Reusable, zero-dependency, 60 FPS GPU-friendly loading orchestration:
 *   Phase 1 — Digital Awakening (Deep navy backdrop, particle & network mesh, floating code)
 *   Phase 2 — Developer Identity Reveal (Letter-by-letter typography + 3D geodesic sphere)
 *   Phase 3 — Code Initialization (Sequential terminal typing boot sequence)
 *   Phase 4 — Progress Visualization (Circular SVG gauge + orbiting spark + 0–100% counter)
 *   Phase 5 — Cinematic Website Reveal (Smooth zoom/dissolve + staggered hero entrance)
 */

(function (window, document) {
  "use strict";

  const DEFAULT_CONFIG = {
    developerName: "ALEXI DHUNGEL",
    designationLeft: "SOFTWARE ENGINEER",
    designationRight: "DIGITAL INNOVATOR",
    telemetryLabel: "SYS.CORE // FINTECH • AI • ARCHITECTURE",
    minDurationMs: 2850,
    maxWaitMs: 6500,
    bootMessages: [
      "Initializing developer environment...",
      "Loading software architecture...",
      "Connecting digital ecosystem...",
      "Initializing FinTech solutions...",
      "Loading portfolio modules..."
    ],
    floatingSnippets: [
      { html: '<span class="pl-kw">async</span> Task&lt;Settlement&gt; <span class="pl-fn">CommitAsync</span>()', top: "12%", left: "6%", dx: "12px", dy: "-14px", dur: "9s", delay: "0s" },
      { html: 'ISO8583.<span class="pl-fn">route</span>(MT_0200, HSM.sign())', top: "22%", right: "6%", dx: "-14px", dy: "10px", dur: "10s", delay: "0.6s" },
      { html: '<span class="pl-kw">@Transactional</span>(SERIALIZABLE)', top: "74%", left: "5%", dx: "10px", dy: "-10px", dur: "11s", delay: "1.1s", hideMobile: true },
      { html: '<span class="pl-kw">const</span> mesh = <span class="pl-kw">await</span> AI.<span class="pl-fn">synthesize</span>(ctx)', top: "78%", right: "6%", dx: "-12px", dy: "-12px", dur: "8.5s", delay: "0.3s", hideMobile: true },
      { html: 'TLS_1_3 // AES-256-GCM // ZERO_TRUST', top: "48%", left: "3%", dx: "8px", dy: "12px", dur: "12s", delay: "0.9s", hideMobile: true },
      { html: '<span class="pl-kw">SELECT</span> * <span class="pl-kw">FROM</span> CORE_LEDGER <span class="pl-kw">WITH</span> (NOLOCK)', top: "45%", right: "3%", dx: "-10px", dy: "-8px", dur: "10.5s", delay: "1.4s", hideMobile: true }
    ]
  };

  class CinematicPreloader {
    constructor(userConfig = {}) {
      this.config = Object.assign({}, DEFAULT_CONFIG, userConfig);
      this.el = null;
      this.networkCanvas = null;
      this.networkCtx = null;
      this.sphereCanvas = null;
      this.sphereCtx = null;
      this.rafId = null;
      this.isDestroyed = false;
      this.isExiting = false;
      this.timers = [];
      this.particles = [];
      this.pulses = [];
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.progress = 0;
      this.targetProgress = 0;
      this.pageLoaded = document.readyState === "complete";
      this.startTime = performance.now();
      this.ringCircumference = 2 * Math.PI * 98; // r = 98 in 214x214 viewBox

      // Bound handlers for clean removal
      this._onResize = this._handleResize.bind(this);
      this._onMouseMove = this._handleMouseMove.bind(this);
      this._onWindowLoad = this._handleWindowLoad.bind(this);
      this._onKeyDown = this._handleKeyDown.bind(this);
    }

    /**
     * Resolve developer identity from CMS / portfolioData if customized,
     * falling back cleanly to the configured default.
     */
    _resolveIdentity() {
      try {
        const saved = localStorage.getItem("cms_portfolio_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          const rawName = parsed?.heroBanner?.name || parsed?.personal?.name;
          if (rawName && typeof rawName === "string") {
            const clean = rawName.replace(/,\s*Er\.?$/i, "").trim();
            if (clean) this.config.developerName = clean.toUpperCase();
          }
        }
      } catch (_) {
        // Ignore storage errors and use default identity
      }
    }

    /**
     * Determine whether preloader should run on this load.
     * - Respects prefers-reduced-motion
     * - Skips when directly opening secret CMS admin hashes (#admin / #cms / #studio)
     */
    shouldRun() {
      const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return false;

      const hash = (window.location.hash || "").toLowerCase();
      if (hash === "#admin" || hash === "#cms" || hash === "#studio") return false;

      return true;
    }

    start() {
      try {
        if (!this.shouldRun()) {
          this._releaseImmediately();
          return;
        }

        this._resolveIdentity();
        document.documentElement.classList.add("preloader-active");

        this._mountDOM();
        this._initNetworkCanvas();
        this._initSphereGeometry();
        this._bindListeners();

        // Phase 1: Digital Awakening
        requestAnimationFrame(() => {
          if (this.el) this.el.classList.add("phase-1");
        });

        // Phase 2: Developer Identity & 3D Sphere Reveal
        this._schedule(() => {
          if (this.el) this.el.classList.add("phase-2");
        }, 260);

        // Phase 3: Code Initialization Terminal Sequence
        this._schedule(() => {
          if (this.el) this.el.classList.add("phase-3");
          this._runBootSequence();
        }, 620);

        // Failsafe: never block the site if an unexpected error occurs
        this._schedule(() => {
          if (!this.isExiting && !this.isDestroyed) {
            this.complete();
          }
        }, this.config.maxWaitMs);

        // Start unified 60 FPS animation loop (particles + 3D sphere + progress gauge)
        this._tick = this._tick.bind(this);
        this.rafId = requestAnimationFrame(this._tick);
      } catch (err) {
        console.warn("[CinematicPreloader] Fallback release:", err);
        this._releaseImmediately();
      }
    }

    _releaseImmediately() {
      document.documentElement.classList.remove("preloader-active", "preloader-revealing");
      if (this.el && this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.isDestroyed = true;
      window.dispatchEvent(new CustomEvent("preloader:complete"));
    }

    _schedule(fn, delayMs) {
      const id = setTimeout(() => {
        if (!this.isDestroyed) fn();
      }, delayMs);
      this.timers.push(id);
      return id;
    }

    _mountDOM() {
      const existing = document.getElementById("cinematic-preloader");
      if (existing) existing.remove();

      const wrapper = document.createElement("div");
      wrapper.id = "cinematic-preloader";
      wrapper.className = "cinematic-preloader";
      wrapper.setAttribute("role", "status");
      wrapper.setAttribute("aria-live", "polite");
      wrapper.setAttribute("aria-label", "Loading portfolio experience");

      // Build letter-by-letter spans for Developer Name
      const nameCharsHtml = this.config.developerName
        .split("")
        .map((ch, idx) => {
          const isSpace = ch === " ";
          const delay = 140 + idx * 38;
          return `<span class="pl-char${isSpace ? " is-space" : ""}" style="--char-delay:${delay}ms">${isSpace ? "&nbsp;" : this._escapeHtml(ch)}</span>`;
        })
        .join("");

      // Build floating code snippets
      const snippetsHtml = this.config.floatingSnippets
        .map(s => {
          const pos = [
            s.top ? `top:${s.top}` : "",
            s.bottom ? `bottom:${s.bottom}` : "",
            s.left ? `left:${s.left}` : "",
            s.right ? `right:${s.right}` : "",
            `--dx:${s.dx || "10px"}`,
            `--dy:${s.dy || "-10px"}`,
            `--float-dur:${s.dur || "9s"}`,
            `--float-delay:${s.delay || "0s"}`
          ].filter(Boolean).join(";");

          return `<div class="pl-code-snippet" style="${pos}"${s.hideMobile ? ' data-hide-mobile="true"' : ""}>${s.html}</div>`;
        })
        .join("");

      wrapper.innerHTML = `
        <canvas class="pl-network-canvas" id="pl-network-canvas" aria-hidden="true"></canvas>

        <div class="pl-code-field" aria-hidden="true">
          ${snippetsHtml}
        </div>

        <div class="pl-stage">
          <div class="pl-core-hub">
            <div class="pl-core-halo" aria-hidden="true"></div>
            <div class="pl-outer-orbit" aria-hidden="true"></div>

            <svg class="pl-progress-svg" viewBox="0 0 214 214" aria-hidden="true">
              <defs>
                <linearGradient id="pl-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00C2FF" />
                  <stop offset="52%" stop-color="#00F5FF" />
                  <stop offset="100%" stop-color="#8B5CF6" />
                </linearGradient>
              </defs>
              <circle class="pl-progress-ticks" cx="107" cy="107" r="103"></circle>
              <circle class="pl-progress-track" cx="107" cy="107" r="98"></circle>
              <circle
                class="pl-progress-ring"
                id="pl-progress-ring"
                cx="107"
                cy="107"
                r="98"
                stroke-dasharray="${this.ringCircumference.toFixed(2)}"
                stroke-dashoffset="${this.ringCircumference.toFixed(2)}"
              ></circle>
            </svg>

            <div class="pl-progress-spark" id="pl-progress-spark" aria-hidden="true"></div>
            <canvas class="pl-sphere-canvas" id="pl-sphere-canvas" aria-hidden="true"></canvas>

            <div class="pl-percent-pill" aria-label="Loading progress">
              <span class="pl-percent-value" id="pl-percent-value">0</span>
              <span class="pl-percent-unit">%</span>
            </div>
          </div>

          <div class="pl-identity">
            <div class="pl-name">${nameCharsHtml}</div>
            <div class="pl-divider" aria-hidden="true"></div>
            <div class="pl-role">
              <span>${this._escapeHtml(this.config.designationLeft)}</span>
              <span class="pl-role-sep">|</span>
              <span>${this._escapeHtml(this.config.designationRight)}</span>
            </div>
          </div>

          <div class="pl-terminal">
            <div class="pl-terminal-bar">
              <span>boot://portfolio.runtime</span>
              <span class="pl-terminal-status">
                <span class="pl-status-dot"></span>
                <span id="pl-terminal-phase">INITIALIZING</span>
              </span>
            </div>
            <div class="pl-log-list" id="pl-log-list"></div>
          </div>
        </div>

        <div class="pl-footer">
          <span>${this._escapeHtml(this.config.telemetryLabel)}</span>
          <button type="button" class="pl-skip-btn" id="pl-skip-btn" aria-label="Skip loading animation">Skip &rarr;</button>
        </div>
      `;

      document.body.prepend(wrapper);
      this.el = wrapper;
      this.networkCanvas = wrapper.querySelector("#pl-network-canvas");
      this.sphereCanvas = wrapper.querySelector("#pl-sphere-canvas");
      this.ringEl = wrapper.querySelector("#pl-progress-ring");
      this.sparkEl = wrapper.querySelector("#pl-progress-spark");
      this.percentEl = wrapper.querySelector("#pl-percent-value");
      this.logListEl = wrapper.querySelector("#pl-log-list");
      this.phaseLabelEl = wrapper.querySelector("#pl-terminal-phase");

      const skipBtn = wrapper.querySelector("#pl-skip-btn");
      if (skipBtn) {
        skipBtn.addEventListener("click", () => this.complete());
      }
    }

    _escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    /* ========================================================================
       BACKGROUND DIGITAL PARTICLE & NETWORK GRAPH ENGINE
       ======================================================================== */
    _initNetworkCanvas() {
      if (!this.networkCanvas) return;
      this.networkCtx = this.networkCanvas.getContext("2d", { alpha: true });
      this._resizeCanvases();
      this._seedParticles();
    }

    _resizeCanvases() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (this.networkCanvas) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.netWidth = w;
        this.netHeight = h;
        this.networkCanvas.width = Math.floor(w * dpr);
        this.networkCanvas.height = Math.floor(h * dpr);
        if (this.networkCtx) {
          this.networkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }

      if (this.sphereCanvas) {
        const rect = this.sphereCanvas.getBoundingClientRect();
        const size = Math.max(rect.width || 224, 140);
        this.sphereSize = size;
        this.sphereCanvas.width = Math.floor(size * dpr);
        this.sphereCanvas.height = Math.floor(size * dpr);
        this.sphereCtx = this.sphereCanvas.getContext("2d", { alpha: true });
        if (this.sphereCtx) {
          this.sphereCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
    }

    _seedParticles() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 42 : 84;
      this.particles = [];
      const palette = ["#00C2FF", "#00F5FF", "#8B5CF6", "#FFFFFF"];

      for (let i = 0; i < count; i++) {
        // True 3D space coordinates centered around viewport
        this.particles.push({
          x: (Math.random() - 0.5) * this.netWidth * 1.45,
          y: (Math.random() - 0.5) * this.netHeight * 1.45,
          z: Math.random() * 900 + 120,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          vz: -(Math.random() * 0.75 + 0.35),
          r: Math.random() * 1.9 + 0.85,
          color: palette[i % palette.length],
          alpha: Math.random() * 0.5 + 0.38,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    _renderNetwork(now) {
      const ctx = this.networkCtx;
      if (!ctx) return;

      const w = this.netWidth;
      const h = this.netHeight;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const fov = 560;

      ctx.clearRect(0, 0, w, h);

      // Smooth 3D camera inertia from mouse
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.055;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.055;

      const camShiftX = this.mouse.x * 5.5;
      const camShiftY = this.mouse.y * 5.5;

      const pts = this.particles;
      const len = pts.length;
      const projected = new Array(len);

      // Update & project 3D particles with perspective depth
      for (let i = 0; i < len; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z < 90) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * w * 1.45;
          p.y = (Math.random() - 0.5) * h * 1.45;
        }

        const scale = fov / p.z;
        const sx = cx + (p.x - camShiftX) * scale;
        const sy = cy + (p.y - camShiftY) * scale;
        const depthFade = Math.max(0.08, Math.min(1, 1 - (p.z - 120) / 920));

        projected[i] = { sx, sy, scale, depthFade, p };
      }

      // Draw depth-aware network mesh connections
      const maxDist = w < 768 ? 115 : 155;
      const maxDistSq = maxDist * maxDist;
      ctx.lineWidth = 0.85;

      for (let i = 0; i < len; i++) {
        const a = projected[i];
        if (a.sx < -40 || a.sx > w + 40 || a.sy < -40 || a.sy > h + 40) continue;
        for (let j = i + 1; j < len; j++) {
          const b = projected[j];
          // Connect nodes that are also close in Z depth for true 3D structure
          if (Math.abs(a.p.z - b.p.z) > 220) continue;

          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const ratio = 1 - Math.sqrt(distSq) / maxDist;
            const depthAlpha = Math.min(a.depthFade, b.depthFade);
            const alpha = ratio * depthAlpha * 0.28;
            ctx.strokeStyle = `rgba(0, 194, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();

            // Occasional glowing data pulse traveling along a 3D edge
            if ((i + j) % 19 === 0 && ratio > 0.35) {
              const t = ((now * 0.0006 + (i * 0.17)) % 1);
              const px = a.sx + (b.sx - a.sx) * t;
              const py = a.sy + (b.sy - a.sy) * t;
              ctx.fillStyle = `rgba(0, 245, 255, ${(alpha * 2.4).toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.35 * Math.min(a.scale, 1.6), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw 3D depth-scaled glowing particles
      for (let i = 0; i < len; i++) {
        const item = projected[i];
        const { sx, sy, scale, depthFade, p } = item;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

        const pulse = 0.78 + 0.22 * Math.sin(now * 0.003 + p.phase);
        const radius = Math.max(0.7, Math.min(3.8, p.r * scale * 0.85));

        ctx.globalAlpha = p.alpha * depthFade * pulse;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* ========================================================================
       REALISTIC 3D SHADED GEODESIC CORE + VOLUMETRIC GYROSCOPE RINGS
       (Frequency-2 Subdivided Icosahedron: 42 Vertices, 80 Shaded Facets,
        True Z-Sorted Painter's Algorithm, Phong + Fresnel Lighting,
        Inner Refracted Crystal Core, and Front/Back Split 3D Orbital Rings)
       ======================================================================== */
    _initSphereGeometry() {
      const phi = (1 + Math.sqrt(5)) / 2;
      const baseVerts = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
      ].map(([x, y, z]) => {
        const m = Math.hypot(x, y, z);
        return { x: x / m, y: y / m, z: z / m };
      });

      const baseFaces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];

      // Subdivide once -> 42 vertices, 80 geodesic triangular facets
      const verts = baseVerts.slice();
      const midCache = new Map();

      const getMidpoint = (i1, i2) => {
        const key = i1 < i2 ? `${i1}_${i2}` : `${i2}_${i1}`;
        if (midCache.has(key)) return midCache.get(key);
        const a = verts[i1];
        const b = verts[i2];
        const mx = (a.x + b.x) * 0.5;
        const my = (a.y + b.y) * 0.5;
        const mz = (a.z + b.z) * 0.5;
        const m = Math.hypot(mx, my, mz);
        const idx = verts.length;
        verts.push({ x: mx / m, y: my / m, z: mz / m });
        midCache.set(key, idx);
        return idx;
      };

      const faces = [];
      for (let i = 0; i < baseFaces.length; i++) {
        const [a, b, c] = baseFaces[i];
        const ab = getMidpoint(a, b);
        const bc = getMidpoint(b, c);
        const ca = getMidpoint(c, a);
        faces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
      }

      this.sphereVerts = verts;
      this.sphereFaces = faces;

      // Inner counter-rotating octahedron crystal core
      this.coreVerts = [
        { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
        { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
      ];
      this.coreFaces = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
        [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]
      ];

      // 3D Orbital gyroscope ring configurations
      this.gyroRings = [
        { radiusMult: 1.28, tiltX: 1.12, tiltZ: 0.35, speed: 0.0012, color: [0, 245, 255], satCount: 2 },
        { radiusMult: 1.40, tiltX: -0.95, tiltZ: -0.58, speed: -0.0009, color: [139, 92, 246], satCount: 2 },
        { radiusMult: 1.18, tiltX: 0.42, tiltZ: 1.22, speed: 0.00155, color: [0, 194, 255], satCount: 1 }
      ];
    }

    _rotate3D(x, y, z, ax, ay, az) {
      // Rotate Y
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      let x1 = x * cosY - z * sinY;
      let z1 = z * cosY + x * sinY;
      let y1 = y;
      // Rotate X
      const cosX = Math.cos(ax), sinX = Math.sin(ax);
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = z1 * cosX + y1 * sinX;
      let x2 = x1;
      // Rotate Z
      if (az) {
        const cosZ = Math.cos(az), sinZ = Math.sin(az);
        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = y2 * cosZ + x2 * sinZ;
        return { x: x3, y: y3, z: z2 };
      }
      return { x: x2, y: y2, z: z2 };
    }

    _drawGyroRingsLayer(ctx, cx, cy, baseRadius, now, frontOnly, camPitch, camYaw) {
      const segments = 56;
      const fov = 3.2;

      for (let rIdx = 0; rIdx < this.gyroRings.length; rIdx++) {
        const ring = this.gyroRings[rIdx];
        const r = baseRadius * ring.radiusMult;
        const spin = now * ring.speed;
        const [cr, cg, cb] = ring.color;

        const pts = [];
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const lx = Math.cos(theta) * r;
          const ly = Math.sin(theta) * r;
          const lz = 0;

          // Apply ring tilt + subtle camera inertia
          const rot = this._rotate3D(
            lx, ly, lz,
            ring.tiltX + camPitch * 0.45,
            spin + camYaw * 0.45,
            ring.tiltZ
          );
          const normZ = rot.z / baseRadius;
          const persp = fov / (fov - normZ);
          pts.push({
            x: cx + rot.x * persp,
            y: cy + rot.y * persp,
            z: normZ,
            persp
          });
        }

        // Draw only back (z < 0) or front (z >= 0) half for true 3D occlusion
        for (let s = 0; s < segments; s++) {
          const a = pts[s];
          const b = pts[s + 1];
          const avgZ = (a.z + b.z) * 0.5;
          const isFront = avgZ >= 0;
          if (isFront !== frontOnly) continue;

          const depthAlpha = frontOnly
            ? Math.min(0.82, 0.34 + avgZ * 0.36)
            : Math.max(0.08, 0.24 + avgZ * 0.14);

          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${depthAlpha.toFixed(3)})`;
          ctx.lineWidth = frontOnly ? 1.55 : 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // Draw orbiting glowing 3D satellites on this ring
        for (let sat = 0; sat < ring.satCount; sat++) {
          const satAngle = now * ring.speed * 2.2 + (sat * Math.PI);
          const lx = Math.cos(satAngle) * r;
          const ly = Math.sin(satAngle) * r;
          const rot = this._rotate3D(
            lx, ly, 0,
            ring.tiltX + camPitch * 0.45,
            spin + camYaw * 0.45,
            ring.tiltZ
          );
          const normZ = rot.z / baseRadius;
          if ((normZ >= 0) !== frontOnly) continue;

          const persp = fov / (fov - normZ);
          const sx = cx + rot.x * persp;
          const sy = cy + rot.y * persp;
          const dotR = (frontOnly ? 2.6 : 1.7) * persp;

          // Glow halo
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, dotR * 3.4);
          glow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          glow.addColorStop(0.35, `rgba(${cr}, ${cg}, ${cb}, 0.75)`);
          glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, dotR * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    _renderSphere(now) {
      const ctx = this.sphereCtx;
      if (!ctx || !this.sphereVerts) return;

      const size = this.sphereSize || 224;
      const cx = size * 0.5;
      const cy = size * 0.5;
      const radius = size * 0.285;
      const fov = 3.2;

      ctx.clearRect(0, 0, size, size);

      const camYaw = this.mouse.x * 0.025;
      const camPitch = this.mouse.y * 0.025;
      const rotY = now * 0.00072 + camYaw;
      const rotX = now * 0.00044 + camPitch + 0.22;

      // 1. Draw BACK halves of 3D orbital gyroscope rings (occluded behind sphere)
      this._drawGyroRingsLayer(ctx, cx, cy, radius, now, false, camPitch, camYaw);

      // 2. Soft volumetric atmosphere sphere glow
      const atmo = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius * 1.32);
      atmo.addColorStop(0, "rgba(0, 245, 255, 0.22)");
      atmo.addColorStop(0.55, "rgba(0, 194, 255, 0.10)");
      atmo.addColorStop(0.85, "rgba(139, 92, 246, 0.06)");
      atmo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
      ctx.fill();

      // 3. Transform & project outer geodesic vertices
      const transformed = this.sphereVerts.map(v => {
        const r = this._rotate3D(v.x, v.y, v.z, rotX, rotY, 0);
        const persp = fov / (fov - r.z);
        return {
          x3: r.x,
          y3: r.y,
          z3: r.z,
          sx: cx + r.x * radius * persp,
          sy: cy + r.y * radius * persp,
          persp
        };
      });

      // Key light (top-left-front) & Rim light (bottom-right-back)
      const light1 = { x: -0.48, y: -0.62, z: 0.62 };
      const light2 = { x: 0.68, y: 0.52, z: -0.52 };
      const halfVec = { x: -0.28, y: -0.36, z: 0.89 };

      // Build Z-sorted facet list
      const backFacets = [];
      const frontFacets = [];

      for (let i = 0; i < this.sphereFaces.length; i++) {
        const [ia, ib, ic] = this.sphereFaces[i];
        const a = transformed[ia];
        const b = transformed[ib];
        const c = transformed[ic];

        // Face normal via cross product
        const ux = b.x3 - a.x3, uy = b.y3 - a.y3, uz = b.z3 - a.z3;
        const vx = c.x3 - a.x3, vy = c.y3 - a.y3, vz = c.z3 - a.z3;
        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        nx /= nLen; ny /= nLen; nz /= nLen;

        // Ensure outward normal on unit sphere
        const avgX = (a.x3 + b.x3 + c.x3) / 3;
        const avgY = (a.y3 + b.y3 + c.y3) / 3;
        const avgZ = (a.z3 + b.z3 + c.z3) / 3;
        if (nx * avgX + ny * avgY + nz * avgZ < 0) {
          nx = -nx; ny = -ny; nz = -nz;
        }

        const facet = { a, b, c, nx, ny, nz, avgZ };
        if (nz < 0) {
          backFacets.push(facet);
        } else {
          frontFacets.push(facet);
        }
      }

      // 4. Draw subtle translucent back-facing shell (for glass depth)
      backFacets.sort((u, v) => u.avgZ - v.avgZ);
      ctx.lineWidth = 0.55;
      for (let i = 0; i < backFacets.length; i++) {
        const f = backFacets[i];
        ctx.beginPath();
        ctx.moveTo(f.a.sx, f.a.sy);
        ctx.lineTo(f.b.sx, f.b.sy);
        ctx.lineTo(f.c.sx, f.c.sy);
        ctx.closePath();
        ctx.fillStyle = "rgba(8, 16, 38, 0.22)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 194, 255, 0.08)";
        ctx.stroke();
      }

      // 5. Draw luminous counter-rotating 3D inner quantum crystal core
      const coreScale = radius * (0.42 + 0.04 * Math.sin(now * 0.004));
      const corePts = this.coreVerts.map(v => {
        const r = this._rotate3D(v.x, v.y, v.z, -rotX * 1.4, -rotY * 1.65, now * 0.0005);
        const persp = fov / (fov - r.z * 0.45);
        return {
          x3: r.x, y3: r.y, z3: r.z,
          sx: cx + r.x * coreScale * persp,
          sy: cy + r.y * coreScale * persp
        };
      });

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreScale * 1.35);
      coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.72)");
      coreGlow.addColorStop(0.28, "rgba(0, 245, 255, 0.55)");
      coreGlow.addColorStop(0.65, "rgba(139, 92, 246, 0.24)");
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreScale * 1.35, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < this.coreFaces.length; i++) {
        const [ia, ib, ic] = this.coreFaces[i];
        const a = corePts[ia], b = corePts[ib], c = corePts[ic];
        const avgZ = (a.z3 + b.z3 + c.z3) / 3;
        if (avgZ < -0.15) continue;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.lineTo(c.sx, c.sy);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 245, 255, ${(0.18 + avgZ * 0.24).toFixed(2)})`;
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 6. Draw front-facing Phong + Fresnel shaded crystal facets (back-to-front)
      frontFacets.sort((u, v) => u.avgZ - v.avgZ);
      for (let i = 0; i < frontFacets.length; i++) {
        const f = frontFacets[i];
        const diff1 = Math.max(0, f.nx * light1.x + f.ny * light1.y + f.nz * light1.z);
        const diff2 = Math.max(0, f.nx * light2.x + f.ny * light2.y + f.nz * light2.z);
        const spec = Math.pow(Math.max(0, f.nx * halfVec.x + f.ny * halfVec.y + f.nz * halfVec.z), 14);
        const fresnel = Math.pow(1 - Math.max(0, f.nz), 2.3);

        // Blend deep obsidian navy + electric blue key light + violet rim + white specular
        const rCol = Math.min(255, Math.round(10 + diff1 * 18 + diff2 * 125 + fresnel * 45 + spec * 210));
        const gCol = Math.min(255, Math.round(22 + diff1 * 165 + diff2 * 65 + fresnel * 185 + spec * 235));
        const bCol = Math.min(255, Math.round(52 + diff1 * 215 + diff2 * 195 + fresnel * 215 + spec * 245));
        const fillAlpha = Math.min(0.76, 0.26 + diff1 * 0.24 + fresnel * 0.28 + spec * 0.25);

        ctx.beginPath();
        ctx.moveTo(f.a.sx, f.a.sy);
        ctx.lineTo(f.b.sx, f.b.sy);
        ctx.lineTo(f.c.sx, f.c.sy);
        ctx.closePath();

        ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${fillAlpha.toFixed(3)})`;
        ctx.fill();

        // Crisp illuminated geodesic bevel edges
        const edgeAlpha = Math.min(0.92, 0.22 + fresnel * 0.55 + spec * 0.45);
        ctx.strokeStyle = `rgba(${Math.min(255, 80 + Math.round(spec * 175))}, ${Math.min(255, 225 + Math.round(spec * 30))}, 255, ${edgeAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.85 + fresnel * 0.45;
        ctx.stroke();
      }

      // 7. Draw luminous front vertex nodes on the geodesic shell
      for (let i = 0; i < transformed.length; i++) {
        const p = transformed[i];
        if (p.z3 < 0.05) continue;
        const alpha = Math.min(0.95, p.z3 * 0.85 + 0.15);
        const r = (1.35 + p.z3 * 0.9) * p.persp * 0.72;
        ctx.fillStyle = `rgba(210, 252, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. Subtle glass specular sheen on upper-left dome
      const sheen = ctx.createRadialGradient(
        cx - radius * 0.34,
        cy - radius * 0.36,
        radius * 0.05,
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.78
      );
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.28)");
      sheen.addColorStop(0.45, "rgba(0, 245, 255, 0.08)");
      sheen.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
      ctx.fill();

      // 9. Draw FRONT halves of 3D orbital gyroscope rings (passing in front of sphere)
      this._drawGyroRingsLayer(ctx, cx, cy, radius, now, true, camPitch, camYaw);
    }

    /* ========================================================================
       PHASE 3 — SEQUENTIAL TERMINAL BOOT TYPING
       ======================================================================== */
    _runBootSequence() {
      if (!this.logListEl) return;
      const messages = this.config.bootMessages;
      const totalTypingWindow = Math.max(1600, this.config.minDurationMs - 850);
      const stepDelay = Math.floor(totalTypingWindow / messages.length);

      let index = 0;

      const typeLine = () => {
        if (this.isDestroyed || this.isExiting || index >= messages.length) return;

        // Mark previous line complete
        const prev = this.logListEl.querySelector(".pl-log-line.is-typing");
        if (prev) {
          prev.classList.remove("is-typing");
          prev.classList.add("is-done");
          const oldCursor = prev.querySelector(".pl-log-cursor");
          if (oldCursor) oldCursor.remove();
        }

        const text = messages[index];
        const line = document.createElement("div");
        line.className = "pl-log-line is-typing";
        line.innerHTML = `
          <span class="pl-log-left">
            <span class="pl-log-prefix">&gt;</span>
            <span class="pl-log-text"></span><span class="pl-log-cursor"></span>
          </span>
          <span class="pl-log-badge">[OK]</span>
        `;
        this.logListEl.appendChild(line);

        const textEl = line.querySelector(".pl-log-text");
        const charInterval = Math.max(8, Math.min(18, Math.floor((stepDelay * 0.65) / text.length)));
        let charPos = 0;

        const typeChar = () => {
          if (this.isDestroyed || this.isExiting) return;
          charPos++;
          textEl.textContent = text.slice(0, charPos);
          if (charPos < text.length) {
            this._schedule(typeChar, charInterval);
          } else {
            index++;
            if (index < messages.length) {
              this._schedule(typeLine, Math.max(90, stepDelay - text.length * charInterval));
            } else {
              this._schedule(() => {
                line.classList.remove("is-typing");
                line.classList.add("is-done");
                const c = line.querySelector(".pl-log-cursor");
                if (c) c.remove();
                if (this.phaseLabelEl) this.phaseLabelEl.textContent = "SYSTEM READY";
              }, 160);
            }
          }
        };

        typeChar();
      };

      typeLine();
    }

    /* ========================================================================
       PHASE 4 — REAL-TIME PROGRESS & UNIFIED 60 FPS LOOP
       ======================================================================== */
    _tick(now) {
      if (this.isDestroyed) return;

      this._renderNetwork(now);
      this._renderSphere(now);

      // Compute smooth progress bounded by actual page readiness
      const elapsed = now - this.startTime;
      const timeFraction = Math.min(elapsed / this.config.minDurationMs, 1);

      // Ease-out cubic curve for organic visual pacing
      const easedTime = 1 - Math.pow(1 - timeFraction, 2.4);

      if (this.pageLoaded) {
        this.targetProgress = easedTime * 100;
      } else {
        // Never reach 100% until window load completes
        this.targetProgress = Math.min(92, easedTime * 92);
      }

      // Smooth interpolation toward target
      this.progress += (this.targetProgress - this.progress) * 0.14;
      if (this.pageLoaded && timeFraction >= 1 && this.progress > 99.1) {
        this.progress = 100;
      }

      this._updateProgressUI(this.progress);

      if (this.progress >= 100 && !this.isExiting) {
        this.complete();
        return;
      }

      this.rafId = requestAnimationFrame(this._tick);
    }

    _updateProgressUI(value) {
      const clamped = Math.max(0, Math.min(100, value));
      const rounded = Math.round(clamped);

      if (this.percentEl && this.percentEl.textContent !== String(rounded)) {
        this.percentEl.textContent = String(rounded);
      }

      if (this.ringEl) {
        const offset = this.ringCircumference * (1 - clamped / 100);
        this.ringEl.style.strokeDashoffset = offset.toFixed(2);
      }

      if (this.sparkEl) {
        const deg = (clamped / 100) * 360;
        this.sparkEl.style.transform = `rotate(${deg.toFixed(2)}deg)`;
      }
    }

    /* ========================================================================
       PHASE 5 — CINEMATIC WEBSITE REVEAL & CLEANUP
       ======================================================================== */
    complete() {
      if (this.isExiting || this.isDestroyed) return;
      this.isExiting = true;

      this._updateProgressUI(100);
      if (this.phaseLabelEl) this.phaseLabelEl.textContent = "SYSTEM READY";

      // Brief crystalline lock-in before smooth dissolve
      this._schedule(() => {
        if (this.el) this.el.classList.add("is-exiting");

        // Trigger staggered hero entrance simultaneously with dissolve
        document.documentElement.classList.remove("preloader-active");
        document.documentElement.classList.add("preloader-revealing");

        // Ensure hero .reveal elements are activated cleanly
        const heroReveals = document.querySelectorAll("#hero .reveal");
        heroReveals.forEach(el => el.classList.add("active"));

        window.dispatchEvent(new CustomEvent("preloader:complete"));

        // Remove preloader DOM after dissolve completes
        this._schedule(() => {
          this.destroy();
        }, 820);

        // Clean up temporary reveal choreography class after hero settles
        setTimeout(() => {
          document.documentElement.classList.remove("preloader-revealing");
        }, 1450);
      }, 170);
    }

    destroy() {
      if (this.isDestroyed) return;
      this.isDestroyed = true;

      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      this.timers.forEach(id => clearTimeout(id));
      this.timers = [];

      window.removeEventListener("resize", this._onResize);
      window.removeEventListener("mousemove", this._onMouseMove);
      window.removeEventListener("load", this._onWindowLoad);
      window.removeEventListener("keydown", this._onKeyDown);

      if (this.el && this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.el = null;
      this.networkCanvas = null;
      this.networkCtx = null;
      this.sphereCanvas = null;
      this.sphereCtx = null;
      this.particles = [];
    }

    /* ========================================================================
       EVENT LISTENERS
       ======================================================================== */
    _bindListeners() {
      window.addEventListener("resize", this._onResize, { passive: true });
      window.addEventListener("mousemove", this._onMouseMove, { passive: true });
      window.addEventListener("keydown", this._onKeyDown);
      if (!this.pageLoaded) {
        window.addEventListener("load", this._onWindowLoad, { once: true });
      }
    }

    _handleResize() {
      this._resizeCanvases();
      this._seedParticles();
    }

    _handleMouseMove(e) {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 14;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 14;
    }

    _handleWindowLoad() {
      this.pageLoaded = true;
    }

    _handleKeyDown(e) {
      if (e.key === "Escape") {
        this.complete();
      }
    }
  }

  // Expose reusable class globally
  window.CinematicPreloader = CinematicPreloader;

  // Auto-initialize cleanly as soon as DOM is ready
  function bootPreloader() {
    if (window.__preloaderInstance) return;
    window.__preloaderInstance = new CinematicPreloader();
    window.__preloaderInstance.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootPreloader, { once: true });
  } else {
    bootPreloader();
  }
})(window, document);
