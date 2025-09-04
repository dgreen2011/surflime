/**
 * Surf Lime Config
 * - Adds Supabase music source (public bucket)
 * - Adds mobile scale-down-by-percent knobs (mascot/obstacle)
 * - Adds mobile motion knobs (rise/fall speed) for slower vertical movement
 * - Keeps existing behavior if new settings are not provided.
 */
(function () {
  const savedScale  = parseFloat(localStorage.getItem("mascotScale"));
  const savedMascot = localStorage.getItem("selectedMascot");

  // Fix historical typo for Pineapple if present in storage
  ['selectedMascot','selectedMascotP1','selectedMascotP2'].forEach(k=>{
    if(localStorage.getItem(k)==='Pinapple'){ localStorage.setItem(k,'Pineapple'); }
  });

  window.SURFLIME_CONFIG = {
    level: { seconds: 30 },

    // Obstacle scale on desktop (% of native artwork)
    obstacle: { scalePercent: 15 },

    limits: { topPercent: 0.20, bottomPercent: 0.80 },

    collision: { limeLowerZone: 0.25, obstacleLowerZone: 0.25 },

    boost: { accel: 0.60, decay: 0.40, pushStrength: 1.00, moveLerp: 1.00 },

    ui: { levelBannerYPercent: 0.08 },

    audio: { wavesVolume: 0.25 },

    // Depth-based scaling
    depth: {
      mascot:   { topScale: 0.90, bottomScale: 1.05 },
      obstacle: { topScale: 0.85, bottomScale: 1.10 }
    },

    mascot: {
      scale: Number.isFinite(savedScale) ? savedScale : 1.00,
      selected: savedMascot || "Lime",
      assetsFor(name) {
        const n = name || this.selected;
        const SURFER = new Set(['Banana','Pineapple']);
        const base = `./Mascots/${n}/${n}`;
        return { surf: `${base}${SURFER.has(n) ? 'Surfer' : 'Surf'}.png`, fall: `${base}Fall.png` };
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

    // NEW: Mobile shrink-by-percent (applied on top of desktop values)
    mobile: {
      // Mobile-only: where the mascot 'rests' when not holding (distance above bottom bound)
      holdRise: { baseOffsetFromBottomPx: 20 },

      // NEW: Mobile motion (slower rise/fall by default; tweak as desired)
      motion: {
        // How strongly a hold/tap accelerates upward (px/s^2)
        riseAccel: 650,      // default was ~800; lower = slower rise
        // Spring strength pulling back to base when not holding
        fallSpringK: 4.5,    // default was ~6.0; lower = slower return
        // Damping applied each frame when not holding (multiplier per second)
        // Used as (1 - fallDamping * dt) in code; lower = less damping
        fallDamping: 2.5     // default was ~3.5
      },

      scaleDownPercent: {
        mascot: 25,   // e.g., 15 -> render mascot at 85% of desktop size
        obstacle: 25  // e.g., 15 -> render obstacles at 85% of desktop percent
      }
    },

    // NEW: Supabase music source (public bucket). Enable + set your projectRef/bucket/files.
    music: {
      supabase: {
        enabled: true,
        projectRef: "iqzplffsjaopzspnbhok",
        bucket: "Music",
        files: ["Blue Horizon Calling.wav","Island of Surfing Dreams.wav","Moonlight on Waikiki.wav","North Shore Dreamline.wav","Palms at Golden Sunset.wav"]
      }
    }
  };

  // Keep backward compatibility flags (prefer new mobile.scaleDownPercent if present)
  (function(){
    try{
      const C = (window.SURFLIME_CONFIG = window.SURFLIME_CONFIG || {});
      C.mascot = C.mascot || {};
      C.obstacle = C.obstacle || {};
      if (!Number.isFinite(C.mascot.scaleMobile)) C.mascot.scaleMobile = undefined;
      if (!Number.isFinite(C.obstacle.scalePercentMobile)) C.obstacle.scalePercentMobile = undefined;
    }catch{}
  })();

  // React to external storage changes
  window.addEventListener("storage", () => {
    const v = parseFloat(localStorage.getItem("mascotScale"));
    if (Number.isFinite(v)) window.SURFLIME_CONFIG.mascot.scale = v;
    const n = localStorage.getItem("selectedMascot");
    if (n) window.SURFLIME_CONFIG.mascot.selected = n;
  });
})();