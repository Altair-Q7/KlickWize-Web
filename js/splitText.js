/* =====================================================
   SPLITTEXT.JS

   Breaks large headline words into individual letters.
   CSS then animates each letter upward one after another.
===================================================== */

(function () {
  const lines = document.querySelectorAll('.split-text');

  lines.forEach((line, lineIndex) => {
    const text = line.textContent.trim();
    line.textContent = '';
    line.style.setProperty('--line-index', lineIndex);

    Array.from(text).forEach((character, characterIndex) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = character === ' ' ? '\u00A0' : character;
      span.style.setProperty('--char-index', characterIndex);
      line.appendChild(span);
    });
  });
})();
