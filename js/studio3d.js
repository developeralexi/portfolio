/**
 * FULL-PAGE INTERACTIVE 3D DEVELOPER STUDIO WORLD (Three.js WebGL)
 * Alexi Dhungel, Er. — Scroll-Driven Cinematic 3D Experience
 *
 * Scroll Camera Journey:
 *   01. Studio Overview     (0% - 14%)  — Establishing shot of the 3D developer workspace
 *   02. Walk to Desk        (14% - 30%) — Walking forward toward the table & ergonomic chair
 *   03. Sit on Chair        (30% - 46%) — Chair swivels & camera lowers into seated eye-level
 *   04. Coding Workspace    (46% - 66%) — Leaning in to dual live-code monitors & RGB keyboard
 *   05. FinTech Core Rack   (66% - 84%) — Panning to Enterprise Server Rack & 3D Hologram
 *   06. Executive Pullback  (84% - 100%)— Wide twilight shot of the illuminated studio
 *
 * Plus "Explore 3D" Cinema Mode: hides page cards and enables drag-to-orbit + scroll zoom!
 */

(function (window, document) {
  "use strict";

  class DeveloperStudio3D {
    constructor() {
      this.canvas = null;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.rafId = null;
      this.isDestroyed = false;
      this.isExploreMode = false;

      // Scroll & camera interpolation state
      this.scrollTarget = 0;
      this.scrollCurrent = 0;
      this.currentLookAt = null;
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // Free-Explore Orbit State
      this.orbit = {
        dragging: false,
        lastX: 0,
        lastY: 0,
        theta: 0.45,
        phi: 1.18,
        radius: 6.2,
        target: null
      };

      // Animated 3D references
      this.chairGroup = null;
      this.holoGroup = null;
      this.serverLeds = [];
      this.steamParticles = [];
      this.keycapGlowMesh = null;
      this.typingBarMeshes = [];
      this.ambientDust = null;
      this.mainScreenTex = null;
      this.mainScreenCtx = null;
      this.sideScreenTex = null;
      this.sideScreenCtx = null;
      this.lastScreenUpdate = 0;
      this.codeScrollOffset = 0;

      // Chapter metadata
      this.chapters = [
        { max: 0.14, num: "01", title: "Studio Overview" },
        { max: 0.30, num: "02", title: "Walking to Table" },
        { max: 0.46, num: "03", title: "Sitting on Chair" },
        { max: 0.66, num: "04", title: "Coding Workspace" },
        { max: 0.84, num: "05", title: "FinTech Server Core" },
        { max: 1.01, num: "06", title: "Connect Lounge" }
      ];

      // Bindings
      this._onScroll = this._handleScroll.bind(this);
      this._onResize = this._handleResize.bind(this);
      this._onMouseMove = this._handleMouseMove.bind(this);
      this._onPointerDown = this._handlePointerDown.bind(this);
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._onWheel = this._handleWheel.bind(this);
      this._onKeyDown = this._handleKeyDown.bind(this);
      this._animate = this._animate.bind(this);
    }

    init() {
      try {
        // Respect reduced motion
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        // Require Three.js
        if (typeof window.THREE === "undefined") {
          console.warn("[DeveloperStudio3D] Three.js not loaded; skipping 3D studio.");
          return;
        }

        const THREE = window.THREE;
        this.THREE = THREE;

        this._setupRenderer();
        this._setupSceneAndLights();
        this._buildStudioRoom();
        this._buildDeskAndWorkstation();
        this._buildErgonomicChair();
        this._buildFinTechServerRack();
        this._buildHologramCluster();
        this._buildAmbientParticles();
        this._setupCameraCurves();
        this._mountHUD();
        this._bindEvents();

        this._handleScroll();
        this.scrollCurrent = this.scrollTarget;
        document.documentElement.classList.add("studio3d-ready");

        this.clock = new THREE.Clock();
        this.rafId = requestAnimationFrame(this._animate);
      } catch (err) {
        console.warn("[DeveloperStudio3D] WebGL fallback:", err);
      }
    }

    /* ========================================================================
       1. RENDERER, SCENE & CINEMATIC LIGHTING
       ======================================================================== */
    _setupRenderer() {
      const THREE = this.THREE;
      this.canvas = document.createElement("canvas");
      this.canvas.id = "studio-3d-canvas";
      this.canvas.setAttribute("aria-hidden", "true");
      document.body.prepend(this.canvas);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.18;
    }

    _setupSceneAndLights() {
      const THREE = this.THREE;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x050816);
      this.scene.fog = new THREE.FogExp2(0x050816, 0.048);

      this.camera = new THREE.PerspectiveCamera(
        48,
        window.innerWidth / window.innerHeight,
        0.1,
        60
      );
      this.currentLookAt = new THREE.Vector3(0, 1.35, 0);
      this.orbit.target = new THREE.Vector3(0, 1.25, -0.3);

      // Soft ambient hemisphere light
      const hemi = new THREE.HemisphereLight(0x7dd3fc, 0x0b1024, 0.65);
      this.scene.add(hemi);

      // Warm architectural desk lamp key light
      const deskSpot = new THREE.SpotLight(0xffdca8, 3.2, 12, Math.PI / 3.2, 0.55, 1.4);
      deskSpot.position.set(1.65, 2.75, 0.45);
      deskSpot.target.position.set(0.1, 0.9, -0.4);
      deskSpot.castShadow = true;
      deskSpot.shadow.mapSize.width = 1024;
      deskSpot.shadow.mapSize.height = 1024;
      deskSpot.shadow.bias = -0.0005;
      this.scene.add(deskSpot);
      this.scene.add(deskSpot.target);

      // Electric cyan monitor screen glow bounce
      const screenGlow = new THREE.PointLight(0x00e5ff, 2.4, 8, 1.6);
      screenGlow.position.set(0, 1.55, -0.15);
      this.scene.add(screenGlow);

      // Purple rim light from behind desk & server rack
      const purpleRim = new THREE.PointLight(0x8b5cf6, 2.6, 11, 1.5);
      purpleRim.position.set(-2.4, 2.2, -1.6);
      this.scene.add(purpleRim);

      // FinTech Server Rack emerald-cyan accent light
      const rackLight = new THREE.PointLight(0x00c2ff, 2.2, 9, 1.6);
      rackLight.position.set(3.2, 1.9, -0.8);
      this.scene.add(rackLight);
    }

    /* ========================================================================
       2. ARCHITECTURAL 3D STUDIO ROOM
       ======================================================================== */
    _buildStudioRoom() {
      const THREE = this.THREE;

      // Reflective obsidian studio floor
      const floorGeo = new THREE.PlaneGeometry(34, 34);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x070b18,
        roughness: 0.36,
        metalness: 0.32
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.scene.add(floor);

      // Subtle glowing blueprint floor grid
      const grid = new THREE.GridHelper(28, 36, 0x00c2ff, 0x111c3a);
      grid.position.y = 0.005;
      grid.material.opacity = 0.22;
      grid.material.transparent = true;
      this.scene.add(grid);

      // Under-desk woven studio rug
      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 0.025, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x0e162b, roughness: 0.92, metalness: 0.05 })
      );
      rug.position.set(0.1, 0.014, 0.35);
      rug.receiveShadow = true;
      this.scene.add(rug);

      // Back architectural wall with acoustic slat panels
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x090f22, roughness: 0.82, metalness: 0.12 });
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 6.5, 0.25), wallMat);
      backWall.position.set(0, 3.25, -2.35);
      backWall.receiveShadow = true;
      this.scene.add(backWall);

      // Acoustic wood/charcoal vertical wall slats behind desk
      const slatMat = new THREE.MeshStandardMaterial({ color: 0x161f38, roughness: 0.65, metalness: 0.25 });
      for (let i = -14; i <= 14; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.11, 4.6, 0.06), slatMat);
        slat.position.set(i * 0.24, 2.35, -2.2);
        this.scene.add(slat);
      }

      // Horizontal LED light bar mounted on back wall
      const wallLed = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 0.045, 0.05),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff })
      );
      wallLed.position.set(0, 2.75, -2.14);
      this.scene.add(wallLed);

      // Floating wall shelf with minimal tech decor
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.06, 0.32),
        new THREE.MeshStandardMaterial({ color: 0x1c253b, roughness: 0.5, metalness: 0.3 })
      );
      shelf.position.set(-0.3, 2.95, -2.02);
      shelf.castShadow = true;
      this.scene.add(shelf);
    }

    /* ========================================================================
       3. DEVELOPER DESK, DUAL LIVE-CODE MONITORS, RGB KEYBOARD & COFFEE MUG
       ======================================================================== */
    _buildDeskAndWorkstation() {
      const THREE = this.THREE;
      const deskGroup = new THREE.Group();
      this.scene.add(deskGroup);

      // Desktop slab (dark walnut / obsidian matte)
      const topMat = new THREE.MeshStandardMaterial({
        color: 0x181f33,
        roughness: 0.38,
        metalness: 0.24
      });
      const tabletop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.09, 1.35), topMat);
      tabletop.position.set(0, 0.92, -0.55);
      tabletop.castShadow = true;
      tabletop.receiveShadow = true;
      deskGroup.add(tabletop);

      // Under-desk neon LED trim strip
      const deskLed = new THREE.Mesh(
        new THREE.BoxGeometry(3.16, 0.02, 0.03),
        new THREE.MeshBasicMaterial({ color: 0x00c2ff })
      );
      deskLed.position.set(0, 0.87, -1.21);
      deskGroup.add(deskLed);

      // Matte black steel legs (standing desk frame)
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0d1220, roughness: 0.45, metalness: 0.78 });
      [-1.38, 1.38].forEach(x => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.88, 0.12), legMat);
        pillar.position.set(x, 0.44, -0.55);
        pillar.castShadow = true;
        deskGroup.add(pillar);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 1.05), legMat);
        foot.position.set(x, 0.025, -0.55);
        deskGroup.add(foot);
      });

      // Extended desk mat
      const deskMat = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, 0.012, 0.62),
        new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.9, metalness: 0.05 })
      );
      deskMat.position.set(0.05, 0.972, -0.28);
      deskMat.receiveShadow = true;
      deskGroup.add(deskMat);

      // --- MAIN ULTRAWIDE MONITOR (with live animated code CanvasTexture) ---
      const mainCanvas = document.createElement("canvas");
      mainCanvas.width = 1024;
      mainCanvas.height = 512;
      this.mainScreenCtx = mainCanvas.getContext("2d");
      this.mainScreenTex = new THREE.CanvasTexture(mainCanvas);
      this.mainScreenTex.minFilter = THREE.LinearFilter;

      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0c111e, roughness: 0.35, metalness: 0.7 });
      const mainMonitor = new THREE.Group();
      mainMonitor.position.set(0.08, 1.48, -0.92);

      // Monitor back housing
      const mainFrame = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.72, 0.05), bezelMat);
      mainFrame.castShadow = true;
      mainMonitor.add(mainFrame);

      // Glowing live screen surface
      const mainScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.54, 0.65),
        new THREE.MeshBasicMaterial({ map: this.mainScreenTex })
      );
      mainScreen.position.z = 0.028;
      mainMonitor.add(mainScreen);

      // Monitor stand neck & base
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.36, 0.06), legMat);
      neck.position.set(0, -0.34, -0.04);
      mainMonitor.add(neck);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.28), legMat);
      base.position.set(0, -0.51, 0.02);
      mainMonitor.add(base);
      deskGroup.add(mainMonitor);

      // --- SECONDARY VERTICAL CODE MONITOR (Left angled) ---
      const sideCanvas = document.createElement("canvas");
      sideCanvas.width = 512;
      sideCanvas.height = 768;
      this.sideScreenCtx = sideCanvas.getContext("2d");
      this.sideScreenTex = new THREE.CanvasTexture(sideCanvas);
      this.sideScreenTex.minFilter = THREE.LinearFilter;

      const sideMonitor = new THREE.Group();
      sideMonitor.position.set(-1.05, 1.52, -0.76);
      sideMonitor.rotation.y = 0.42;

      const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.86, 0.045), bezelMat);
      sideFrame.castShadow = true;
      sideMonitor.add(sideFrame);

      const sideScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.51, 0.8),
        new THREE.MeshBasicMaterial({ map: this.sideScreenTex })
      );
      sideScreen.position.z = 0.026;
      sideMonitor.add(sideScreen);

      const sideNeck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.05), legMat);
      sideNeck.position.set(0, -0.36, -0.04);
      sideMonitor.add(sideNeck);
      deskGroup.add(sideMonitor);

      // --- MECHANICAL RGB KEYBOARD ---
      const kbGroup = new THREE.Group();
      kbGroup.position.set(0.0, 0.99, -0.24);
      kbGroup.rotation.x = 0.06;

      const kbBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.028, 0.23),
        new THREE.MeshStandardMaterial({ color: 0x111829, roughness: 0.4, metalness: 0.6 })
      );
      kbBody.castShadow = true;
      kbGroup.add(kbBody);

      // Glowing RGB underglow plate
      this.keycapGlowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.64, 0.19),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.55 })
      );
      this.keycapGlowMesh.rotation.x = -Math.PI / 2;
      this.keycapGlowMesh.position.y = 0.015;
      kbGroup.add(this.keycapGlowMesh);

      // Keycap rows (animated subtle typing ripples)
      const keyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.3 });
      for (let row = 0; row < 4; row++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.015, 0.032), keyMat);
        bar.position.set(0, 0.022, -0.065 + row * 0.044);
        kbGroup.add(bar);
        this.typingBarMeshes.push(bar);
      }
      deskGroup.add(kbGroup);

      // --- ERGONOMIC WIRELESS MOUSE ---
      const mouseMesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.038, 0.055, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0x141c2e, roughness: 0.35, metalness: 0.5 })
      );
      mouseMesh.rotation.x = Math.PI / 2;
      mouseMesh.scale.set(1, 1, 0.58);
      mouseMesh.position.set(0.56, 0.995, -0.23);
      deskGroup.add(mouseMesh);

      // --- ARCHITECTURAL DESK LAMP (Right) ---
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.03, 24), legMat);
      lampBase.position.set(1.24, 0.98, -0.82);
      deskGroup.add(lampBase);

      const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.65, 12), legMat);
      lampArm.position.set(1.24, 1.3, -0.82);
      lampArm.rotation.z = 0.22;
      deskGroup.add(lampArm);

      const lampHead = new THREE.Mesh(
        new THREE.ConeGeometry(0.11, 0.16, 20),
        new THREE.MeshStandardMaterial({ color: 0x182238, roughness: 0.35, metalness: 0.7 })
      );
      lampHead.position.set(1.13, 1.6, -0.78);
      lampHead.rotation.z = 0.55;
      deskGroup.add(lampHead);

      const lampBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffe4b5 })
      );
      lampBulb.position.set(1.1, 1.54, -0.76);
      deskGroup.add(lampBulb);

      // --- COFFEE MUG WITH ANIMATED 3D STEAM ---
      const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.048, 0.12, 20),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.1 })
      );
      mug.position.set(0.95, 1.025, -0.25);
      mug.castShadow = true;
      deskGroup.add(mug);

      const coffeeTop = new THREE.Mesh(
        new THREE.CircleGeometry(0.048, 16),
        new THREE.MeshBasicMaterial({ color: 0x2a1810 })
      );
      coffeeTop.rotation.x = -Math.PI / 2;
      coffeeTop.position.set(0.95, 1.086, -0.25);
      deskGroup.add(coffeeTop);

      // Steam wisps
      for (let i = 0; i < 6; i++) {
        const wisp = new THREE.Mesh(
          new THREE.SphereGeometry(0.018 + i * 0.003, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 })
        );
        wisp.position.set(0.95, 1.12 + i * 0.05, -0.25);
        wisp.userData = { baseY: 1.12, offset: i * 0.45 };
        deskGroup.add(wisp);
        this.steamParticles.push(wisp);
      }

      // Draw initial live code frames
      this._updateCodeScreens(0);
    }

    /* ========================================================================
       4. ERGONOMIC DEVELOPER CHAIR (ANIMATES & SWIVELS ON SCROLL)
       ======================================================================== */
    _buildErgonomicChair() {
      const THREE = this.THREE;
      const chair = new THREE.Group();
      chair.position.set(0.05, 0, 0.62);
      chair.rotation.y = Math.PI + 0.28; // slightly angled welcomingly at start

      const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.88 });
      const leatherMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.55, metalness: 0.18 });
      const accentMat = new THREE.MeshStandardMaterial({
        color: 0x00c2ff,
        emissive: 0x0077aa,
        emissiveIntensity: 0.5,
        roughness: 0.35
      });

      // 5-star caster base
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.032, 0.36), chromeMat);
        spoke.position.set(Math.sin(angle) * 0.18, 0.07, Math.cos(angle) * 0.18);
        spoke.rotation.y = angle;
        chair.add(spoke);

        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), leatherMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(Math.sin(angle) * 0.34, 0.032, Math.cos(angle) * 0.34);
        chair.add(wheel);
      }

      // Gas lift cylinder
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.042, 0.42, 16), chromeMat);
      piston.position.y = 0.29;
      chair.add(piston);

      // Seat cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.09, 0.58), leatherMat);
      seat.position.set(0, 0.54, 0);
      seat.castShadow = true;
      chair.add(seat);

      // Backrest spine & contoured mesh/leather back
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.78, 0.08), leatherMat);
      backrest.position.set(0, 0.98, -0.27);
      backrest.rotation.x = -0.1;
      backrest.castShadow = true;
      chair.add(backrest);

      // Subtle cyan accent stripe on backrest
      const backAccent = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.09), accentMat);
      backAccent.position.set(0, 1.24, -0.29);
      chair.add(backAccent);

      // Headrest
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.07), leatherMat);
      headrest.position.set(0, 1.46, -0.3);
      chair.add(headrest);

      // Armrests
      [-0.35, 0.35].forEach(x => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.05), chromeMat);
        post.position.set(x, 0.66, -0.02);
        chair.add(post);

        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.34), leatherMat);
        pad.position.set(x, 0.79, 0.02);
        chair.add(pad);
      });

      this.chairGroup = chair;
      this.scene.add(chair);
    }

    /* ========================================================================
       5. ENTERPRISE FINTECH SERVER RACK (RIGHT SIDE OF STUDIO)
       ======================================================================== */
    _buildFinTechServerRack() {
      const THREE = this.THREE;
      const rack = new THREE.Group();
      rack.position.set(3.25, 0, -1.25);
      rack.rotation.y = -0.38;

      const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.4, metalness: 0.78 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.55, 0.92), cabinetMat);
      body.position.y = 1.275;
      body.castShadow = true;
      body.receiveShadow = true;
      rack.add(body);

      // Server blades & blinking status LEDs
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x151e34, roughness: 0.45, metalness: 0.6 });
      const ledColors = [0x00f5ff, 0x10b981, 0x8b5cf6, 0x00c2ff];

      for (let i = 0; i < 8; i++) {
        const y = 0.42 + i * 0.25;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.17, 0.04), bladeMat);
        blade.position.set(0, y, 0.465);
        rack.add(blade);

        for (let l = 0; l < 4; l++) {
          const led = new THREE.Mesh(
            new THREE.BoxGeometry(0.038, 0.024, 0.02),
            new THREE.MeshBasicMaterial({ color: ledColors[(i + l) % ledColors.length] })
          );
          led.position.set(-0.32 + l * 0.09, y, 0.49);
          led.userData = { phase: i * 0.7 + l * 1.3 };
          rack.add(led);
          this.serverLeds.push(led);
        }
      }

      // Glowing vertical side rails on rack
      [-0.51, 0.51].forEach(x => {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 2.45, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x00c2ff })
        );
        rail.position.set(x, 1.28, 0.47);
        rack.add(rail);
      });

      this.scene.add(rack);
    }

    /* ========================================================================
       6. FLOATING 3D HOLOGRAPHIC FINTECH & AI ARCHITECTURE CLUSTER
       ======================================================================== */
    _buildHologramCluster() {
      const THREE = this.THREE;
      const holo = new THREE.Group();
      holo.position.set(2.15, 2.05, -0.55);

      // Translucent faceted geodesic core
      const coreMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.32, 1),
        new THREE.MeshPhysicalMaterial({
          color: 0x00c2ff,
          emissive: 0x005588,
          emissiveIntensity: 0.65,
          roughness: 0.15,
          metalness: 0.2,
          transparent: true,
          opacity: 0.45,
          wireframe: false
        })
      );
      holo.add(coreMesh);

      const wireMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.34, 1),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.6 })
      );
      holo.add(wireMesh);

      // Dual orbital data rings
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.52, 0.008, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.72 })
      );
      ring1.rotation.x = Math.PI / 2.6;
      holo.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.64, 0.007, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.65 })
      );
      ring2.rotation.y = Math.PI / 3;
      ring2.rotation.x = -Math.PI / 3.2;
      holo.add(ring2);

      this.holoGroup = holo;
      this.holoRing1 = ring1;
      this.holoRing2 = ring2;
      this.scene.add(holo);
    }

    /* ========================================================================
       7. AMBIENT 3D FLOATING STUDIO PARTICLES
       ======================================================================== */
    _buildAmbientParticles() {
      const THREE = this.THREE;
      const count = window.innerWidth < 768 ? 90 : 180;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = Math.random() * 4.8 + 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x00f5ff,
        size: 0.035,
        transparent: true,
        opacity: 0.55
      });

      this.ambientDust = new THREE.Points(geo, mat);
      this.scene.add(this.ambientDust);
    }

    /* ========================================================================
       8. LIVE ANIMATED CODE SCREENS (CanvasTexture)
       ======================================================================== */
    _updateCodeScreens(elapsed) {
      // Main ultrawide code editor texture
      if (this.mainScreenCtx && this.mainScreenTex) {
        const ctx = this.mainScreenCtx;
        const w = 1024, h = 512;

        ctx.fillStyle = "#060b18";
        ctx.fillRect(0, 0, w, h);

        // Top IDE window bar
        ctx.fillStyle = "#0d162a";
        ctx.fillRect(0, 0, w, 34);
        ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((c, idx) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(22 + idx * 20, 17, 6, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 14px monospace";
        ctx.fillText("PaymentSwitchEngine.cs — Alexi Dhungel FinTech Core", 100, 22);

        // Left sidebar file tree
        ctx.fillStyle = "#091022";
        ctx.fillRect(0, 34, 180, h - 34);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "13px monospace";
        ["▸ Core.Switch", "  ISO8583Parser.cs", "  DynamicQR.java", "  AuditRecon.sql", "▸ AI.Gateway", "  NeuralRouter.ts"].forEach((f, i) => {
          ctx.fillStyle = i === 1 ? "#00f5ff" : "#64748b";
          ctx.fillText(f, 16, 68 + i * 28);
        });

        // Scrolling live syntax-highlighted code
        const lines = [
          { c: "#8b5cf6", t: "namespace Enterprise.FinTech.Switch {" },
          { c: "#00c2ff", t: "  [Service] [Transactional(IsolationLevel.Serializable)]" },
          { c: "#e2e8f0", t: "  public class PaymentGatewayOrchestrator : ISwitchCore {" },
          { c: "#38bdf8", t: "    public async Task<SettlementAck> RouteAsync(Iso8583Frame frame) {" },
          { c: "#94a3b8", t: "      // Verify HSM AES-256-GCM cryptographic payload signature" },
          { c: "#10b981", t: "      await _hsmVault.VerifySignatureAsync(frame.MacDigest);" },
          { c: "#e2e8f0", t: "      var ledgerLock = await _sqlCore.AcquireLedgerLock(frame.RefId);" },
          { c: "#00f5ff", t: "      var qrSettlement = DynamicQR.BuildEmvPayload(frame.Amount);" },
          { c: "#8b5cf6", t: "      return new SettlementAck(200, \"SETTLED\", latencyMs: 11.4);" },
          { c: "#e2e8f0", t: "    }" },
          { c: "#10b981", t: "    // ✔ 45,000 req/sec | 99.99% SLA | Zero-Discrepancy Audit" },
          { c: "#8b5cf6", t: "  }" },
          { c: "#8b5cf6", t: "}" }
        ];

        ctx.font = "17px monospace";
        const activeLine = Math.floor(elapsed * 2.2) % lines.length;
        for (let i = 0; i < lines.length; i++) {
          const y = 76 + i * 31;
          if (i === activeLine) {
            ctx.fillStyle = "rgba(0, 245, 255, 0.09)";
            ctx.fillRect(184, y - 20, w - 196, 26);
          }
          ctx.fillStyle = "#475569";
          ctx.fillText(String(i + 1).padStart(2, "0"), 196, y);

          ctx.fillStyle = lines[i].c;
          ctx.fillText(lines[i].t, 232, y);

          // Blinking cursor on active line
          if (i === activeLine && Math.floor(elapsed * 3) % 2 === 0) {
            const tw = ctx.measureText(lines[i].t).width;
            ctx.fillStyle = "#00f5ff";
            ctx.fillRect(236 + tw, y - 15, 9, 19);
          }
        }

        // Bottom status bar
        ctx.fillStyle = "#00c2ff";
        ctx.fillRect(0, h - 24, w, 24);
        ctx.fillStyle = "#050816";
        ctx.font = "bold 12px monospace";
        ctx.fillText("  MAIN*  |  TLS 1.3  |  LATENCY: 11ms  |  BUILD: PASSING  |  ALEXI DHUNGEL, Er.", 12, h - 8);

        this.mainScreenTex.needsUpdate = true;
      }

      // Secondary vertical terminal & telemetry monitor
      if (this.sideScreenCtx && this.sideScreenTex) {
        const ctx = this.sideScreenCtx;
        const w = 512, h = 768;

        ctx.fillStyle = "#050915";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#00f5ff";
        ctx.font = "bold 20px monospace";
        ctx.fillText("SYS.TELEMETRY // LIVE", 28, 52);

        // Animated waveform / throughput bars
        for (let b = 0; b < 14; b++) {
          const val = 0.35 + 0.6 * Math.abs(Math.sin(elapsed * 2.1 + b * 0.55));
          const bh = val * 165;
          ctx.fillStyle = b % 3 === 0 ? "#8b5cf6" : "#00c2ff";
          ctx.fillRect(32 + b * 32, 260 - bh, 20, bh);
        }

        // Live terminal stream
        ctx.font = "16px monospace";
        const logs = [
          "[OK] ISO-8583 Switch Connected",
          "[OK] HikariCP Pool: 25/25 Ready",
          "[OK] Dynamic QR Gateway Active",
          "[OK] AES-256 HSM Key Rotated",
          "[OK] SQL Ledger Sync: 0.00 Diff",
          "[OK] Neural Inference: 8.2ms",
          "[OK] Zero-Trust mTLS Verified",
          ">_ Awaiting next deployment..."
        ];
        logs.forEach((msg, i) => {
          ctx.fillStyle = i === logs.length - 1 ? "#00f5ff" : "#10b981";
          ctx.fillText(msg, 28, 330 + i * 44);
        });

        this.sideScreenTex.needsUpdate = true;
      }
    }

    /* ========================================================================
       9. SCROLL-DRIVEN 3D CAMERA JOURNEY (WALK -> SIT ON CHAIR -> CODE -> RACK)
       ======================================================================== */
    _setupCameraCurves() {
      const THREE = this.THREE;

      // Camera Position Spline:
      // 1) Wide studio overview across the room
      // 2) Walking forward toward desk & chair
      // 3) Approaching behind chair & lowering to seated height
      // 4) Seated at chair, leaning in to code on dual monitors
      // 5) Gliding right to inspect FinTech Server Rack & 3D Hologram
      // 6) Pulling back to executive twilight lounge view
      this.cameraPosCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.6, 2.35, 5.1),   // 0.00 — Studio Entrance Overview
        new THREE.Vector3(-0.95, 1.85, 3.15), // 0.20 — Walking toward the table
        new THREE.Vector3(0.08, 1.52, 1.55),  // 0.38 — Behind chair, lowering to sit
        new THREE.Vector3(0.06, 1.46, 0.58),  // 0.56 — Seated on chair, coding close-up!
        new THREE.Vector3(1.55, 1.75, 1.85),  // 0.78 — Inspecting FinTech Server Rack & Hologram
        new THREE.Vector3(2.85, 2.45, 4.75)   // 1.00 — Executive Studio Pullback
      ]);

      // Camera LookAt Target Spline:
      this.cameraLookCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.15, 1.25, -0.55), // 0.00 — Look at whole desk & room
        new THREE.Vector3(0.05, 1.18, -0.45), // 0.20 — Focus on desk & chair
        new THREE.Vector3(0.05, 1.38, -0.82), // 0.38 — Align with monitor as sitting
        new THREE.Vector3(0.02, 1.44, -0.95), // 0.56 — Locked onto code screen & keyboard
        new THREE.Vector3(2.65, 1.65, -0.95), // 0.78 — Focus on Server Rack & 3D Hologram
        new THREE.Vector3(0.35, 1.35, -0.65)  // 1.00 — Wide balanced room framing
      ]);
    }

    /* ========================================================================
       10. 3D CAMERA CHAPTER HUD & EXPLORE MODE
       ======================================================================== */
    _mountHUD() {
      const hud = document.createElement("div");
      hud.className = "studio3d-hud";
      hud.id = "studio3d-hud";
      hud.innerHTML = `
        <span class="studio3d-hud-dot" aria-hidden="true"></span>
        <div class="studio3d-chapter-info">
          <div class="studio3d-chapter-label" id="studio3d-chapter-label"><span>01</span>Studio Overview</div>
          <div class="studio3d-progress-track">
            <div class="studio3d-progress-fill" id="studio3d-progress-fill"></div>
          </div>
        </div>
        <button type="button" class="studio3d-btn" id="studio3d-explore-btn" title="Hide page cards and freely orbit the 3D developer studio">
          3D Explore
        </button>
      `;
      document.body.appendChild(hud);

      const hint = document.createElement("div");
      hint.className = "studio3d-explore-hint";
      hint.textContent = "3D STUDIO EXPLORE MODE — Drag to rotate camera • Scroll to zoom • Press Esc to return";
      document.body.appendChild(hint);

      this.chapterLabelEl = hud.querySelector("#studio3d-chapter-label");
      this.progressFillEl = hud.querySelector("#studio3d-progress-fill");
      this.exploreBtnEl = hud.querySelector("#studio3d-explore-btn");

      this.exploreBtnEl.addEventListener("click", () => this.toggleExploreMode());
    }

    toggleExploreMode(forceState) {
      const next = typeof forceState === "boolean" ? forceState : !this.isExploreMode;
      this.isExploreMode = next;
      document.documentElement.classList.toggle("studio3d-explore", next);

      if (this.exploreBtnEl) {
        this.exploreBtnEl.classList.toggle("is-active", next);
        this.exploreBtnEl.textContent = next ? "Exit 3D" : "3D Explore";
      }

      if (next) {
        // Initialize orbit angles cleanly from current camera position
        const offset = this.camera.position.clone().sub(this.orbit.target);
        this.orbit.radius = Math.max(2.2, Math.min(9.5, offset.length()));
        this.orbit.theta = Math.atan2(offset.x, offset.z);
        this.orbit.phi = Math.acos(Math.max(-0.95, Math.min(0.95, offset.y / this.orbit.radius)));
      }
    }

    /* ========================================================================
       11. ANIMATION LOOP (60 FPS)
       ======================================================================== */
    _animate() {
      if (this.isDestroyed) return;

      const elapsed = this.clock.getElapsedTime();

      // Smooth scroll damping
      this.scrollCurrent += (this.scrollTarget - this.scrollCurrent) * 0.065;
      const t = Math.max(0, Math.min(1, this.scrollCurrent));

      // Smooth mouse parallax
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

      if (this.isExploreMode) {
        // Free Orbit Camera
        const sinPhi = Math.sin(this.orbit.phi);
        const cx = this.orbit.target.x + this.orbit.radius * sinPhi * Math.sin(this.orbit.theta);
        const cy = this.orbit.target.y + this.orbit.radius * Math.cos(this.orbit.phi);
        const cz = this.orbit.target.z + this.orbit.radius * sinPhi * Math.cos(this.orbit.theta);
        this.camera.position.lerp(new this.THREE.Vector3(cx, Math.max(0.45, cy), cz), 0.14);
        this.camera.lookAt(this.orbit.target);
      } else {
        // Scroll-driven Cinematic Camera Path
        const pos = this.cameraPosCurve.getPointAt(t);
        const look = this.cameraLookCurve.getPointAt(t);

        // Subtle walking footstep bob during "Walk to Table" chapter (0.14 - 0.32)
        let walkBob = 0;
        if (t > 0.12 && t < 0.34) {
          const walkIntensity = Math.sin(((t - 0.12) / 0.22) * Math.PI);
          walkBob = Math.sin(t * 75) * 0.035 * walkIntensity;
        }

        // Apply subtle mouse look-around parallax
        this.camera.position.set(
          pos.x + this.mouse.x * 0.22,
          pos.y + walkBob - this.mouse.y * 0.14,
          pos.z
        );
        this.currentLookAt.lerp(look, 0.12);
        this.camera.lookAt(this.currentLookAt);
      }

      // Animate Chair swivel: welcomes visitor, then aligns cleanly with desk when sitting/coding
      if (this.chairGroup) {
        const sitFactor = Math.max(0, Math.min(1, (t - 0.18) / 0.26));
        const targetRot = Math.PI + 0.28 * (1 - sitFactor) + Math.sin(elapsed * 0.5) * 0.025;
        this.chairGroup.rotation.y += (targetRot - this.chairGroup.rotation.y) * 0.08;
        // Tuck chair slightly closer to desk while coding
        const targetZ = 0.62 - sitFactor * 0.18;
        this.chairGroup.position.z += (targetZ - this.chairGroup.position.z) * 0.08;
      }

      // Animate RGB keyboard typing shimmer (intensifies during Coding Workspace chapter)
      const isCodingZone = t > 0.36 && t < 0.72;
      if (this.keycapGlowMesh) {
        const pulse = isCodingZone ? 0.65 + 0.3 * Math.sin(elapsed * 7) : 0.4 + 0.15 * Math.sin(elapsed * 2.2);
        this.keycapGlowMesh.material.opacity = pulse;
      }
      if (this.typingBarMeshes.length > 0 && isCodingZone) {
        for (let i = 0; i < this.typingBarMeshes.length; i++) {
          const press = Math.max(0, Math.sin(elapsed * 14 + i * 1.9)) * 0.004;
          this.typingBarMeshes[i].position.y = 0.022 - press;
        }
      }

      // Animate Coffee Steam wisps
      for (let i = 0; i < this.steamParticles.length; i++) {
        const w = this.steamParticles[i];
        const cycle = (elapsed * 0.45 + w.userData.offset) % 1;
        w.position.y = w.userData.baseY + cycle * 0.28;
        w.position.x = 0.95 + Math.sin(elapsed * 2 + w.userData.offset) * 0.018;
        w.material.opacity = Math.sin(cycle * Math.PI) * 0.18;
      }

      // Animate FinTech Hologram Cluster
      if (this.holoGroup) {
        this.holoGroup.rotation.y = elapsed * 0.45;
        this.holoGroup.position.y = 2.05 + Math.sin(elapsed * 1.6) * 0.08;
        if (this.holoRing1) this.holoRing1.rotation.z = elapsed * 0.9;
        if (this.holoRing2) this.holoRing2.rotation.z = -elapsed * 0.7;
      }

      // Animate Server Rack LEDs
      for (let i = 0; i < this.serverLeds.length; i++) {
        const led = this.serverLeds[i];
        const on = Math.sin(elapsed * 4.2 + led.userData.phase) > -0.25;
        led.visible = on;
      }

      // Gently drift ambient 3D particles
      if (this.ambientDust) {
        this.ambientDust.rotation.y = elapsed * 0.025;
      }

      // Refresh live code monitor textures (~10 FPS for crisp animation & low CPU)
      if (elapsed - this.lastScreenUpdate > 0.11) {
        this._updateCodeScreens(elapsed);
        this.lastScreenUpdate = elapsed;
      }

      // Update HUD chapter & progress bar
      this._updateHUD(t);

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(this._animate);
    }

    _updateHUD(t) {
      if (this.progressFillEl) {
        this.progressFillEl.style.width = `${(t * 100).toFixed(1)}%`;
      }
      if (this.chapterLabelEl) {
        const chap = this.chapters.find(c => t <= c.max) || this.chapters[this.chapters.length - 1];
        const nextText = this.isExploreMode
          ? `<span>3D</span>Free Explore`
          : `<span>${chap.num}</span>${chap.title}`;
        if (this.chapterLabelEl.innerHTML !== nextText) {
          this.chapterLabelEl.innerHTML = nextText;
        }
      }
    }

    /* ========================================================================
       12. EVENTS & INTERACTION
       ======================================================================== */
    _bindEvents() {
      window.addEventListener("scroll", this._onScroll, { passive: true });
      window.addEventListener("resize", this._onResize, { passive: true });
      window.addEventListener("mousemove", this._onMouseMove, { passive: true });
      window.addEventListener("keydown", this._onKeyDown);

      this.canvas.addEventListener("pointerdown", this._onPointerDown);
      window.addEventListener("pointermove", this._onPointerMove, { passive: true });
      window.addEventListener("pointerup", this._onPointerUp);
      this.canvas.addEventListener("wheel", this._onWheel, { passive: false });
    }

    _handleScroll() {
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.scrollTarget = Math.max(0, Math.min(1, window.scrollY / docHeight));
    }

    _handleResize() {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _handleMouseMove(e) {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    _handlePointerDown(e) {
      if (!this.isExploreMode) return;
      this.orbit.dragging = true;
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;
    }

    _handlePointerMove(e) {
      if (!this.isExploreMode || !this.orbit.dragging) return;
      const dx = e.clientX - this.orbit.lastX;
      const dy = e.clientY - this.orbit.lastY;
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;

      this.orbit.theta -= dx * 0.007;
      this.orbit.phi = Math.max(0.32, Math.min(1.48, this.orbit.phi - dy * 0.006));
    }

    _handlePointerUp() {
      this.orbit.dragging = false;
    }

    _handleWheel(e) {
      if (!this.isExploreMode) return;
      e.preventDefault();
      this.orbit.radius = Math.max(1.8, Math.min(9.5, this.orbit.radius + e.deltaY * 0.004));
    }

    _handleKeyDown(e) {
      if (e.key === "Escape" && this.isExploreMode) {
        this.toggleExploreMode(false);
      }
    }
  }

  window.DeveloperStudio3D = DeveloperStudio3D;

  function bootStudio3D() {
    if (window.__studio3DInstance) return;
    window.__studio3DInstance = new DeveloperStudio3D();
    window.__studio3DInstance.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootStudio3D, { once: true });
  } else {
    bootStudio3D();
  }
})(window, document);
