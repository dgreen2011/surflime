// Global config for Surf Lime
// Percentages are from TOP (0) to BOTTOM (1) of the canvas.
// Adds mascot configuration (scale + selected mascot) with localStorage persistence
// and depth-based scaling controls for mascot & obstacles.

(function () {
  // ---- Defaults (used if nothing in localStorage) ----
  const DEFAULTS = {
    mascot: {
      scale: 1.00,
      selected: "Lime"
    },
    depth: {
      mascot:   { topScale: 0.90, bottomScale: 1.05 },
      obstacle: { topScale: 0.85, bottomScale: 1.10 }
    }
  };

  const savedScale  = parseFloat(localStorage.getItem("mascotScale"));
  const savedMascot = localStorage.getItem("selectedMascot");

  ['selectedMascot','selectedMascotP1','selectedMascotP2'].forEach(k=>{
    if(localStorage.getItem(k)==='Pinapple'){ localStorage.setItem(k,'Pineapple'); }
  });

  window.SURFLIME_CONFIG = {
    level: { seconds: 30 },

    // Desktop obstacle scale (percent of native artwork)
    obstacle: { scalePercent: 15 },

    limits: {
      topPercent: 0.20,
      bottomPercent: 0.80
    },

    collision: {
      limeLowerZone: 0.25,
      obstacleLowerZone: 0.25
    },

    boost: {
      accel: 0.60,
      decay: 0.40,
      pushStrength: 1.00,
      moveLerp: 1.00
    },

    ui: { levelBannerYPercent: 0.08 },

    audio: { wavesVolume: 0.25 },

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

    mascot: {
      scale: Number.isFinite(savedScale) ? savedScale : DEFAULTS.mascot.scale,
      selected: savedMascot || DEFAULTS.mascot.selected,
      assetsFor(name) {
        const n = name || this.selected;
        const SURFER = new Set(['Banana','Pineapple']);
        const base = `./Mascots/${n}/${n}`;
        return {
          surf: `${base}${SURFER.has(n) ? 'Surfer' : 'Surf'}.png`,
          fall: `${base}Fall.png`
        };
      },
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
    },

    // NEW: Mobile deltas that *shrink past* desktop settings
    // Example: mascot scale 1.00 on desktop with 20 below -> mobile mascot = 0.80
    // Example: obstacle 15% desktop with 20 below -> mobile obstacle = 12%
    mobile: {
      scaleDownPercent: {
        mascot: 25,     // shrink mascot by X% on mobile vs desktop
        obstacle: 25    // shrink obstacle percent by X% on mobile vs desktop
      }
    }
  };

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

// --- Mobile scaling defaults (kept for backward compatibility) ---
;(function(){
  try{
    const C = (window.SURFLIME_CONFIG = window.SURFLIME_CONFIG || {});
    C.mascot = C.mascot || {};
    C.obstacle = C.obstacle || {};
    // If explicit mobile overrides exist, keep honoring them.
    if (!Number.isFinite(C.mascot.scaleMobile)) {
      C.mascot.scaleMobile = undefined; // prefer shrink percent path
    }
    if (!Number.isFinite(C.obstacle.scalePercentMobile)) {
      C.obstacle.scalePercentMobile = undefined; // prefer shrink percent path
    }
  }catch(e){}
})();
