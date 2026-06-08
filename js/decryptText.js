/* =====================================================
   DECRYPTTEXT.JS - Scramble Text Reveal

   This creates the cyber-style "decrypting" text effect.
   The real words are never changed permanently; the script
   briefly shows random characters, then restores the text.
===================================================== */

(function () {

  const items = document.querySelectorAll('.decrypt-text');

  if (!items.length) return;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+-_';

  function scramble(element) {

    const finalText = element.dataset.text || element.textContent.trim();
    let frame = 0;

    const timer = window.setInterval(() => {

      element.textContent = finalText
        .split('')
        .map((letter, index) => {

          /* Spaces and symbols stay readable while letters decrypt. */
          if (letter === ' ' || letter === '•' || letter === '-') return letter;

          /* Characters near the start settle first. */
          if (index < frame) return finalText[index];

          return characters[Math.floor(Math.random() * characters.length)];

        })
        .join('');

      frame += 1;

      if (frame > finalText.length) {
        window.clearInterval(timer);
        element.textContent = finalText;
      }

    }, 32);

  }

  items.forEach(item => {

    /* Runs once when the page loads. */
    scramble(item);

    /* Runs again when a visitor points at the label. */
    item.addEventListener('mouseenter', () => scramble(item));

    /* Re-trigger decrypt when the element scrolls into view. */
    const decryptObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) scramble(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    decryptObserver.observe(item);

  });

})();
