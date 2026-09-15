(() => {
  'use strict';

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const pages = {
    1: document.getElementById('page1'),
    2: document.getElementById('page2'),
    3: document.getElementById('page3'),
    4: document.getElementById('page4'),
    5: document.getElementById('page5'),
  };
  const dots = document.querySelectorAll('.step-dot');

  // Page 1
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const noMessage = document.getElementById('noMessage');

  // Page 2
  const singerInput = document.getElementById('singerInput');
  const harderOptions = document.getElementById('harderOptions');
  const harderOptionBtns = harderOptions ? harderOptions.querySelectorAll('.harder-option') : [];
  const snoozeOptions = document.getElementById('snoozeOptions');
  const snoozeOptionBtns = snoozeOptions ? snoozeOptions.querySelectorAll('.harder-option') : [];
  const skillOptions = document.getElementById('skillOptions');
  const skillOptionBtns = skillOptions ? skillOptions.querySelectorAll('.harder-option') : [];
  const colorOptions = document.getElementById('colorOptions');
  const swatches = colorOptions ? colorOptions.querySelectorAll('.luxury-swatch') : [];
  const customColorInput = document.getElementById('customColorInput');
  const btnContinue = document.getElementById('btnContinue');

  // Page 3
  const btnEnjoyYes = document.getElementById('btnEnjoyYes');
  const btnEnjoyWeird = document.getElementById('btnEnjoyWeird');
  const popupYes = document.getElementById('popupYes');
  const popupWeird = document.getElementById('popupWeird');
  const popupYesNext = document.getElementById('popupYesNext');
  const popupWeirdNext = document.getElementById('popupWeirdNext');

  // Page 4
  const btnSend = document.getElementById('btnSend');
  const replyInput = document.getElementById('replyInput');
  const thankYouMsg = document.getElementById('thankYouMsg');
  const btnGoToGift = document.getElementById('btnGoToGift');

  // Page 5
  const giftBox = document.getElementById('giftBox');
  const luxuryBox = document.getElementById('luxuryBox');
  const giftPopup = document.getElementById('giftPopup');
  const giftPopupClose = document.getElementById('giftPopupClose');
  const giftPopupBackdrop = document.getElementById('giftPopupBackdrop');

  const floatiesLayer = document.getElementById('floaties');

  let currentStep = 1;

  /* ==========================================================================
     STEP NAVIGATION
     ========================================================================== */
  function goToStep(stepNumber) {
    const current = pages[currentStep];
    const next = pages[stepNumber];
    if (!next || next === current) return;

    current.classList.remove('show');

    window.setTimeout(() => {
      current.classList.remove('active');
      next.classList.add('active');
      void next.offsetWidth; // Force reflow
      requestAnimationFrame(() => next.classList.add('show'));
      currentStep = stepNumber;
      updateProgress(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  function updateProgress(stepNumber) {
    dots.forEach((dot) => {
      dot.classList.toggle('active', Number(dot.dataset.step) === stepNumber);
    });
  }

  // Clickable progress dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = Number(dot.dataset.step);
      if (step <= currentStep) {
        goToStep(step);
      }
    });
  });

  /* ==========================================================================
     PAGE 1: VERIFICATION
     ========================================================================== */
  if (btnYes) {
    btnYes.addEventListener('click', () => goToStep(2));
  }

  if (btnNo) {
    btnNo.addEventListener('click', () => {
      if (noMessage) {
        noMessage.classList.add('visible');
      }
    });
  }

  /* ==========================================================================
     PAGE 2: COUNTDOWN & QUIZ
     ========================================================================== */
  const bdayDaysEl = document.getElementById('bdayDays');
  const bdayHoursEl = document.getElementById('bdayHours');
  const bdayMinsEl = document.getElementById('bdayMins');
  const bdaySecsEl = document.getElementById('bdaySecs');

  function getNextBirthday() {
    const now = new Date();
    let year = now.getFullYear();
    let bday = new Date(year, 2, 24, 0, 0, 0); // March 24
    if (now >= bday) {
      bday = new Date(year + 1, 2, 24, 0, 0, 0);
    }
    return bday;
  }

  function updateBdayCountdown() {
    const now = new Date();
    const target = getNextBirthday();
    const diff = target - now;

    if (diff <= 0) {
      if (bdayDaysEl) bdayDaysEl.textContent = '✧';
      if (bdayHoursEl) bdayHoursEl.textContent = '00';
      if (bdayMinsEl) bdayMinsEl.textContent = '00';
      if (bdaySecsEl) bdaySecsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (bdayDaysEl) bdayDaysEl.textContent = String(days).padStart(2, '0');
    if (bdayHoursEl) bdayHoursEl.textContent = String(hours).padStart(2, '0');
    if (bdayMinsEl) bdayMinsEl.textContent = String(mins).padStart(2, '0');
    if (bdaySecsEl) bdaySecsEl.textContent = String(secs).padStart(2, '0');
  }

  updateBdayCountdown();
  setInterval(updateBdayCountdown, 1000);

  // Form selections
  function getSelectedColor() {
    const selected = colorOptions ? colorOptions.querySelector('.luxury-swatch.selected') : null;
    if (!selected) return null;
    const key = selected.dataset.color;
    if (key === 'other') {
      const val = customColorInput ? customColorInput.value.trim() : '';
      return val || null;
    }
    return key;
  }

  function getSelectedHarderOption() {
    if (!harderOptions) return null;
    const selected = harderOptions.querySelector('.harder-option.selected');
    return selected ? selected.dataset.option : null;
  }

  function getSelectedSnoozeOption() {
    if (!snoozeOptions) return null;
    const selected = snoozeOptions.querySelector('.harder-option.selected');
    return selected ? selected.dataset.option : null;
  }

  function getSelectedSkillOption() {
    if (!skillOptions) return null;
    const selected = skillOptions.querySelector('.harder-option.selected');
    return selected ? selected.dataset.option : null;
  }

  function allAnswered() {
    const colour = getSelectedColor();
    const singer = singerInput ? singerInput.value.trim() : null;
    const harder = getSelectedHarderOption();
    const snooze = getSelectedSnoozeOption();
    const skill = getSelectedSkillOption();
    return Boolean(colour && singer && harder && snooze && skill);
  }

  function refreshContinueBtn() {
    if (btnContinue) {
      btnContinue.disabled = !allAnswered();
    }
  }

  // Radio button choice groups
  function setupChoiceGroup(btnList) {
    btnList.forEach((btn) => {
      btn.addEventListener('click', () => {
        btnList.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        refreshContinueBtn();
      });
    });
  }

  setupChoiceGroup(harderOptionBtns);
  setupChoiceGroup(snoozeOptionBtns);
  setupChoiceGroup(skillOptionBtns);

  if (singerInput) {
    singerInput.addEventListener('input', refreshContinueBtn);
  }

  // Swatches
  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      swatches.forEach((s) => s.classList.remove('selected'));
      swatch.classList.add('selected');

      const colorKey = swatch.dataset.color;
      if (colorKey === 'other') {
        if (customColorInput) {
          customColorInput.classList.remove('hidden');
          customColorInput.focus();
        }
      } else {
        if (customColorInput) {
          customColorInput.classList.add('hidden');
        }
      }
      refreshContinueBtn();
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', refreshContinueBtn);
  }

  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      if (!btnContinue.disabled) {
        goToStep(3);
      }
    });
  }

  /* ==========================================================================
     PAGE 3: INTERMISSION MODALS
     ========================================================================== */
  function showModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('popup-visible'));
  }

  function hideModal(modal, andGoToStep) {
    if (!modal) return;
    modal.classList.remove('popup-visible');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (andGoToStep) goToStep(andGoToStep);
    }, 300);
  }

  if (btnEnjoyYes) {
    btnEnjoyYes.addEventListener('click', () => showModal(popupYes));
  }

  if (btnEnjoyWeird) {
    btnEnjoyWeird.addEventListener('click', () => showModal(popupWeird));
  }

  if (popupYesNext) {
    popupYesNext.addEventListener('click', () => hideModal(popupYes, 4));
  }

  if (popupWeirdNext) {
    popupWeirdNext.addEventListener('click', () => hideModal(popupWeird, 4));
  }

  /* ==========================================================================
     PAGE 4: NOTE DISPATCH & PARTICLES
     ========================================================================== */
  function triggerGoldParticleBurst(originEl) {
    const symbols = ['✦', '✧', '✨', '•', '✧'];
    const count = 24;
    const rect = originEl.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-ember';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.color = Math.random() > 0.4 ? '#dfb76c' : '#f5f2eb';

      const angle = (i / count) * 360 + (Math.random() * 20 - 10);
      const distance = 60 + Math.random() * 120;
      const rad = (angle * Math.PI) / 180;
      const cx = Math.cos(rad) * distance + 'px';
      const cy = Math.sin(rad) * distance - 30 + 'px';
      const crot = (Math.random() * 360 - 180) + 'deg';

      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.setProperty('--cx', cx);
      el.style.setProperty('--cy', cy);
      el.style.setProperty('--crot', crot);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  }

  if (btnSend) {
    btnSend.addEventListener('click', async () => {
      const message = replyInput ? replyInput.value.trim() : '';
      const singer = singerInput ? singerInput.value.trim() : '';
      const colour = getSelectedColor();
      const harderChoice = getSelectedHarderOption();
      const snoozeChoice = getSelectedSnoozeOption();
      const skillChoice = getSelectedSkillOption();

      btnSend.disabled = true;
      btnSend.innerHTML = '<span>Sending...</span>';

      triggerGoldParticleBurst(btnSend);

      try {
        await fetch('https://formsubmit.co/ajax/nandhakumar8112005@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: 'New letter from Rudhra ✨',
            _template: 'table',
            _captcha: 'false',
            'Signature Shade': colour || 'Not specified',
            'Favourite Singer': singer || 'Not specified',
            'Harder Choice': harderChoice || 'Not specified',
            'Morning Habit': snoozeChoice || 'Not specified',
            'Gifted Skill Pick': skillChoice || 'Not specified',
            'Her Personal Message': message || '(No message written)'
          })
        });
      } catch (err) {
        console.error('Error sending message:', err);
      } finally {
        btnSend.innerHTML = '<span>Sent ✦</span>';
        if (thankYouMsg) thankYouMsg.classList.add('visible');
        if (replyInput) replyInput.value = '';
        if (btnGoToGift) {
          btnGoToGift.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  if (btnGoToGift) {
    btnGoToGift.addEventListener('click', () => goToStep(5));
  }

  /* ==========================================================================
     PAGE 5: LUXURY KEEPSAKE BOX
     ========================================================================== */
  function openKeepsake() {
    if (!luxuryBox) return;

    luxuryBox.classList.add('is-open');
    if (giftBox) triggerGoldParticleBurst(giftBox);

    setTimeout(() => {
      if (giftPopup) {
        giftPopup.classList.remove('hidden');
        requestAnimationFrame(() => giftPopup.classList.add('popup-visible'));
      }
    }, 450);
  }

  function closeKeepsake() {
    if (!giftPopup) return;
    giftPopup.classList.remove('popup-visible');
    setTimeout(() => {
      giftPopup.classList.add('hidden');
      if (luxuryBox) luxuryBox.classList.remove('is-open');
    }, 350);
  }

  if (giftBox) {
    giftBox.addEventListener('click', openKeepsake);
    giftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openKeepsake();
      }
    });
  }

  if (giftPopupClose) {
    giftPopupClose.addEventListener('click', closeKeepsake);
  }

  if (giftPopupBackdrop) {
    giftPopupBackdrop.addEventListener('click', closeKeepsake);
  }

  /* ==========================================================================
     PHYSICAL 3D TILT EFFECT ON CARDS
     ========================================================================== */
  document.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -3.5;
      const tiltY = (x / (rect.width / 2)) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* ==========================================================================
     AMBIENT DRIFTING GOLDEN EMBERS
     ========================================================================== */
  const MAX_EMBERS = 14;

  function spawnEmber() {
    if (!floatiesLayer || floatiesLayer.childElementCount >= MAX_EMBERS) return;

    const el = document.createElement('span');
    el.className = 'stardust-ember';

    const leftPercent = 4 + Math.random() * 92;
    const duration = 7 + Math.random() * 6;
    const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';

    el.style.left = `${leftPercent}%`;
    el.style.bottom = '10%';
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--duration', `${duration}s`);

    el.addEventListener('animationend', () => el.remove());
    floatiesLayer.appendChild(el);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnEmber, i * 600);
    }
    setInterval(spawnEmber, 1800);
  }

})();
