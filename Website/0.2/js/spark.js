/* =====================================================
   SPARK.JS

   Creates the background spark/network animation.
   It is decorative, so it stays behind content and ignores clicks.
===================================================== */

(function () {
  const canvas = document.getElementById('spark-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: -999, y: -999 };
  let width = 0;
  let height = 0;
  let points = [];

  function fitCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function seedPoints() {
    points = [];
    const total = window.innerWidth < 720 ? 34 : 72;

    for (let index = 0; index < total; index += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .24,
        vy: (Math.random() - .5) * .24,
        radius: Math.random() * 1.4 + .7
      });
    }
  }

  function resize() {
    fitCanvas();
    seedPoints();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    points.forEach((point, index) => {
      for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
        const next = points[nextIndex];
        const dx = point.x - next.x;
        const dy = point.y - next.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - distance / 150) * .16})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }

      const mouseDx = point.x - mouse.x;
      const mouseDy = point.y - mouse.y;
      const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      const glow = mouseDistance < 130 ? 1 - mouseDistance / 130 : 0;

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius + glow * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glow > 0
        ? `rgba(124,236,255,${.35 + glow * .48})`
        : 'rgba(0,212,255,.22)';
      ctx.fill();

      if (!prefersReducedMotion) {
        point.x += point.vx;
        point.y += point.vy;
      }

      if (point.x < -10) point.x = width + 10;
      if (point.x > width + 10) point.x = -10;
      if (point.y < -10) point.y = height + 10;
      if (point.y > height + 10) point.y = -10;
    });

    window.requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });

  resize();
  draw();
})();
