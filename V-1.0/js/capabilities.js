/* =====================================================
   CAPABILITIES.JS — ANIMATED PROFICIENCY BAR MODULE
   
   Responsibility:
     Observes each `.cap-bar` element via
     IntersectionObserver. When the bar enters the
     viewport, a CSS transition animates its width
     from 0% to the value stored in [data-width].
   
   Design rationale:
     Width is set via inline style rather than a
     CSS class so individual percentages can be
     arbitrary without requiring per-value utility
     classes or custom properties in the stylesheet.
===================================================== */

(function () {
  'use strict';

  /**
   * Observes capability bar elements and triggers
   * the width transition animation on first intersection.
   *
   * @param {Element} bar - A .cap-bar DOM node carrying
   *                        a [data-width] percentage attribute.
   */
  function animateBar(bar) {
    const targetWidth = bar.dataset.width || '0';

    // Set initial state: zero width, no transition yet.
    bar.style.width      = '0%';
    bar.style.transition = 'none';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // One-frame delay ensures the browser has painted
          // the initial state before the transition begins.
          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(.16, 1, .3, 1)';
            bar.style.width      = `${targetWidth}%`;
          });

          // Fire-once: unobserve after first activation.
          observer.unobserve(bar);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(bar);
  }

  // Register all capability bars present in the DOM.
  document.querySelectorAll('.cap-bar').forEach(animateBar);
})();
