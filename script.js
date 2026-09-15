/**
 * APPLE IPHONE 16 PRO FLAGSHIP INTERACTIVE EXPERIENCE
 * - Procedural 3D Canvas Phone Engine with Physics & Lighting
 * - Dynamic Island State Machine
 * - Camera Control Interactive Viewfinder
 * - Bento Grid Mouse Spotlight
 * - Spatial Audio Waveform Visualizer
 * - Real-time Configuration & Trade-In Simulator
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================================
     1. FINISH COLOR PALETTES & STATE
     ========================================================================== */
  const FINISHES = {
    desert: {
      name: "Desert Titanium",
      bodyColor: "#a38269",
      rimLight: "#e2bca0",
      darkRim: "#473426",
      ambientGlow: "rgba(195, 150, 115, 0.2)",
      specular: "#fff2e8"
    },
    natural: {
      name: "Natural Titanium",
      bodyColor: "#7e7c77",
      rimLight: "#bfbcb5",
      darkRim: "#383734",
      ambientGlow: "rgba(146, 143, 137, 0.2)",
      specular: "#ffffff"
    },
    white: {
      name: "White Titanium",
      bodyColor: "#d2d3d6",
      rimLight: "#ffffff",
      darkRim: "#5e6066",
      ambientGlow: "rgba(224, 225, 227, 0.25)",
      specular: "#ffffff"
    },
    black: {
      name: "Black Titanium",
      bodyColor: "#2a292d",
      rimLight: "#545358",
      darkRim: "#111113",
      ambientGlow: "rgba(50, 49, 52, 0.3)",
      specular: "#b0afb5"
    }
  };

  let currentFinish = FINISHES.desert;

  /* ==========================================================================
     2. 3D PROCEDURAL CANVAS ENGINE (iPhone 16 Pro)
     ========================================================================== */
  const canvas = document.getElementById("phoneCanvas");
  const ctx = canvas.getContext("2d");

  // Phone 3D Rotation state
  let rotY = 0.45;       // Initial angle showing side/rear
  let rotX = 0.05;
  let targetRotY = 0.45;
  let targetRotX = 0.05;
  let isDragging = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let lastMouseX = 0;
  let velocityY = 0;
  let isHovered = false;

  // Set high-DPI canvas
  function setupCanvasDPI() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 700, 750);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
  }
  setupCanvasDPI();
  window.addEventListener("resize", setupCanvasDPI);

  // Drag interaction
  const viewport = document.getElementById("canvasViewport");

  viewport.addEventListener("mousedown", (e) => {
    isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    lastMouseX = e.clientX;
    velocityY = 0;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      // Subtle parallax tilt when hovering
      const rect = viewport.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        targetRotY = 0.45 + nx * 0.35;
        targetRotX = 0.05 - ny * 0.15;
      }
      return;
    }
    const deltaX = e.clientX - lastMouseX;
    velocityY = deltaX * 0.008;
    targetRotY += velocityY;
    lastMouseX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch controls for mobile
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      velocityY = 0;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastMouseX;
      velocityY = deltaX * 0.01;
      targetRotY += velocityY;
      lastMouseX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Render Loop
  function renderPhone3D() {
    const w = canvas.clientWidth || 700;
    const h = canvas.clientHeight || 700;

    ctx.clearRect(0, 0, w, h);

    // Physics smoothing
    if (!isDragging) {
      velocityY *= 0.94;
      targetRotY += velocityY;
      // Gentle idle oscillation
      targetRotY += Math.sin(Date.now() * 0.001) * 0.001;
    }
    rotY += (targetRotY - rotY) * 0.08;
    rotX += (targetRotX - rotX) * 0.08;

    const centerX = w / 2;
    const centerY = h / 2 - 10;
    const phoneWidth = 240;
    const phoneHeight = 490;
    const cornerRadius = 46;
    const phoneThickness = 26;

    // Projected horizontal scale based on cos(rotY)
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    // Floor Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + phoneHeight / 2 + 55, Math.abs(cosY) * 160 + 50, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.filter = "blur(18px)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotX);

    // Determine if looking at back or front
    const isBackFacing = cosY >= 0;
    const currentScaleX = cosY;

    // Draw Grade 5 Titanium Side Band (Extrusion)
    const bandStep = sinY * phoneThickness;
    
    // Draw titanium rim/band
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, -phoneWidth / 2 * currentScaleX + bandStep, -phoneHeight / 2, phoneWidth * currentScaleX, phoneHeight, cornerRadius);
    roundRect(ctx, -phoneWidth / 2 * currentScaleX, -phoneHeight / 2, phoneWidth * currentScaleX, phoneHeight, cornerRadius);
    
    const bandGrad = ctx.createLinearGradient(-phoneWidth / 2, -phoneHeight / 2, phoneWidth / 2, phoneHeight / 2);
    bandGrad.addColorStop(0, currentFinish.darkRim);
    bandGrad.addColorStop(0.3, currentFinish.rimLight);
    bandGrad.addColorStop(0.7, currentFinish.bodyColor);
    bandGrad.addColorStop(1, currentFinish.darkRim);
    ctx.fillStyle = bandGrad;
    ctx.fill();
    ctx.restore();

    // Main Phone Body (Rear Matte Glass or Front OLED)
    ctx.save();
    ctx.scale(currentScaleX, 1);

    ctx.beginPath();
    roundRect(ctx, -phoneWidth / 2, -phoneHeight / 2, phoneWidth, phoneHeight, cornerRadius);

    if (isBackFacing) {
      // REAR: Textured Matte AG Glass
      const glassGrad = ctx.createRadialGradient(0, -100, 30, 0, 50, 320);
      glassGrad.addColorStop(0, currentFinish.rimLight);
      glassGrad.addColorStop(0.4, currentFinish.bodyColor);
      glassGrad.addColorStop(1, currentFinish.darkRim);
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Frosted specular sheen
      ctx.save();
      ctx.clip();
      const sheenGrad = ctx.createLinearGradient(-phoneWidth, -phoneHeight, phoneWidth, phoneHeight);
      sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      sheenGrad.addColorStop(0.5, "transparent");
      sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0.08)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-phoneWidth / 2, -phoneHeight / 2, phoneWidth, phoneHeight);
      ctx.restore();

      // Subtle Apple Logo
      ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
      ctx.font = "32px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("", 0, 10);

      // Camera Bump Island (Top-Left)
      const bumpSize = 112;
      const bumpX = -phoneWidth / 2 + 14;
      const bumpY = -phoneHeight / 2 + 14;
      const bumpRadius = 32;

      ctx.save();
      ctx.beginPath();
      roundRect(ctx, bumpX, bumpY, bumpSize, bumpSize, bumpRadius);
      // Bump shadow and glass plateau
      ctx.fillStyle = currentFinish.darkRim;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 12;
      ctx.fill();

      const bumpPlateauGrad = ctx.createLinearGradient(bumpX, bumpY, bumpX + bumpSize, bumpY + bumpSize);
      bumpPlateauGrad.addColorStop(0, currentFinish.bodyColor);
      bumpPlateauGrad.addColorStop(1, currentFinish.darkRim);
      ctx.fillStyle = bumpPlateauGrad;
      ctx.fill();

      // Triple Sapphire Camera Lenses
      drawCameraLens(ctx, bumpX + 32, bumpY + 34, 20); // Main 48MP
      drawCameraLens(ctx, bumpX + 32, bumpY + 80, 20); // 5x Telephoto
      drawCameraLens(ctx, bumpX + 78, bumpY + 57, 20); // 48MP Ultra Wide

      // True Tone Flash
      ctx.beginPath();
      ctx.arc(bumpX + 80, bumpY + 28, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#fffae8";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.stroke();

      // LiDAR Scanner
      ctx.beginPath();
      ctx.arc(bumpX + 80, bumpY + 86, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#151515";
      ctx.fill();

      ctx.restore();

    } else {
      // FRONT: Super Retina XDR OLED Display
      ctx.fillStyle = "#000000";
      ctx.fill();

      // Border Reduction Structure (BRS) Ultra-thin bezel
      ctx.strokeStyle = "#1a1a1c";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Lock Screen Ambient Glow Wallpaper
      ctx.save();
      ctx.clip();

      const oledGlow = ctx.createRadialGradient(0, -60, 20, 0, 40, 200);
      oledGlow.addColorStop(0, "#4a2d1d");
      oledGlow.addColorStop(0.7, "#140c08");
      oledGlow.addColorStop(1, "#000000");
      ctx.fillStyle = oledGlow;
      ctx.fillRect(-phoneWidth / 2, -phoneHeight / 2, phoneWidth, phoneHeight);

      // Lock Screen Clock
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "bold 46px -apple-system, Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("9:41", 0, -phoneHeight / 2 + 120);

      // Dynamic Island Pill
      ctx.beginPath();
      roundRect(ctx, -40, -phoneHeight / 2 + 20, 80, 24, 12);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // Outer Edge Rim Highlight
    ctx.strokeStyle = currentFinish.rimLight;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
    ctx.restore();

    requestAnimationFrame(renderPhone3D);
  }

  function drawCameraLens(ctx, x, y, radius) {
    // Metal bezel ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#3a3a3c";
    ctx.fill();
    ctx.strokeStyle = currentFinish.rimLight;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dark sapphire crystal lens
    ctx.beginPath();
    ctx.arc(x, y, radius - 3, 0, Math.PI * 2);
    const lensGrad = ctx.createRadialGradient(x - 2, y - 2, 2, x, y, radius);
    lensGrad.addColorStop(0, "#1c2438");
    lensGrad.addColorStop(0.6, "#0a0c10");
    lensGrad.addColorStop(1, "#020304");
    ctx.fillStyle = lensGrad;
    ctx.fill();

    // Blue-violet anti-reflective lens coat reflection
    ctx.beginPath();
    ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(80, 140, 255, 0.6)";
    ctx.fill();

    ctx.restore();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  // Start 3D Engine
  renderPhone3D();

  /* ==========================================================================
     3. COLOR FINISH SWITCHER
     ========================================================================== */
  const finishButtons = document.querySelectorAll(".swatch-btn");
  const finishNameLabel = document.getElementById("finishName");
  const heroGlow = document.querySelector(".glow-1");

  finishButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      finishButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const finishKey = btn.dataset.finish;
      if (FINISHES[finishKey]) {
        currentFinish = FINISHES[finishKey];
        finishNameLabel.textContent = currentFinish.name;

        // Animate ambient glow color
        if (heroGlow) {
          heroGlow.style.background = `radial-gradient(circle, ${currentFinish.ambientGlow} 0%, transparent 70%)`;
        }

        // Trigger gentle spin toward rear to show off color
        targetRotY = 0.45;
      }
    });
  });

  /* ==========================================================================
     4. DYNAMIC ISLAND STATE MACHINE
     ========================================================================== */
  const dynamicIsland = document.getElementById("dynamicIsland");
  const islandChips = document.querySelectorAll(".ctrl-chip");
  const islandTimerText = document.getElementById("islandTimerText");

  const ISLAND_STATES = ["music", "timer", "call", "faceid"];
  let currentIslandIndex = 0;

  function setIslandState(stateName) {
    dynamicIsland.className = `dynamic-island-pill state-${stateName}`;
    currentIslandIndex = ISLAND_STATES.indexOf(stateName);

    islandChips.forEach(chip => {
      if (chip.dataset.state === stateName) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  // Click on chips to change state
  islandChips.forEach(chip => {
    chip.addEventListener("click", () => {
      setIslandState(chip.dataset.state);
    });
  });

  // Tap on the island pill directly to cycle through states
  dynamicIsland.addEventListener("click", () => {
    currentIslandIndex = (currentIslandIndex + 1) % ISLAND_STATES.length;
    setIslandState(ISLAND_STATES[currentIslandIndex]);
  });

  // Live timer tick for Timer state
  let timerSeconds = 298; // 4m 58s
  setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      const m = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
      const s = (timerSeconds % 60).toString().padStart(2, "0");
      if (islandTimerText) {
        islandTimerText.textContent = `${m}:${s}`;
      }
    }
  }, 1000);

  /* ==========================================================================
     5. CAMERA CONTROL INTERACTIVE PLAYGROUND
     ========================================================================== */
  const zoomSlider = document.getElementById("zoomSlider");
  const zoomValue = document.getElementById("zoomValue");
  const viewfinderScene = document.getElementById("viewfinderScene");
  const zoomButtons = document.querySelectorAll(".zoom-btn");
  const shutterBtn = document.getElementById("shutterBtn");
  const cameraFlash = document.getElementById("cameraFlash");
  const styleChips = document.querySelectorAll(".style-chip");
  const hudStyle = document.getElementById("hudStyle");

  const FOCAL_MAP = {
    0.5: { mm: "13 mm", scale: 0.8 },
    1.0: { mm: "24 mm", scale: 1.0 },
    2.0: { mm: "48 mm", scale: 1.45 },
    5.0: { mm: "120 mm", scale: 2.3 }
  };

  function updateZoom(factor) {
    const clamped = Math.max(0.5, Math.min(5.0, parseFloat(factor)));
    zoomSlider.value = clamped;

    // Determine optical equivalent
    let mm = "24 mm";
    if (clamped <= 0.8) mm = "13 mm (Ultra Wide)";
    else if (clamped <= 1.5) mm = `${Math.round(24 * clamped)} mm (Fusion)`;
    else if (clamped <= 3.0) mm = `${Math.round(24 * clamped)} mm (Telephoto)`;
    else mm = "120 mm (5x Tetraprism)";

    zoomValue.textContent = `${clamped.toFixed(1)}x (${mm})`;

    // Scale scene with smooth transform
    const visualScale = 0.75 + (clamped - 0.5) * 0.4;
    viewfinderScene.style.transform = `scale(${visualScale})`;

    // Sync zoom buttons
    zoomButtons.forEach(btn => {
      const bZoom = parseFloat(btn.dataset.zoom);
      if (Math.abs(bZoom - clamped) < 0.2) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  if (zoomSlider) {
    zoomSlider.addEventListener("input", (e) => {
      updateZoom(e.target.value);
    });
  }

  zoomButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const zoom = parseFloat(btn.dataset.zoom);
      updateZoom(zoom);
    });
  });

  // Photographic Styles switcher
  const STYLES_FILTERS = {
    vibrant: { filter: "contrast(1.15) saturate(1.25)", label: "VIBRANT STYLE" },
    warm: { filter: "sepia(0.25) saturate(1.1) brightness(1.05)", label: "WARM AMBER" },
    cool: { filter: "hue-rotate(190deg) saturate(1.1)", label: "COOL BLUE" },
    mono: { filter: "grayscale(1) contrast(1.3)", label: "DRAMATIC B&W" }
  };

  styleChips.forEach(chip => {
    chip.addEventListener("click", () => {
      styleChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const styleKey = chip.dataset.style;
      if (STYLES_FILTERS[styleKey]) {
        viewfinderScene.style.filter = STYLES_FILTERS[styleKey].filter;
        hudStyle.textContent = STYLES_FILTERS[styleKey].label;
      }
    });
  });

  // Shutter Flash & Tactile Click
  if (shutterBtn) {
    shutterBtn.addEventListener("click", () => {
      // Flash trigger
      cameraFlash.classList.add("flash-active");
      setTimeout(() => {
        cameraFlash.classList.remove("flash-active");
      }, 120);

      // Synthesize subtle Apple haptic shutter click using Web Audio API
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      } catch (e) {
        // AudioContext ignored if blocked
      }
    });
  }

  /* ==========================================================================
     6. BENTO GRID SPOTLIGHT EFFECT
     ========================================================================== */
  const bentoGrid = document.getElementById("bentoGrid");
  const bentoCards = document.querySelectorAll(".bento-card");

  if (bentoGrid) {
    bentoGrid.addEventListener("mousemove", (e) => {
      bentoCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }

  /* ==========================================================================
     7. SPATIAL AUDIO SINE WAVE VISUALIZER
     ========================================================================== */
  const soundwaveCanvas = document.getElementById("soundwaveCanvas");
  if (soundwaveCanvas) {
    const swCtx = soundwaveCanvas.getContext("2d");
    let waveStep = 0;

    function drawSoundwave() {
      const w = soundwaveCanvas.width;
      const h = soundwaveCanvas.height;
      swCtx.clearRect(0, 0, w, h);

      swCtx.beginPath();
      swCtx.moveTo(0, h / 2);

      for (let x = 0; x < w; x++) {
        const angle = (x * 0.04) + waveStep;
        const y = h / 2 + Math.sin(angle) * 16 * Math.sin(x / w * Math.PI);
        swCtx.lineTo(x, y);
      }

      swCtx.strokeStyle = "#2997ff";
      swCtx.lineWidth = 2.5;
      swCtx.shadowColor = "#2997ff";
      swCtx.shadowBlur = 8;
      swCtx.stroke();

      waveStep += 0.06;
      requestAnimationFrame(drawSoundwave);
    }
    drawSoundwave();

    // Audio mode buttons
    const audioChips = document.querySelectorAll(".audio-chip");
    audioChips.forEach(chip => {
      chip.addEventListener("click", () => {
        audioChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });
  }

  /* ==========================================================================
     8. ORDER & CONFIGURATION MODAL SIMULATOR
     ========================================================================== */
  const orderModal = document.getElementById("orderModal");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const buyTriggers = document.querySelectorAll(".buy-modal-trigger, #btnBuyNow, #heroBuyBtn");
  const modelOpts = document.querySelectorAll(".config-opt[data-model]");
  const storageOpts = document.querySelectorAll(".config-opt[data-storage]");
  const modalTotal = document.getElementById("modalTotal");

  let basePrice = 999;
  let storageAddon = 0;

  function updateTotal() {
    if (modalTotal) {
      modalTotal.textContent = `$${(basePrice + storageAddon).toLocaleString()}.00`;
    }
  }

  function openModal() {
    if (orderModal) {
      orderModal.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (orderModal) {
      orderModal.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
  }

  buyTriggers.forEach(btn => btn.addEventListener("click", openModal));
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  modelOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      modelOpts.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      basePrice = parseInt(opt.dataset.price, 10) || 999;
      updateTotal();
    });
  });

  storageOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      storageOpts.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      storageAddon = parseInt(opt.dataset.addon, 10) || 0;
      updateTotal();
    });
  });

  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      btnCheckout.textContent = "Added to Bag ✓";
      btnCheckout.style.background = "#30d158";
      setTimeout(() => {
        closeModal();
        btnCheckout.textContent = "Continue to Bag";
        btnCheckout.style.background = "";
      }, 1000);
    });
  }

  /* ==========================================================================
     9. SCROLL HIGHLIGHT & SUBNAV ACTIVE LINK
     ========================================================================== */
  const subLinks = document.querySelectorAll(".sub-link");
  const sections = document.querySelectorAll("main section");

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute("id");
      }
    });

    subLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });

});
