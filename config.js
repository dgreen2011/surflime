// Global config for Surf Lime
// Percentages are from TOP (0) to BOTTOM (1) of the canvas.
// Adds mascot configuration (scale + selected mascot) with localStorage persistence
// and depth-based scaling controls for mascot & obstacles.

(function () {
  // ---- Defaults (used if nothing in localStorage) ----
  const DEFAULTS = {
    mascot: {
      scale: .60,          // 1.00 = original artwork size  (kept)
      selected: "Lime"     // starter mascot if none chosen yet  (kept)
    },
    // Depth perception scaling (used by main.html for y-based size)
    depth: {
      // At TOP limit => topScale; at BOTTOM limit => bottomScale
      mascot:   { topScale: 0.90, bottomScale: 1.05 },
      obstacle: { topScale: 0.85, bottomScale: 1.10 } // ← fixed comma & removed stray scalePercent
    }
  };

  // ---- Load any saved user choices ----
  const savedScale  = parseFloat(localStorage.getItem("mascotScale"));
  const savedMascot = localStorage.getItem("selectedMascot");

  // One-time migration from older misspelling
  ['selectedMascot','selectedMascotP1','selectedMascotP2'].forEach(k=>{
    if(localStorage.getItem(k)==='Pinapple'){ localStorage.setItem(k,'Pineapple'); }
  });

  // ---- Export the unified config object ----
  window.SURFLIME_CONFIG = {
    level: { seconds: 30 },  // seconds per level (used by main.html)

    // Global obstacle scale: 100 = native size; 20 = 20% of native; 80 = 20% smaller.
    obstacle: { scalePercent: 15 },

    // How far up/down the lime & obstacles can go (as a fraction of canvas height)
    limits: {
      topPercent: 0.20,   // (kept)
      bottomPercent: 0.80 // (kept)
    },

    // Collision tuning — lower portion of sprites is "active"
    // 0.40 = lower 40%; 0.00 = nothing; 1.00 = full height.  (kept)
    collision: {
      limeLowerZone: 0.25,
      obstacleLowerZone: 0.25
    },

    // Boost (Right Arrow) tuning  (kept)
    boost: {
      accel: 0.60,
      decay: 0.40,
      pushStrength: 1.00,
      moveLerp: 1.00
    },

    // UI positions  (kept)
    ui: {
      levelBannerYPercent: 0.08
    },

    // Audio controls
    audio: {
      // 0.0–1.0 volume for the background wave noise layered over music
      wavesVolume: 0.25
    },

    // Depth perception scaling (used by main.html to scale with Y)
    depth: {
      mascot: {
        topScale:    DEFAULTS.depth.mascot.topScale,
        bottomScale: DEFAULTS.depth.mascot.bottomScale
      },
      obstacle: {
        topScale:    DEFAULTS.depth.obstacle.topScale,
        bottomScale: DEFAULTS.depth.obstacle.bottomScale
      }
    },

    // Mascot config (size + selection)  (kept)
    mascot: {
      // Current render scale (multiplier on sprite size)
      scale: Number.isFinite(savedScale) ? savedScale : DEFAULTS.mascot.scale,

      // Currently selected mascot name
      selected: savedMascot || DEFAULTS.mascot.selected,

      // Helper to build asset paths.
      // Banana & Pineapple use "...Surfer.png", all others use "...Surf.png".
      assetsFor(name) {
        const n = name || this.selected;
        const SURFER = new Set(['Banana','Pineapple']);
        const base = `./Mascots/${n}/${n}`;
        return {
          surf: `${base}${SURFER.has(n) ? 'Surfer' : 'Surf'}.png`,
          fall: `${base}Fall.png`
        };
      },

      // Setters that also persist to localStorage (optional to use)
      setScale(v) {
        if (!Number.isFinite(v)) return;
        this.scale = v;
        try { localStorage.setItem("mascotScale", String(v)); } catch {}
      },
      setSelected(name) {
        if (!name) return;
        this.selected = name;
        try { localStorage.setItem("selectedMascot", name); } catch {}
      }
    }
  };

  // Optional: if settings are changed in another tab, live-sync this tab’s config. (kept)
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
