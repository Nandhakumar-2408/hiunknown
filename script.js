(() => {
  'use strict';

  /* ------------------------------------------------------
     Elements
  ------------------------------------------------------ */
  const pages = {
    1: document.getElementById('page1'),
    2: document.getElementById('page2'),
    3: document.getElementById('page3'),
  };
  const dots = document.querySelectorAll('.dot');

  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const noMessage = document.getElementById('noMessage');

  const colorOptions = document.getElementById('colorOptions');
  const swatches = colorOptions.querySelectorAll('.color-swatch');
  const customColorInput = document.getElementById('customColorInput');
  const btnContinue = document.getElementById('btnContinue');

  const btnSend = document.getElementById('btnSend');
  const replyInput = document.getElementById('replyInput');
  const thankYouMsg = document.getElementById('thankYouMsg');

  const floatiesLayer = document.getElementById('floaties');

  let currentStep = 1;
  let themeChosen = false;

  /* ------------------------------------------------------
     Step navigation — sequential fade so only one page is
     ever visible, which keeps things simple on small screens
  ------------------------------------------------------ */
  function goToStep(stepNumber) {
    const current = pages[currentStep];
    const next = pages[stepNumber];
    if (!next || next === current) return;

    current.classList.remove('show');

    window.setTimeout(() => {
      current.classList.remove('active');
      next.classList.add('active');
      // force reflow so the transition below actually animates
      void next.offsetWidth;
      requestAnimationFrame(() => next.classList.add('show'));
      currentStep = stepNumber;
      updateProgress(stepNumber);
    }, 400);
  }

  function updateProgress(stepNumber) {
    dots.forEach((dot) => {
      dot.classList.toggle('active', Number(dot.dataset.step) === stepNumber);
    });
  }

  /* ------------------------------------------------------
     Page 1 — Yes / No
  ------------------------------------------------------ */
  btnYes.addEventListener('click', () => goToStep(2));

  btnNo.addEventListener('click', () => {
    btnNo.classList.remove('shake');
    void btnNo.offsetWidth;
    btnNo.classList.add('shake');
    noMessage.classList.add('visible');
  });

  btnNo.addEventListener('animationend', () => btnNo.classList.remove('shake'));

  /* ------------------------------------------------------
     Page 2 — favourite colour → live theme
  ------------------------------------------------------ */
  const presetColors = {
    pink: '#e2a3b8',
    blue: '#93b7dc',
    sandal: '#cbab7c',
  };

  function isValidColor(value) {
    return Boolean(value) && CSS.supports('color', value);
  }

  function setAccent(value) {
    document.documentElement.style.setProperty('--accent', value);
  }

  function selectSwatch(target) {
    swatches.forEach((s) => s.classList.remove('selected'));
    target.classList.add('selected');
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const key = swatch.dataset.color;
      selectSwatch(swatch);

      if (key === 'other') {
        customColorInput.classList.remove('hidden');
        customColorInput.focus();
        const typed = customColorInput.value.trim();
        if (isValidColor(typed)) {
          setAccent(typed);
          themeChosen = true;
        } else {
          themeChosen = false;
        }
      } else {
        customColorInput.classList.add('hidden');
        setAccent(presetColors[key]);
        themeChosen = true;
      }

      btnContinue.disabled = !themeChosen;
    });
  });

  customColorInput.addEventListener('input', () => {
    const value = customColorInput.value.trim();
    if (isValidColor(value)) {
      setAccent(value);
      themeChosen = true;
    } else {
      themeChosen = false;
    }
    btnContinue.disabled = !themeChosen;
  });

  btnContinue.addEventListener('click', () => {
    if (!btnContinue.disabled) goToStep(3);
  });

  /* ------------------------------------------------------
     Page 3 — reply
  ------------------------------------------------------ */
  btnSend.addEventListener('click', () => {
    // Handled entirely on the frontend — nothing is sent anywhere.
    thankYouMsg.classList.add('visible');
    replyInput.value = '';
    replyInput.blur();
  });

  /* ------------------------------------------------------
     Ambient floating hearts, notes & particles
  ------------------------------------------------------ */
  const SYMBOLS = ['♡', '♥', '♪', '♫', 'dot', 'dot'];
  const MAX_FLOATIES = 14;

  function spawnFloaty() {
    if (floatiesLayer.childElementCount >= MAX_FLOATIES) return;

    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const el = document.createElement('span');

    const isParticle = symbol === 'dot';
    el.className = isParticle ? 'floaty particle' : `floaty${symbol === '♪' || symbol === '♫' ? ' note' : ''}`;

    if (!isParticle) {
      el.textContent = symbol;
      el.style.fontSize = `${14 + Math.random() * 14}px`;
    }

    const leftPercent = 4 + Math.random() * 92;
    const duration = 9 + Math.random() * 7;
    const drift = (Math.random() * 80 - 40).toFixed(0) + 'px';
    const spin = (Math.random() * 50 - 25).toFixed(0) + 'deg';

    el.style.left = `${leftPercent}%`;
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--spin', spin);
    el.style.animationDuration = `${duration}s`;

    el.addEventListener('animationend', () => el.remove());
    floatiesLayer.appendChild(el);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      window.setTimeout(spawnFloaty, i * 500);
    }
    window.setInterval(spawnFloaty, 1600);
  }
})();
