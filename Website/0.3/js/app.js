/* =====================================================
   APP.JS

   General page behaviors:
   1. Scroll reveal animations
   2. Rotating text in the hero
   3. Shuffle number animation
   4. Metallic card pointer glow
   5. Backend-ready contact form payload
===================================================== */

(function () {
  /* --------------------------------------------------
     SCROLL REVEAL
     Adds .visible when an item enters the screen.
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .14 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------
     ROTATING TEXT
     Cycles through words listed in data-words.
  -------------------------------------------------- */
  document.querySelectorAll('[data-rotating-text]').forEach(element => {
    const words = (element.dataset.words || '').split(',').filter(Boolean);
    if (words.length < 2) return;

    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % words.length;
      element.classList.add('is-changing');

      window.setTimeout(() => {
        element.textContent = words[index];
      }, 160);

      window.setTimeout(() => {
        element.classList.remove('is-changing');
      }, 390);
    }, 2300);
  });

  /* --------------------------------------------------
     SHUFFLE NUMBER
     Counts through random digits before landing on the final value.
  -------------------------------------------------- */
  document.querySelectorAll('[data-shuffle-number]').forEach(element => {
    const finalValue = element.dataset.final || element.textContent.trim();
    let frame = 0;

    const timer = window.setInterval(() => {
      frame += 1;
      element.textContent = String(Math.floor(Math.random() * 9) + 1);

      if (frame > 16) {
        window.clearInterval(timer);
        element.textContent = finalValue;
      }
    }, 55);
  });

  /* --------------------------------------------------
     CARD POINTER GLOW
     Tracks the pointer position inside cards.
  -------------------------------------------------- */
  document.querySelectorAll('.value-card, .service-card, .why-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  /* --------------------------------------------------
     CONTACT FORM
     This is ready for backend connection.
     For now it validates, creates a clean payload, and shows status.
  -------------------------------------------------- */
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');

  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      payload.source = 'KLICKWIZE Website 0.2';
      payload.createdAt = new Date().toISOString();

      console.info('Backend-ready contact payload:', payload);

      /* Backend connection point:
         Uncomment and edit this when your backend/API is ready.

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      */

      if (formStatus) {
        formStatus.textContent = 'Message sent. We\'ll be in touch soon.';
      }

      contactForm.reset();
    });
  }
})();
