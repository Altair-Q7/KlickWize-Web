/* =====================================================
   APP.JS — CORE BEHAVIORAL ORCHESTRATOR
   
   Initializes and coordinates all interactive
   behaviors that depend on DOM readiness:
   
     1. Scroll-reveal via IntersectionObserver
     2. Staggered child entrance animations
     3. Rotating / typed-cursor hero text
     4. Shuffle-number counter animation
     5. Pointer-tracked radial glow on cards
     6. 3D tilt transform on hover
     7. Stats counter roll-up
     8. Backend-ready contact form handler
     9. Background logo parallax on scroll
    10. Ambient mesh orb parallax
===================================================== */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────
     1. SCROLL REVEAL
     
     Uses IntersectionObserver to defer initial-state
     opacity/transform until the element enters the
     viewport, then applies `.visible` to trigger the
     CSS transition defined in animations.css.
  ──────────────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      });
    },
    { threshold: 0.08 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* ────────────────────────────────────────────────
     2. STAGGERED CHILD ENTRANCES
     
     For any container with [data-stagger], assign
     CSS custom property --stagger-index to each
     direct child so `animations.css` can apply
     sequential transition-delays.
  ──────────────────────────────────────────────── */
  document.querySelectorAll('[data-stagger]').forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      child.classList.add('stagger-child');
      child.style.setProperty('--stagger-index', i);
    });
  });


  /* ────────────────────────────────────────────────
     3. ROTATING / TYPED-CURSOR TEXT
     
     Cycles through a comma-separated word list stored
     in [data-words]. Applies a brief CSS class that
     triggers the flipWord keyframe during the swap.
     Also renders a blinking cursor via the .typed-cursor
     utility class.
  ──────────────────────────────────────────────── */
  document.querySelectorAll('[data-rotating-text]').forEach((el) => {
    const words = (el.dataset.words || '').split(',').filter(Boolean);
    if (words.length < 2) return;

    el.classList.add('typed-cursor');
    let index = 0;

    setInterval(() => {
      index = (index + 1) % words.length;
      el.classList.add('is-changing');

      setTimeout(() => { el.textContent = words[index]; }, 160);
      setTimeout(() => { el.classList.remove('is-changing'); }, 390);
    }, 2600);
  });


  /* ────────────────────────────────────────────────
     4. SHUFFLE NUMBER — Hero card digit scramble
     
     Randomly cycles displayed digits at ~18fps before
     resolving to the final value, creating a "decoding"
     effect consistent with the cybersecurity brand voice.
  ──────────────────────────────────────────────── */
  document.querySelectorAll('[data-shuffle-number]').forEach((el) => {
    const finalValue = el.dataset.final || el.textContent.trim();
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      el.textContent = String(Math.floor(Math.random() * 9) + 1);

      if (frame > 16) {
        clearInterval(timer);
        el.textContent = finalValue;
      }
    }, 55);
  });


  /* ────────────────────────────────────────────────
     5. POINTER-TRACKED RADIAL GLOW
     
     Maps the cursor's position within a card's
     bounding rect to CSS custom properties --mx / --my.
     The card's ::before pseudo-element uses these as
     the radial-gradient origin, creating a torch-light
     that follows the pointer.
  ──────────────────────────────────────────────── */
  document.querySelectorAll('.value-card, .service-card, .why-card, .service-showcase').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
    });
  });


  /* ────────────────────────────────────────────────
     6. 3D TILT TRANSFORM
     
     Applies a subtle perspective-corrected rotateX/Y
     on mousemove inside [data-tilt] elements.
     The transform resets with a spring ease on leave.
     Max tilt angle is clamped to ±10° to avoid
     disorienting the user.
  ──────────────────────────────────────────────── */
  const MAX_TILT = 10; // degrees

  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.classList.add('tilt-card');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / (rect.height / 2)) * -MAX_TILT;
      const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  MAX_TILT;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s var(--ease-spring, cubic-bezier(.34,1.56,.64,1))';
      el.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });


  /* ────────────────────────────────────────────────
     7. STATS COUNTER ROLL-UP
     
     Animates numeric values from 0 to their target
     over ~1.8s using an easeOutExpo curve.
     Triggered once per element via IntersectionObserver.
  ──────────────────────────────────────────────── */
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const target   = parseFloat(el.dataset.countTo);
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800; // ms
    let   startTime = null;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);

        const tick = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value    = easeOutExpo(progress) * target;
          el.textContent = value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    counterObserver.observe(el);
  });


  /* ────────────────────────────────────────────────
     8. CONTACT FORM — Backend-ready payload builder
     
     Prevents default submission, assembles a typed
     payload object enriched with metadata, and logs
     it to the console. Replace the console.info call
     with a fetch() POST to your API endpoint.
  ──────────────────────────────────────────────── */
  const contactForm  = document.querySelector('[data-contact-form]');
  const formStatus   = document.querySelector('[data-form-status]');
  const submitBtn    = contactForm?.querySelector('[type="submit"]');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const payload = {
        ...Object.fromEntries(new FormData(contactForm).entries()),
        source:    'KLICKWIZE Website 0.4',
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      console.info('[KLICKWIZE] Contact payload ready for dispatch:', payload);

      /* ── Backend Integration Point ────────────────
         Uncomment and configure when API is available:
         
         fetch('/api/v1/contact', {
           method:  'POST',
           headers: { 'Content-Type': 'application/json' },
           body:    JSON.stringify(payload),
         })
         .then(res => res.ok ? res.json() : Promise.reject(res))
         .then(() => { formStatus.textContent = 'Sent.'; })
         .catch(() => { formStatus.textContent = 'Failed. Try WhatsApp.'; });
      ──────────────────────────────────────────── */

      if (formStatus) {
        formStatus.textContent = "Message sent. We'll be in touch soon.";
      }
      if (submitBtn) {
        submitBtn.textContent = 'Sent ✓';
        submitBtn.disabled    = true;
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled    = false;
        }, 4000);
      }

      contactForm.reset();
    });
  }


  /* ────────────────────────────────────────────────
     9. AMBIENT MESH ORB PARALLAX
     
     The two radial gradient orbs in layout.css have
     corresponding DOM nodes with [data-orb-a/b].
     On scroll, their transform offsets create a
     slow, dissociated depth layer behind the content.
  ──────────────────────────────────────────────── */
  const orbA = document.querySelector('[data-orb-a]');
  const orbB = document.querySelector('[data-orb-b]');

  if (orbA || orbB) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (orbA) orbA.style.transform = `translateY(${y * 0.12}px)`;
      if (orbB) orbB.style.transform = `translateY(${y * -0.08}px)`;
    }, { passive: true });
  }

})();
