(function () {
  const stepper = document.querySelector('[data-stepper]');
  if (!stepper) return;

  const buttons = stepper.querySelectorAll('.stepper-button');
  const panel = stepper.querySelector('.stepper-panel');
  const titleOutput = stepper.querySelector('[data-step-title-output]');
  const copyOutput = stepper.querySelector('[data-step-copy-output]');

  function setActive(button, animate) {
    buttons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    if (animate && panel) {
      panel.classList.add('flipping');
      panel.dataset.stepDir = button.dataset.stepDir || 'left';
      setTimeout(function () {
        if (titleOutput) titleOutput.textContent = button.dataset.stepTitle;
        if (copyOutput) copyOutput.textContent = button.dataset.stepCopy;
      }, 140);
      setTimeout(function () {
        panel.classList.remove('flipping');
      }, 300);
    } else {
      if (titleOutput) titleOutput.textContent = button.dataset.stepTitle;
      if (copyOutput) copyOutput.textContent = button.dataset.stepCopy;
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { setActive(button, true); });
    button.addEventListener('mouseenter', function () { setActive(button, true); });
    button.addEventListener('focus', function () { setActive(button, false); });
  });
})();
