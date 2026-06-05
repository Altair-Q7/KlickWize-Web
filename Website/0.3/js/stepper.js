/* =====================================================
   STEPPER.JS

   The process section has five numbered buttons.
   When a visitor clicks one, the large panel updates.
===================================================== */

(function () {
  const stepper = document.querySelector('[data-stepper]');
  if (!stepper) return;

  const buttons = stepper.querySelectorAll('.stepper-button');
  const titleOutput = stepper.querySelector('[data-step-title-output]');
  const copyOutput = stepper.querySelector('[data-step-copy-output]');

  function setActive(button) {
    buttons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    if (titleOutput) titleOutput.textContent = button.dataset.stepTitle;
    if (copyOutput) copyOutput.textContent = button.dataset.stepCopy;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => setActive(button));
    button.addEventListener('mouseenter', () => setActive(button));
    button.addEventListener('focus', () => setActive(button));
  });
})();
