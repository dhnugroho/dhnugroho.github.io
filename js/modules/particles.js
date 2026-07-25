export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let astronaut = null;
  let spacecraft = null;
  let satellite = null;
  let mouse = { x: null, y: null };
  let animationId = null;

  // Helper for roundRect compatibility
  function drawRoundRect(x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
  }

  function resizeCanvas() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    init();
    animate();
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.twinkleSpeed = Math.random() * 0.015 + 0.005;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      const roll = Math.random();
      if (roll < 0.8) {
        this.color = '226, 232, 240';
      } else {
        this.color = '56, 189, 248';
      }
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.2;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.currentOpacity + ')';
      ctx.fill();

      if (this.size > 1.3) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.currentOpacity * 0.08) + ')';
        ctx.fill();
      }
    }
  }

  // Single Real Astronaut Class
  class Astronaut {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = canvas.width * 0.2 + Math.random() * (canvas.width * 0.6);
      this.y = canvas.height * 0.2 + Math.random() * (canvas.height * 0.5);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.12 + Math.random() * 0.1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      this.scale = 0.68;
      this.angle = Math.atan2(this.vy, this.vx) - Math.PI / 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.0015;
      this.limbPhase = Math.random() * Math.PI * 2;
      this.tetherPhase = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotationSpeed;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.15;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      const p = 90;
      if (this.x < -p) this.x = canvas.width + p;
      if (this.x > canvas.width + p) this.x = -p;
      if (this.y < -p) this.y = canvas.height + p;
      if (this.y > canvas.height + p) this.y = -p;
    }

    draw(time) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale);

      const rightArmWave = Math.sin(time * 0.12 + this.limbPhase) * 0.55;
      const leftArmWave = Math.cos(time * 0.10 + this.limbPhase) * 0.45;
      const legWave = Math.sin(time * 0.03 + this.limbPhase) * 0.2;
      const tetherWave = Math.sin(time * 0.01 + this.tetherPhase) * 5;

      // 1. Safety Tether Line
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-10 + tetherWave, 25, 10 - tetherWave, 40, 0, 55);
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.22)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Backpack Jetpack
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      drawRoundRect(-7, -4, 14, 16, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.fillRect(-5, 12, 3, 2);
      ctx.fillRect(2, 12, 3, 2);

      if (Math.sin(time * 0.04) > 0.88) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.arc(-3.5, 15, 1.2, 0, Math.PI * 2);
        ctx.arc(3.5, 15, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Spacesuit Body
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      drawRoundRect(-6, -9, 12, 16, 4);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Mission Patch details
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-3, -5, 2.5, 2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(1, -5, 1.5, 1.5);

      // 4. Arms (Urgent Waving for Help in Microgravity)
      // Left Arm (Raised Out & Waving)
      ctx.save();
      ctx.translate(-6, -6);
      ctx.rotate(-1.2 + leftArmWave);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      drawRoundRect(-2.5, 0, 3.5, 9, 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(-0.8, 9, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Arm (Raised Overhead & Waving SOS)
      ctx.save();
      ctx.translate(6, -6);
      ctx.rotate(1.2 + rightArmWave);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      drawRoundRect(-1, 0, 3.5, 9, 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0.8, 9, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Legs
      // Left Leg
      ctx.save();
      ctx.translate(-3.5, 7);
      ctx.rotate(-0.1 + legWave);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      drawRoundRect(-2, 0, 3.5, 9, 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(-2, 7, 3.5, 2.5);
      ctx.restore();

      // Right Leg
      ctx.save();
      ctx.translate(3.5, 7);
      ctx.rotate(0.1 - legWave);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      drawRoundRect(-1.5, 0, 3.5, 9, 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(-1.5, 7, 3.5, 2.5);
      ctx.restore();

      // 6. Helmet & Gold Mirror Visor
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -12, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Mirror Visor
      ctx.beginPath();
      ctx.ellipse(0, -12, 4.8, 3.6, 0, 0, Math.PI * 2);
      const visorGrad = ctx.createLinearGradient(-3, -15, 3, -9);
      visorGrad.addColorStop(0, '#d97706');
      visorGrad.addColorStop(0.5, '#0284c7');
      visorGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = visorGrad;
      ctx.fill();

      // Reflection Arc
      ctx.beginPath();
      ctx.arc(-1.2, -13.2, 2, Math.PI * 1.1, Math.PI * 1.7);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();

      // 7. Humorous "help!" speech bubble floating upright near astronaut
      ctx.save();
      const bubbleX = this.x + 14;
      const bubbleY = this.y - 20 + Math.sin(time * 0.04) * 2;

      ctx.translate(bubbleX, bubbleY);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-5, 6);
      ctx.lineTo(-10, 12);
      ctx.lineTo(-1, 8);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fill();

      // Bubble box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      drawRoundRect(-14, -10, 32, 17, 4);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('help!', 2, -1.5);

      ctx.restore();
    }
  }

  // Spacecraft Class (Sleek Exploration Vessel)
  class Spacecraft {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = -80;
      this.y = canvas.height * 0.15 + Math.random() * (canvas.height * 0.4);
      this.vx = 0.18 + Math.random() * 0.1;
      this.vy = 0.04 + Math.random() * 0.05;
      this.scale = 0.72;
      this.angle = Math.atan2(this.vy, this.vx);
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;

      const p = 120;
      if (this.x > canvas.width + p || this.y > canvas.height + p) {
        this.reset();
      }
    }

    draw(time) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale);

      // Soft Ion Plasma Glow
      const engineGlow = 7 + Math.sin(time * 0.06) * 2;
      const plasmaGrad = ctx.createRadialGradient(-24, 0, 1, -24, 0, engineGlow);
      plasmaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
      plasmaGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.3)');
      plasmaGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = plasmaGrad;
      ctx.beginPath();
      ctx.arc(-24, 0, engineGlow, 0, Math.PI * 2);
      ctx.fill();

      // Main Hull
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(0, -9);
      ctx.lineTo(-20, -11);
      ctx.lineTo(-22, 0);
      ctx.lineTo(-20, 11);
      ctx.lineTo(0, 9);
      ctx.closePath();
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Ceramic Tile Top Layer
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(2, -5.5);
      ctx.lineTo(-14, -6);
      ctx.lineTo(-14, 0);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      // Solar Wings
      ctx.fillStyle = '#0369a1';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.8;
      // Top Wing
      ctx.fillRect(-10, -20, 14, 9);
      ctx.strokeRect(-10, -20, 14, 9);
      // Bottom Wing
      ctx.fillRect(-10, 11, 14, 9);
      ctx.strokeRect(-10, 11, 14, 9);

      // Cockpit Window
      ctx.beginPath();
      ctx.ellipse(10, -2, 3.8, 2.2, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Beacon Light
      if (Math.floor(time / 45) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-18, -10, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Satellite Class (Orbital Satellites with Solar Panels & Dish)
  class Satellite {
    constructor(delayOffset, initialX) {
      this.delayOffset = delayOffset || 0;
      this.reset(initialX);
    }

    reset(initialX) {
      if (initialX !== undefined) {
        this.x = initialX;
        this.y = Math.random() * (canvas.height * 0.7);
      } else {
        const side = Math.random() < 0.5 ? 0 : 1;
        if (side === 0) {
          this.x = -70;
          this.y = Math.random() * canvas.height;
        } else {
          this.x = canvas.width + 70;
          this.y = Math.random() * canvas.height;
        }
      }

      const isLeft = this.x < canvas.width / 2;
      this.vx = isLeft ? (0.1 + Math.random() * 0.08) : -(0.1 + Math.random() * 0.08);
      this.vy = (Math.random() - 0.5) * 0.06;

      this.scale = 0.65 + Math.random() * 0.12;
      this.angle = (Math.random() - 0.5) * 0.4;
      this.rotationSpeed = (Math.random() - 0.5) * 0.0012;
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotationSpeed;

      const p = 90;
      if (this.x < -p || this.x > canvas.width + p || this.y < -p || this.y > canvas.height + p) {
        this.reset();
      }
    }

    draw(time) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale);

      // 1. Solar Panels
      ctx.fillStyle = '#0369a1';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.8;

      // Left Wing
      ctx.fillRect(-26, -5.5, 16, 11);
      ctx.strokeRect(-26, -5.5, 16, 11);
      ctx.beginPath();
      ctx.moveTo(-20, -5.5); ctx.lineTo(-20, 5.5);
      ctx.moveTo(-14, -5.5); ctx.lineTo(-14, 5.5);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      // Right Wing
      ctx.fillStyle = '#0369a1';
      ctx.strokeStyle = '#38bdf8';
      ctx.fillRect(10, -5.5, 16, 11);
      ctx.strokeRect(10, -5.5, 16, 11);
      ctx.beginPath();
      ctx.moveTo(16, -5.5); ctx.lineTo(16, 5.5);
      ctx.moveTo(22, -5.5); ctx.lineTo(22, 5.5);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      // 2. Main Body Bus
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      drawRoundRect(-10, -7.5, 20, 15, 2);
      ctx.fill();
      ctx.stroke();

      // Gold Insulation Panel
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-6, -4.5, 12, 9);

      // 3. High-Gain Dish Antenna
      ctx.beginPath();
      ctx.arc(0, -11, 5.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -7.5);
      ctx.lineTo(0, -11);
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      // 4. Signal Indicator LED
      if (Math.floor((time + this.delayOffset) / 40) % 2 === 0) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(5, 3.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function init() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    astronaut = new Astronaut();
    spacecraft = new Spacecraft();
    satellite = new Satellite(0, canvas.width * 0.75);
  }

  function drawConnections() {
    const maxDist = 70;
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / maxDist) * 0.05;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let time = 0;
  const TIME_MAX = 360000;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time = (time + 1) % TIME_MAX;

    particles.forEach(function (p) {
      p.update(time);
      p.draw();
    });

    drawConnections();

    if (spacecraft) {
      spacecraft.update(time);
      spacecraft.draw(time);
    }

    if (satellite) {
      satellite.update(time);
      satellite.draw(time);
    }

    if (astronaut) {
      astronaut.update(time);
      astronaut.draw(time);
    }

    animationId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  });

  resizeCanvas();
}

