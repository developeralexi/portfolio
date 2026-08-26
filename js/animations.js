/**
 * HIGH-PERFORMANCE INTERACTIVE ANIMATION ENGINE
 * Alexi Dhungel, Er. — Software Engineer Portfolio
 * 
 * Features:
 * 1. Interactive Magnetic Card Spotlight (Mouse-tracking glow)
 * 2. Smooth 3D Card Micro-Tilt Physics
 * 3. Animated Metric Counter Engine (Ease-out number roll)
 * 4. Cyber Scramble / Matrix Text Decryption Effect
 * 5. Timeline Electrical Signal Flow & Pulse Tracking
 * 6. Smooth Staggered Scroll Observer
 */

document.addEventListener("DOMContentLoaded", () => {
  initCardSpotlights();
  initCard3DTilt();
  initAnimatedCounters();
  initCyberTextScramble();
  initTimelineSignalEffect();
  initHeroRadarScan();
});

/* ==========================================================================
   1. MOUSE-TRACKING CARD SPOTLIGHT GLOW
   ========================================================================== */
function initCardSpotlights() {
  const cards = document.querySelectorAll(`
    .stat-card, 
    .expertise-card, 
    .project-card, 
    .timeline-card, 
    .teaching-card, 
    .article-card, 
    .skill-card, 
    .avatar-card-wrapper,
    .contact-card-box,
    .contact-form-card
  `);

  cards.forEach(card => {
    card.classList.add("spotlight-card");

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}
window.initCardSpotlights = initCardSpotlights;

/* ==========================================================================
   2. 3D CARD MICRO-TILT PHYSICS
   ========================================================================== */
function initCard3DTilt() {
  // Only apply on non-touch devices with large screens
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const tiltCards = document.querySelectorAll(`
    .expertise-card,
    .project-card,
    .teaching-card,
    .article-card,
    .stat-card,
    .avatar-card-wrapper
  `);

  tiltCards.forEach(card => {
    let bounds;

    function rotateToMouse(e) {
      bounds = card.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };

      const maxTilt = 4.5; // subtle, professional angle
      const rotateX = (center.y / (bounds.height / 2)) * -maxTilt;
      const rotateY = (center.x / (bounds.width / 2)) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    }

    card.addEventListener("mouseenter", () => {
      bounds = card.getBoundingClientRect();
      card.style.transition = "transform 0.12s ease-out, box-shadow 0.28s ease, border-color 0.28s ease";
    });

    card.addEventListener("mousemove", rotateToMouse);

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}
window.initCard3DTilt = initCard3DTilt;

/* ==========================================================================
   3. ANIMATED METRIC COUNTER ENGINE
   ========================================================================== */
function initAnimatedCounters() {
  const statValues = document.querySelectorAll(".stat-value, .metric-val");
  
  if (statValues.length === 0) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statValues.forEach(el => counterObserver.observe(el));

  function animateValue(elem) {
    const rawText = elem.textContent.trim();
    // Parse numeric portion and prefix/suffix
    const match = rawText.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1] || "";
    const targetNumber = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isDecimal = match[2].includes(".");
    const decimalPlaces = isDecimal ? match[2].split(".")[1].length : 0;

    const duration = 1600; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out expo formula
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = (targetNumber * easeProgress).toFixed(decimalPlaces);

      elem.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        elem.textContent = rawText; // restore exact original string
      }
    }

    requestAnimationFrame(updateCounter);
  }
}
window.initAnimatedCounters = initAnimatedCounters;

/* ==========================================================================
   4. CYBER SCRAMBLE TEXT DECRYPT EFFECT
   ========================================================================== */
const CYBER_CHARS = "0101<>#_/{}[];:!@$%&*ABCDEF";

function scrambleText(elem) {
  if (elem.dataset.scrambling === "true") return;
  elem.dataset.scrambling = "true";

  const originalText = elem.dataset.originalText || elem.textContent;
  elem.dataset.originalText = originalText;

  let iteration = 0;
  const maxIterations = originalText.length * 2;
  const interval = setInterval(() => {
    elem.textContent = originalText
      .split("")
      .map((char, index) => {
        if (char === " " || char === "•" || char === "—" || char === "/" || char === "|") return char;
        if (index < iteration / 2) {
          return originalText[index];
        }
        return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
      })
      .join("");

    iteration++;

    if (iteration >= maxIterations) {
      clearInterval(interval);
      elem.textContent = originalText;
      elem.dataset.scrambling = "false";
    }
  }, 30);
}

function initCyberTextScramble() {
  const scrambleElements = document.querySelectorAll(".section-tag, .engineer-badge, .brand-tag-badge");

  scrambleElements.forEach(el => {
    el.dataset.originalText = el.textContent.trim();
    
    el.addEventListener("mouseenter", () => {
      scrambleText(el);
    });
  });

  // Run initial brief scramble on hero badges
  setTimeout(() => {
    const heroBadges = document.querySelectorAll(".engineer-badge, .brand-tag-badge");
    heroBadges.forEach(badge => scrambleText(badge));
  }, 500);
}
window.initCyberTextScramble = initCyberTextScramble;

/* ==========================================================================
   5. TIMELINE ELECTRICAL SIGNAL IMPULSE
   ========================================================================== */
function initTimelineSignalEffect() {
  const timelineLine = document.querySelector(".timeline-line");
  if (!timelineLine) return;

  // Add the traveling electrical pulse indicator
  if (!timelineLine.querySelector(".timeline-electric-packet")) {
    const packet = document.createElement("div");
    packet.className = "timeline-electric-packet";
    timelineLine.appendChild(packet);
  }
}
window.initTimelineSignalEffect = initTimelineSignalEffect;

/* ==========================================================================
   6. HERO RADAR / SCANLINE BACKGROUND
   ========================================================================== */
function initHeroRadarScan() {
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  if (!heroSection.querySelector(".hero-scanline")) {
    const scanline = document.createElement("div");
    scanline.className = "hero-scanline";
    heroSection.appendChild(scanline);
  }
}
window.initHeroRadarScan = initHeroRadarScan;

/* ==========================================================================
   7. FLOATING SYNTAX CHIPS MOUSE PARALLAX
   ========================================================================== */
function initFloatingChipsParallax() {
  const heroVisual = document.querySelector(".hero-visual");
  const chips = document.querySelectorAll(".floating-syntax-chip");

  if (!heroVisual || chips.length === 0) return;

  heroVisual.addEventListener("mousemove", e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    chips.forEach((chip, i) => {
      const factor = (i + 1) * 12;
      chip.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  heroVisual.addEventListener("mouseleave", () => {
    chips.forEach(chip => {
      chip.style.transform = "translate(0px, 0px)";
    });
  });
}
window.initFloatingChipsParallax = initFloatingChipsParallax;

document.addEventListener("DOMContentLoaded", () => {
  initFloatingChipsParallax();
});
