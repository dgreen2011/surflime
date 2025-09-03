// Global config for Surf Lime
// Percentages are from TOP (0) to BOTTOM (1) of the canvas.
// Adds desktop + mobile scaling for mascot & obstacles, with safe fallbacks.
// Loads before index.html and overrides values on mobile so no index changes are required.

(function () {
  // ---- Helpers ----
  const IS_MOBILE = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
  const savedMascot = localStorage.getItem('selectedMascot') || "Lime";
  const savedScale = parseFloat(localStorage.getItem('mascotScale'));

  // ---- Config (edit values here) ----
  // Mobile values are deliberately LOWER than desktop values.
  const CONFIG = {
    mascot: {
      // Desktop base size (1.00 = original artwork size)
      scale: Number.isFinite(savedScale) ? savedScale : 0.60,
      // Mobile override (applied automatically on mobile)
      scaleMobile: 0.50,
      // Default mascot if none chosen yet
      selected: savedMascot
    },

    obstacle: {
      // Desktop: percent of native art size (100 = unchanged)
      scalePercent: 25,
      // Mobile: percent of native art size; intentionally smaller than desktop
      scalePercentMobile: 15
    },

    // Depth perception scaling (used by index.html for y-based size)
    // At TOP limit => topScale; at BOTTOM limit => bottomScale
    depth: {
      mascot:   { topScale: 0.90, bottomScale: 1.10 },
      obstacle: { topScale: 0.90, bottomScale: 1.20 }
    },

    // Vertical movement limits as a fraction of canvas height
    limits: {
      topPercent: 0.25,
      bottomPercent: 0.80
    },

    // Per-level timing
    level: {
      seconds: 20  // seconds per level
    },

    // Movement / feel
    boost: {
      accel: 0.0016,      // how fast you accelerate when boosting
      decay: 0.0014,      // how quickly boost falls off when released
      pushStrength: 0.18, // lerp push for vertical movement
      moveLerp: 0.15      // general lerp factor for smoothing
    },

    // Collision tuning (fractions relative to canvas height)
    collision: {
      limeLowerZone: 0.83,
      obstacleLowerZone: 0.81
    },

    // Audio
    audio: {
      wavesVolume: 0.25
    }
  };

  // ---- Publish ----
  const CFG = (window.SURFLIME_CONFIG = CONFIG);

  // ---- Apply mobile overrides (NO index.html changes required) ----
  if (IS_MOBILE) {
    if (Number.isFinite(CFG.mascot.scaleMobile)) {
      CFG.mascot.scale = CFG.mascot.scaleMobile;
    }
    if (Number.isFinite(CFG.obstacle.scalePercentMobile)) {
      CFG.obstacle.scalePercent = CFG.obstacle.scalePercentMobile;
    }
  }

  // ---- Live-sync from Settings via localStorage (if user changes in another tab) ----
  window.addEventListener("storage", (e) => {
    if (e.key === "mascotScale") {
      const v = parseFloat(localStorage.getItem("mascotScale"));
      if (Number.isFinite(v)) window.SURFLIME_CONFIG.mascot.scale = v;
    }
    if (e.key === "selectedMascot") {
      const n = localStorage.getItem("selectedMascot");
      if (n) window.SURFLIME_CONFIG.mascot.selected = n;
    }
  });
})();
