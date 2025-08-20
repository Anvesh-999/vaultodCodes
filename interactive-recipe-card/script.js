(function(){
  const app = document.getElementById('app');
  const prepMinutes = parseInt(app.getAttribute('data-prep-minutes'), 10) || 0;
  const totalSteps = parseInt(app.getAttribute('data-total-steps'), 10) || 1;

  
  const btnToggleIngredients = document.getElementById('toggleIngredients');
  const btnToggleSteps = document.getElementById('toggleSteps');
  const btnStart = document.getElementById('startCooking');
  const btnNext = document.getElementById('nextStep');
  const btnReset = document.getElementById('reset');
  const btnPrint = document.getElementById('printRecipe');

  const ingredientsPanel = document.getElementById('ingredients');
  const stepsPanel = document.getElementById('steps');
  const stepsList = document.getElementById('stepsList');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');

  const timerEl = document.getElementById('timer');
  const prepTimeText = document.getElementById('prepTimeText');


  if (prepMinutes) prepTimeText.textContent = prepMinutes + ' mins';


  function togglePanel(panelEl, buttonEl, showLabel, hideLabel) {
    const isCollapsed = panelEl.classList.toggle('collapsed');
    const isHidden = isCollapsed;
    panelEl.setAttribute('aria-hidden', String(isHidden));
    const expanded = !isCollapsed;
    buttonEl.setAttribute('aria-expanded', String(expanded));
    buttonEl.textContent = expanded ? hideLabel : showLabel;
  }

  btnToggleIngredients.addEventListener('click', () => {
    togglePanel(ingredientsPanel, btnToggleIngredients, 'Show Ingredients', 'Hide Ingredients');
  });
  btnToggleSteps.addEventListener('click', () => {
    togglePanel(stepsPanel, btnToggleSteps, 'Show Steps', 'Hide Steps');
  });

  
  let activeIndex = -1;
  function setActiveStep(index) {
    const items = [...stepsList.querySelectorAll('li')];
    items.forEach((li, i) => {
      li.classList.toggle('active', i === index);
    });
    activeIndex = index;
    const pct = Math.round(((activeIndex + 1) / totalSteps) * 100);
    const clampedPct = Math.max(0, Math.min(100, isNaN(pct) ? 0 : pct));
    progressBar.style.width = (activeIndex >= 0 ? clampedPct : 0) + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', String(clampedPct));
    progressLabel.textContent = `Progress: ${activeIndex >= 0 ? clampedPct : 0}% (Step ${Math.max(0, activeIndex+1)} of ${totalSteps})`;

    btnNext.disabled = !(activeIndex >= 0 && activeIndex < items.length - 1);
  }


  let remainingSeconds = 0;
  let timerId = null;
  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  function startTimer(minutes) {
    clearInterval(timerId);
    remainingSeconds = Math.max(0, minutes * 60);
    timerEl.textContent = formatTime(remainingSeconds);
    timerId = setInterval(() => {
      remainingSeconds--;
      timerEl.textContent = formatTime(Math.max(remainingSeconds, 0));
      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        progressBar.classList.add('done');
        setTimeout(() => progressBar.classList.remove('done'), 1500);
      }
    }, 1000);
  }

  btnStart.addEventListener('click', () => {
    setActiveStep(0);
    btnStart.disabled = true;
    btnNext.disabled = false;
    if (prepMinutes > 0) startTimer(prepMinutes);
  });

  btnNext.addEventListener('click', () => {
    const items = [...stepsList.querySelectorAll('li')];
    if (activeIndex < items.length - 1) {
      setActiveStep(activeIndex + 1);
      if (activeIndex === items.length - 1) {
        btnNext.disabled = true;
      }
    }
  });

  btnReset.addEventListener('click', () => {
    [...stepsList.querySelectorAll('li')].forEach(li => li.classList.remove('active'));
    activeIndex = -1;
    progressBar.style.width = '0%';
    progressLabel.textContent = `Progress: 0% (Step 0 of ${totalSteps})`;
    progressBar.parentElement.setAttribute('aria-valuenow', '0');
    btnStart.disabled = false;
    btnNext.disabled = true;
    clearInterval(timerId);
    timerEl.textContent = '00:00';
  });

  btnPrint.addEventListener('click', () => {
    window.print();
  });

  stepsList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnNext.click();
    }
  });
})();