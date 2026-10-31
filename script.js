/**
 * TATTVA MAESTRO - JAVASCRIPT
 * Ambient floating numbers canvas, constellation connections,
 * mouse parallax, and dynamic rotating numerology keywords.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. MOVING NUMBERS & SACRED PARTICLES CANVAS
     ========================================================================== */

  const canvas = document.getElementById('numbersCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Sacred numbers and glyphs in Vedic & Western numerology
  const NUMEROLOGY_SYMBOLS = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '11', '22', '33', '108', '7', '9', '3', '8', '∞', 'φ'
  ];

  // Mouse position for gentle repulsion/parallax
  const mouse = {
    x: width / 2,
    y: height / 2,
    active: false,
    radius: 130
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
      this.size = isMaster ? Math.random() * 14 + 22 : Math.random() * 14 + 14;

      // Speed & drift
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = -(Math.random() * 0.55 + 0.25);

      // Opacity & pulsing
      this.baseOpacity = Math.random() * 0.38 + 0.14;
      this.opacity = this.baseOpacity;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulseAngle = Math.random() * Math.PI * 2;

      // Subtle rotation
      this.rotation = (Math.random() - 0.5) * 0.35;
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

})();
