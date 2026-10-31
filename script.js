/**
 * TATTVA MAESTRO - JAVASCRIPT
 * Dynamic moving numbers canvas, interactive life-path calculator,
 * rotating headlines, and Web Audio synthesizer.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. MOVING NUMBERS & PARTICLES CANVAS
     ========================================================================== */

  const canvas = document.getElementById('numbersCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Sacred numbers and symbols in numerology
  const NUMEROLOGY_SYMBOLS = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '11', '22', '33', '108', '7', '9', '3', '8', '∞', 'φ'
  ];

  // Mouse position for gentle repulsion/parallax
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false,
    radius: 120
  };

  class FloatingNumber {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.text = NUMEROLOGY_SYMBOLS[Math.floor(Math.random() * NUMEROLOGY_SYMBOLS.length)];
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;

      // Master numbers and sacred symbols are slightly larger
      const isMaster = ['11', '22', '33', '108', '∞'].includes(this.text);
      this.size = isMaster ? Math.random() * 12 + 20 : Math.random() * 14 + 14;

      // Speed & drift
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = -(Math.random() * 0.55 + 0.25);

      // Opacity & pulsing
      this.baseOpacity = Math.random() * 0.35 + 0.12;
      this.opacity = this.baseOpacity;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulseAngle = Math.random() * Math.PI * 2;

      // Subtle rotation
      this.rotation = (Math.random() - 0.5) * 0.4;
      this.vRot = (Math.random() - 0.5) * 0.005;

      // Color variation (Cosmic Gold vs Starlight Amethyst)
      this.isGold = Math.random() > 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRot;

      // Pulse opacity
      this.pulseAngle += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulseAngle) * 0.08;

      // Gentle mouse interaction
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 1.5;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      // Respawn when moved out of view
      if (this.y < -40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      ctx.font = `${Math.round(this.size)}px 'Space Grotesk', 'Cinzel', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (this.isGold) {
        ctx.fillStyle = `rgba(245, 194, 83, ${Math.max(0, this.opacity)})`;
        ctx.shadowColor = 'rgba(245, 194, 83, 0.4)';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = `rgba(167, 139, 250, ${Math.max(0, this.opacity)})`;
        ctx.shadowColor = 'rgba(167, 139, 250, 0.35)';
        ctx.shadowBlur = 8;
      }

      ctx.fillText(this.text, 0, 0);
      ctx.restore();
    }
  }

  // Determine number of elements based on screen size
  function getParticleCount() {
    return Math.floor((width * height) / 18000) + 25;
  }

  let particles = [];
  function initParticles() {
    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new FloatingNumber());
    }
  }

  // Draw delicate constellation threads between nearby numbers
  function drawConnections() {
    const maxDist = 95;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawConnections();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  // Window resize handler with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }, 150);
  });

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  initParticles();
  animate();

  /* ==========================================================================
     2. DYNAMIC ROTATING NUMEROLOGY KEYWORDS
     ========================================================================== */

  const rotatingWords = document.querySelectorAll('.rotating-word');
  let currentWordIdx = 0;

  if (rotatingWords.length > 1) {
    setInterval(() => {
      rotatingWords[currentWordIdx].classList.remove('active');
      currentWordIdx = (currentWordIdx + 1) % rotatingWords.length;
      rotatingWords[currentWordIdx].classList.add('active');
    }, 3400);
  }

  /* ==========================================================================
     3. WEB AUDIO SYNTHESIZER (CELESTIAL CHIME)
     ========================================================================== */

  let audioCtx = null;
  let soundEnabled = false;

  const audioToggleBtn = document.getElementById('audioToggle');
  const soundIconOn = audioToggleBtn.querySelector('.sound-icon-on');
  const soundIconOff = audioToggleBtn.querySelector('.sound-icon-off');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a celestial multi-frequency chime chord (Golden Ratio / 432Hz harmonic roots)
  function playCelestialChime(baseFreq = 432) {
    if (!soundEnabled || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // Sacred harmonic ratios: Fundamental, 3rd, 5th, octave
      const frequencies = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

      frequencies.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        // Soft exponential decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + idx * 0.04 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 2.4);
      });
    } catch (e) {
      console.warn('Audio play notice:', e);
    }
  }

  audioToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    initAudio();

    if (soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      audioToggleBtn.setAttribute('title', 'Sound: Enabled (Click to mute)');
      playCelestialChime(528); // Solfeggio frequency 528Hz (Transformation & Miracles)
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
      audioToggleBtn.setAttribute('title', 'Sound: Muted (Click to enable)');
    }
  });

  // Start with audio muted by default for friendly UX
  soundIconOn.classList.add('hidden');
  soundIconOff.classList.remove('hidden');
  audioToggleBtn.setAttribute('title', 'Sound: Muted (Click to enable)');

  /* ==========================================================================
     4. INTERACTIVE LIFE PATH SNEAK PEEK CALCULATOR
     ========================================================================== */

  // Numerology Interpretations
  const NUMEROLOGY_ARCHETYPES = {
    1: {
      archetype: 'Number 1: The Pioneer & Sovereign Leader',
      desc: '"Governed by the Sun. Driven by supreme willpower, originality, independence, and the destiny to forge uncharted pathways."'
    },
    2: {
      archetype: 'Number 2: The Cosmic Harmonizer & Intuitive',
      desc: '"Governed by the Moon. Radiating diplomacy, profound empathy, grace, and the divine balance of universal duality."'
    },
    3: {
      archetype: 'Number 3: The Sacred Creator & Expressive Voice',
      desc: '"Governed by Jupiter. Blessed with creative spark, uplifting optimism, wisdom, and charismatic artistic expression."'
    },
    4: {
      archetype: 'Number 4: The Master Builder & Architect of Order',
      desc: '"Governed by Rahu/Uranus. Rooted in disciplined foundations, architectural genius, reliability, and enduring legacy."'
    },
    5: {
      archetype: 'Number 5: The Dynamic Visionary & Alchemist of Change',
      desc: '"Governed by Mercury. Catalyst of liberty, sharp intellect, worldly exploration, and rapid cosmic transformation."'
    },
    6: {
      archetype: 'Number 6: The Divine Nurturer & Harmonizer',
      desc: '"Governed by Venus. Embodying sacred love, domestic harmony, aesthetic beauty, and healing unconditional guardianship."'
    },
    7: {
      archetype: 'Number 7: The Mystical Seeker & Philosopher',
      desc: '"Governed by Ketu/Neptune. Guided by metaphysical wisdom, deep intuition, analytical mastery, and spiritual truth."'
    },
    8: {
      archetype: 'Number 8: The Sovereign Manifestor & Karmic Ruler',
      desc: '"Governed by Saturn. Commanding material abundance, karmic balance, strategic authority, and infinite resilience."'
    },
    9: {
      archetype: 'Number 9: The Universal Sage & Humanitarian',
      desc: '"Governed by Mars. The summit of single-digit wisdom, unconditional global compassions, completion, and cosmic awakening."'
    },
    11: {
      archetype: 'Master Number 11: The Spiritual Illuminator',
      desc: '"The psychic channel. Endowed with heightened spiritual illumination, prophetic vision, and visionary inspiration."'
    },
    22: {
      archetype: 'Master Number 22: The Master Builder of Realities',
      desc: '"The supreme visionary. Possesses the rare alchemy to transform celestial ideals into grand monumental tangible structures."'
    },
    33: {
      archetype: 'Master Number 33: The Master Teacher of Light',
      desc: '"The avatar of compassion. Vibrates with selfless service, universal healing energy, and spiritual upliftment of humanity."'
    }
  };

  /**
   * Calculate Life Path Number from YYYY-MM-DD
   * Supports standard single reduction (1-9) and Master Numbers (11, 22, 33)
   */
  function calculateLifePath(dateString) {
    if (!dateString) return null;

    const parts = dateString.split('-');
    if (parts.length !== 3) return null;

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    function reduceNum(n, preserveMaster = true) {
      let sum = String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      while (sum > 9) {
        if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
          return sum;
        }
        sum = String(sum).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      }
      return sum;
    }

    const rDay = reduceNum(day, false);
    const rMonth = reduceNum(month, false);
    const rYear = reduceNum(year, false);

    const total = rDay + rMonth + rYear;
    return reduceNum(total, true);
  }

  const dobInput = document.getElementById('dobInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const calcResult = document.getElementById('calcResult');
  const resultNumber = document.getElementById('resultNumber');
  const resultArchetype = document.getElementById('resultArchetype');
  const resultDesc = document.getElementById('resultDesc');

  // Set default sample date to today or a golden date
  dobInput.value = '1998-09-09';

  function triggerCalculation() {
    const val = dobInput.value;
    if (!val) {
      dobInput.focus();
      return;
    }

    const lifePath = calculateLifePath(val);
    if (!lifePath || !NUMEROLOGY_ARCHETYPES[lifePath]) return;

    const data = NUMEROLOGY_ARCHETYPES[lifePath];

    resultNumber.textContent = lifePath;
    resultArchetype.textContent = data.archetype;
    resultDesc.textContent = data.desc;

    calcResult.classList.remove('hidden');

    // Subtle audio chime
    playCelestialChime(lifePath * 45 + 300);
  }

  calculateBtn.addEventListener('click', triggerCalculation);
  dobInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      triggerCalculation();
    }
  });

  /* ==========================================================================
     5. NOTIFY FORM SUBMISSION & LOCAL PERSISTENCE
     ========================================================================== */

  const notifyForm = document.getElementById('notifyForm');
  const emailInput = document.getElementById('emailInput');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      formFeedback.className = 'form-feedback error';
      formFeedback.textContent = 'Please enter a valid email address to reserve your early access.';
      formFeedback.classList.remove('hidden');
      emailInput.focus();
      return;
    }

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('tattva_subscribers') || '[]');
      if (!existing.includes(email)) {
        existing.push({ email, timestamp: new Date().toISOString() });
        localStorage.setItem('tattva_subscribers', JSON.stringify(existing));
      }
    } catch (err) {
      // Ignore localStorage errors
    }

    // Success feedback
    formFeedback.className = 'form-feedback success';
    formFeedback.innerHTML = '✦ <strong>Cosmic alignment acknowledged.</strong> Your email has been added to our sacred early-access circle.';
    formFeedback.classList.remove('hidden');

    emailInput.value = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Invitation Reserved ✦</span>';

    playCelestialChime(639); // Solfeggio frequency 639Hz (Connecting & Relationships)

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Notify My Destiny</span><span class="btn-arrow">→</span>';
    }, 4500);
  });

})();
