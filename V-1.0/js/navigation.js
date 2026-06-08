/* =====================================================
   NAVIGATION.JS

   Controls:
   1. Header blur after scrolling
   2. Smooth scrolling for page links
   3. Active pill nav highlight
   4. Staggered mobile menu
===================================================== */

(function () {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const pillLinks = document.querySelectorAll('[data-pill-nav] a');

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }

  function closeMobileMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link, index) => {
      link.style.setProperty('--menu-index', index);
    });
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('open', !isOpen);
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const activeHref = `#${entry.target.id}`;
      pillLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activeHref);
      });
    });
  }, {
    rootMargin: '-42% 0px -52% 0px',
    threshold: 0
  });

  ['hero', 'about', 'services', 'process', 'why', 'contact'].forEach(id => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
})();
