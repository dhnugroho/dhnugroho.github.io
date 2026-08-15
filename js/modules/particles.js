export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId = null;
  const isMobile = window.innerWidth < 768;

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
      this.size = Math.random() * 1.6 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.55 + 0.15;
      this.twinkleSpeed = Math.random() * 0.015 + 0.005;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      const roll = Math.random();
      if (roll < 0.75) {
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
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110 * 0.22;
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
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.currentOpacity * 0.1) + ')';
        ctx.fill();
      }
    }
  }

  function init() {
    const areaDivider = isMobile ? 18000 : 10000;
    const maxParticles = isMobile ? 40 : 85;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / areaDivider), maxParticles);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDist = isMobile ? 65 : 85;
    const maxDistSq = maxDist * maxDist;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / maxDist) * 0.08;
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

  // Pause animation when hero section is not visible to save CPU/battery
  const heroSection = canvas.closest('#hero') || canvas.parentElement;
  if ('IntersectionObserver' in window && heroSection) {
    const visibilityObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        if (animationId === null) animate();
      } else {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }, { threshold: 0 });
    visibilityObserver.observe(heroSection);
  }
}
