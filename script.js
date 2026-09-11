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

  const singerInput = document.getElementById('singerInput');
  const harderOptions = document.getElementById('harderOptions');
  const harderOptionBtns = harderOptions ? harderOptions.querySelectorAll('.harder-option') : [];
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

  function getSelectedColor() {
    const selectedSwatch = colorOptions.querySelector('.color-swatch.selected');
    if (!selectedSwatch) return 'Not specified';
    const key = selectedSwatch.dataset.color;
    if (key === 'other') {
      return customColorInput.value.trim() || 'Custom (unspecified)';
    }
    return key;
  }

  function getSelectedHarderOption() {
    if (!harderOptions) return 'Not specified';
    const selected = harderOptions.querySelector('.harder-option.selected');
    return selected ? selected.dataset.option : 'Not specified';
  }

  /* ------------------------------------------------------
     Step navigation — sequential fade & spring animation
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
     Page 1 — Yes / No with Dodging Physics
  ------------------------------------------------------ */
  let noClickCount = 0;

  function moveNoButton() {
    const positions = [
      { x: -95, y: -45, rot: -8 },
      { x: 95, y: 45, rot: 8 },
      { x: -80, y: 55, rot: -12 },
      { x: 85, y: -50, rot: 10 },
      { x: -115, y: 25, rot: -15 },
      { x: 110, y: -35, rot: 12 }
    ];
    const pos = positions[noClickCount % positions.length];

    btnNo.style.position = 'relative';
    btnNo.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    btnNo.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg)`;
  }

  btnYes.addEventListener('click', () => goToStep(2));

  btnNo.addEventListener('click', () => {
    noClickCount++;

    btnNo.classList.remove('shake');
    void btnNo.offsetWidth;
    btnNo.classList.add('shake');

    moveNoButton();

    if (noClickCount >= 2) {
      noMessage.textContent = 'try again, you are not rudhra please pass it to her 🫡';
      noMessage.classList.add('visible');
    }
  });

  btnNo.addEventListener('animationend', () => btnNo.classList.remove('shake'));

  /* ------------------------------------------------------
     Page 2 — What's harder & favourite colour
  ------------------------------------------------------ */
  harderOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      harderOptionBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

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
     Page 3 — reply & send email + Heart Burst Explosion
  ------------------------------------------------------ */
  function triggerHeartExplosion() {
    const symbols = ['♡', '♥', '✨', '🌸', '💖'];
    const count = 26;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-heart';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      const angle = (i / count) * 360 + (Math.random() * 20 - 10);
      const distance = 80 + Math.random() * 130;
      const rad = (angle * Math.PI) / 180;
      const cx = Math.cos(rad) * distance + 'px';
      const cy = Math.sin(rad) * distance - 35 + 'px';
      const crot = (Math.random() * 360 - 180) + 'deg';

      const rect = btnSend.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.setProperty('--cx', cx);
      el.style.setProperty('--cy', cy);
      el.style.setProperty('--crot', crot);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  }

  btnSend.addEventListener('click', async () => {
    const message = replyInput.value.trim();
    const singer = singerInput ? singerInput.value.trim() : '';
    const colour = getSelectedColor();
    const harderChoice = getSelectedHarderOption();

    btnSend.disabled = true;
    btnSend.textContent = 'Sending...';

    // Trigger visual heart burst effect!
    triggerHeartExplosion();

    try {
      await fetch('https://formsubmit.co/ajax/nandhakumar8112005@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'New message from your website! ❤️',
          _template: 'table',
          _captcha: 'false',
          'Favourite Singer': singer || 'Not specified',
          'What’s Harder': harderChoice,
          'Favourite Colour': colour,
          'Message': message || '(No text message written)'
        })
      });
    } catch (err) {
      console.error('Error sending email:', err);
    } finally {
      btnSend.textContent = 'Sent ❤️';
      thankYouMsg.classList.add('visible');
      replyInput.value = '';
      replyInput.blur();
    }
  });

  /* ------------------------------------------------------
     3D Parallax Tilt Effect on Cards
  ------------------------------------------------------ */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -5;
      const tiltY = (x / (rect.width / 2)) * 5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });



  /* ------------------------------------------------------
     Ambient floating hearts, notes & particles
  ------------------------------------------------------ */
  const SYMBOLS = ['♡', '♥', '♪', '♫', 'dot', 'dot'];
  const MAX_FLOATIES = 16;

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
