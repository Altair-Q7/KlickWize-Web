/* =====================================================
   SPARK.JS — CYBER NETWORK CANVAS RENDERER
   
   Renders an animated particle-network on a fixed
   <canvas> element that sits behind all page content.
   
   Rendering pipeline per frame:
     1. Compute scroll velocity via low-pass filter
     2. Clear the raster buffer
     3. Draw proximity-weighted edges between nodes
     4. Draw nodes with pointer-proximity glow
     5. Advance node positions (velocity + scroll drift)
     6. Wrap nodes at viewport boundaries
   
   Performance considerations:
     - Canvas size is multiplied by devicePixelRatio
       (capped at 2×) for HiDPI clarity.
     - Node count scales with viewport width to
       avoid overdraw on narrow (mobile) viewports.
     - Edge drawing is O(n²) — kept manageable by
       limiting the max node count to 130.
     - All drawing is skipped when
       prefers-reduced-motion: reduce is active.
===================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('spark-canvas');
  if (!canvas) return;

  const ctx                  = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── State ─────────────────────────────────────── */
  const mouse         = { x: -999, y: -999 };
  let   width         = 0;
  let   height        = 0;
  let   nodes         = [];
  let   lastScrollY   = window.scrollY;
  let   scrollVelocity = 0;

  /* ── Canvas Initialisation ──────────────────────── */
  /**
   * fitCanvas — sizes the canvas backing buffer to the
   * physical pixel resolution and scales the 2D context
   * matrix to compensate, preventing blurry rendering
   * on HiDPI displays.
   */
  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width     = window.innerWidth;
    height    = window.innerHeight;

    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── Node Pool ──────────────────────────────────── */
  /**
   * seedNodes — populates the nodes array with
   * randomised positions and velocities.
   * Count is reduced on narrow viewports to maintain
   * a consistent frame budget.
   */
  function seedNodes() {
    nodes = [];
    const count = width < 720 ? 60 : 130;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x:      Math.random() * width,
        y:      Math.random() * height,
        vx:     (Math.random() - .5) * .6,
        vy:     (Math.random() - .5) * .6,
        radius: Math.random() * 1.8 + 1.0,
        pulse:  Math.random() * Math.PI * 2, // phase offset for size pulsing
      });
    }
  }

  /* ── Resize Handler ─────────────────────────────── */
  function resize() {
    fitCanvas();
    seedNodes();
  }

  /* ── Frame Renderer ─────────────────────────────── */
  /**
   * draw — the main rAF callback.
   * Called every animation frame (~16ms at 60fps).
   */
  function draw() {
    /* Scroll velocity: low-pass filter prevents
       jitter from rapid successive scroll events.   */
    const currentScrollY = window.scrollY;
    scrollVelocity      += (currentScrollY - lastScrollY - scrollVelocity) * 0.18;
    lastScrollY          = currentScrollY;

    ctx.clearRect(0, 0, width, height);

    const time = performance.now() * 0.001;

    /* ── Edge Pass: draw lines between close nodes ── */
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) {
        const b  = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d >= 200) continue;

        const alpha = (1 - d / 200) * 0.28;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,212,255,${alpha.toFixed(3)})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }

    /* ── Node Pass: draw and advance each particle ── */
    nodes.forEach((node) => {
      /* Pointer proximity glow factor (0–1) */
      const mdx   = node.x - mouse.x;
      const mdy   = node.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      const glow  = mdist < 160 ? 1 - mdist / 160 : 0;

      /* Subtle size pulse using per-node phase offset */
      const pulseFactor = 1 + Math.sin(time * 2.4 + node.pulse) * 0.3;
      const r           = (node.radius + glow * 1.8) * pulseFactor;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = glow > 0
        ? `rgba(124,236,255,${(0.35 + glow * 0.45).toFixed(3)})`
        : `rgba(0,212,255,${(0.25 + Math.sin(time + node.pulse) * 0.06).toFixed(3)})`;
      ctx.fill();

      /* Glow halo on pointer proximity */
      if (glow > 0.2) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${(glow * 0.08).toFixed(3)})`;
        ctx.fill();
      }

      /* Position integration (skip if reduced-motion) */
      if (!prefersReducedMotion) {
        node.x += node.vx + scrollVelocity * 0.4;
        node.y += node.vy + scrollVelocity * 0.25;
      }

      /* Toroidal boundary wrap */
      if (node.x < -10)        node.x = width  + 10;
      if (node.x > width  + 10) node.x = -10;
      if (node.y < -10)        node.y = height + 10;
      if (node.y > height + 10) node.y = -10;
    });

    requestAnimationFrame(draw);
  }

  /* ── Event Listeners ────────────────────────────── */
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });

  /* ── Bootstrap ──────────────────────────────────── */
  resize();
  draw();
})();
