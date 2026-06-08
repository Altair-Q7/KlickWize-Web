/* =====================================================
   SERVICECYCLE.JS — HERO SERVICE SHOWCASE MODULE

   Drives the `.service-showcase` component in the
   hero visual column. Cycles through all six service
   pillars on a fixed interval, applying a vertical
   clip-path wipe transition between each slide.

   Architecture:
     - Data-driven: service definitions live in the
       SERVICES array; no markup duplication needed.
     - Transition model: outgoing slide clips upward
       (clip-path top → bottom), incoming slides in
       from below simultaneously on a staggered rAF.
     - Progress bar: a CSS width transition resets and
       re-runs on each cycle to show time remaining.
     - Dot nav: clicking a dot immediately jumps to
       that index and resets the interval timer.
     - Pause on hover: clearInterval on mouseenter,
       resume on mouseleave to respect user intent.
===================================================== */

(function () {
  'use strict';

  /* ── Service Pillar Data ─────────────────────────
     Each entry maps to one slide. The `icon` field
     is an inline SVG path string; viewBox is 24×24.
  ─────────────────────────────────────────────── */
  const SERVICES = [
    {
      number:  '01',
      name:    'Cybersecurity',
      tag:     'Core Practice',
      copy:    'Threat mitigation and protection for digital systems, infrastructure, and business operations.',
      /* Shield with checkmark path */
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    },
    {
      number:  '02',
      name:    'Web Development',
      tag:     'Build',
      copy:    'Modern websites and custom web applications engineered for performance and reliability.',
      icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    },
    {
      number:  '03',
      name:    'Mobile Apps',
      tag:     'Build',
      copy:    'High-performance mobile experiences for connected services, users, and teams.',
      icon: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    },
    {
      number:  '04',
      name:    'AI & Automation',
      tag:     'Automate',
      copy:    'AI-assisted workflows that reduce manual effort and improve execution speed.',
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    },
    {
      number:  '05',
      name:    'Cloud & DevOps',
      tag:     'Infrastructure',
      copy:    'Cloud architecture, deployment pipelines, monitoring, and continuity planning.',
      icon: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    },
    {
      number:  '06',
      name:    'Digital Growth',
      tag:     'Grow',
      copy:    'Marketing and growth systems focused on lead generation and measurable revenue.',
      icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    },
  ];

  const CYCLE_DURATION = 3800; // ms per slide

  /* ── DOM Queries ──────────────────────────────── */
  const showcase    = document.getElementById('service-showcase');
  if (!showcase) return;

  const numEl       = showcase.querySelector('[data-sc-number]');
  const iconEl      = showcase.querySelector('[data-sc-icon]');
  const nameEl      = showcase.querySelector('[data-sc-name]');
  const tagEl       = showcase.querySelector('[data-sc-tag]');
  const copyEl      = showcase.querySelector('[data-sc-copy]');
  const progressEl  = showcase.querySelector('[data-sc-progress]');
  const dotsEl      = showcase.querySelector('[data-sc-dots]');
  const slideEl     = showcase.querySelector('[data-sc-slide]');

  /* ── State ────────────────────────────────────── */
  let currentIndex = 0;
  let timer        = null;
  let isAnimating  = false;

  /* ── Dot Navigation Build ─────────────────────── */
  SERVICES.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type        = 'button';
    dot.className   = `sc-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show service ${i + 1}`);
    dot.addEventListener('click', () => {
      if (i === currentIndex || isAnimating) return;
      goTo(i);
      resetTimer();
    });
    dotsEl.appendChild(dot);
  });

  /* ── Progress Bar Reset ───────────────────────── */
  function resetProgress() {
    /* Remove and re-add the element to restart the
       CSS transition from 0% without needing a keyframe. */
    progressEl.style.transition = 'none';
    progressEl.style.width      = '0%';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressEl.style.transition = `width ${CYCLE_DURATION}ms linear`;
        progressEl.style.width      = '100%';
      });
    });
  }

  /* ── Slide Transition ─────────────────────────── */
  /**
   * goTo — transitions from the current slide to the
   * target index using a vertical clip-path wipe.
   *
   * Outgoing: clip-path collapses from full → empty (upward)
   * Incoming: content swaps mid-animation, then expands
   *
   * @param {number} nextIndex - Target service index
   */
  function goTo(nextIndex) {
    if (isAnimating) return;
    isAnimating = true;

    const prev = currentIndex;
    currentIndex = nextIndex;

    /* Update dot states */
    dotsEl.querySelectorAll('.sc-dot').forEach((d, i) => {
      d.classList.toggle('active', i === nextIndex);
    });

    /* Phase 1: wipe out current content upward */
    slideEl.style.transition  = 'clip-path .36s cubic-bezier(.4,0,1,1), opacity .36s ease';
    slideEl.style.clipPath    = 'inset(0 0 100% 0)';
    slideEl.style.opacity     = '0';

    setTimeout(() => {
      /* Phase 2: update content while invisible */
      const svc = SERVICES[nextIndex];
      numEl.textContent  = svc.number;
      nameEl.textContent = svc.name;
      tagEl.textContent  = svc.tag;
      copyEl.textContent = svc.copy;
      iconEl.innerHTML   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svc.icon}</svg>`;

      /* Phase 3: wipe in from bottom */
      slideEl.style.clipPath = 'inset(100% 0 0 0)';
      slideEl.style.opacity  = '0';

      requestAnimationFrame(() => {
        slideEl.style.transition = 'clip-path .44s cubic-bezier(.16,1,.3,1), opacity .28s ease';
        slideEl.style.clipPath   = 'inset(0 0 0 0)';
        slideEl.style.opacity    = '1';

        setTimeout(() => {
          /* Restore clip-path to neutral so it doesn't interfere */
          slideEl.style.clipPath  = '';
          slideEl.style.transition = '';
          slideEl.style.opacity    = '1';
          isAnimating = false;
        }, 460);
      });
    }, 370);
  }

  /* ── Auto-Cycle Timer ─────────────────────────── */
  function startTimer() {
    timer = setInterval(() => {
      goTo((currentIndex + 1) % SERVICES.length);
      resetProgress();
    }, CYCLE_DURATION);
  }

  function resetTimer() {
    clearInterval(timer);
    resetProgress();
    startTimer();
  }

  /* ── Pause on Hover ───────────────────────────── */
  showcase.addEventListener('mouseenter', () => {
    clearInterval(timer);
    progressEl.style.transition = 'none'; // freeze progress bar
  });

  showcase.addEventListener('mouseleave', () => {
    resetTimer();
  });

  /* ── Bootstrap ────────────────────────────────── */
  /* Populate initial slide without transition */
  const first = SERVICES[0];
  numEl.textContent  = first.number;
  nameEl.textContent = first.name;
  tagEl.textContent  = first.tag;
  copyEl.textContent = first.copy;
  iconEl.innerHTML   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${first.icon}</svg>`;

  resetProgress();
  startTimer();

})();
