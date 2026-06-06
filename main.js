/* ============================================
   MAIN.JS — Adventurous Tech Portfolio
   Pure Vanilla JS — Zero Dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // 1. PARTICLE STAR-FIELD CANVAS
  // =========================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        // Color: mostly white/cyan, occasional warm
        const roll = Math.random();
        if (roll < 0.7) {
          this.color = '229, 255, 255'; // cyan-white
        } else if (roll < 0.9) {
          this.color = '0, 229, 255'; // cyan
        } else {
          this.color = '255, 107, 53'; // warm accent
        }
      }

      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));

        // Mouse interaction — gentle repel
        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.3;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Wrap around
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity})`;
        ctx.fill();

        // Glow for larger particles
        if (this.size > 1.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity * 0.1})`;
          ctx.fill();
        }
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 6000), 200);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    // Draw connecting lines between close particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      particles.forEach(p => {
        p.update(time);
        p.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking for particle interaction
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();
    initParticles();
    animate();
  }


  // =========================================
  // 2. TYPED TEXT EFFECT
  // =========================================
  const typedElement = document.getElementById('typedText');
  if (typedElement) {
    const phrases = [
      'Fullstack Engineer',
      'Digital Nomad',
      'Lifelong Learner',
      'Explorer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80 + Math.random() * 40; // slightly variable for natural feel
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // brief pause before next phrase
      }

      setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1200); // initial delay
  }


  // =========================================
  // 3. CUSTOM CURSOR
  // =========================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    });

    function animateCursor() {
      // Dot follows immediately
      cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

      // Ring follows with lag
      ringX += (dotX - ringX) * 0.15;
      ringY += (dotY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    // Hide on mobile / touch
    document.addEventListener('touchstart', () => {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
    }, { once: true });
  } else {
    // Remove cursor elements on non-pointer devices
    if (cursorDot) cursorDot.remove();
    if (cursorRing) cursorRing.remove();
  }


  // =========================================
  // 4. NAVBAR — Scroll Shrink & Active State
  // =========================================
  const navbar = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  // =========================================
  // 5. MOBILE NAV TOGGLE
  // =========================================
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
      document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // =========================================
  // 6. SCROLL REVEAL ANIMATIONS
  // =========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // =========================================
  // 7. PORTFOLIO MODALS
  // =========================================
  const modalBackdrop = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalClose = document.getElementById('modalClose');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  function openModal(card) {
    if (!modalBackdrop) return;

    const img = card.dataset.image;
    const title = card.dataset.title;
    const desc = card.dataset.description;
    const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];

    if (modalImage) modalImage.src = img;
    if (modalImage) modalImage.alt = title;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalTags) {
      modalTags.innerHTML = tags.map(t => `<span>${t.trim()}</span>`).join('');
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  // =========================================
  // 8. CONTACT FORM VALIDATION
  // =========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(el => el.remove());

      function showError(input, msg) {
        valid = false;
        const error = document.createElement('span');
        error.className = 'form-error';
        error.style.cssText = 'color: var(--accent-warm); font-size: 0.75rem; font-family: var(--font-mono); margin-top: 0.3rem; display: block;';
        error.textContent = msg;
        input.parentElement.appendChild(error);
        input.style.borderColor = 'var(--accent-warm)';
      }

      // Reset styles
      [name, email, message].forEach(input => {
        if (input) input.style.borderColor = '';
      });

      if (name && !name.value.trim()) {
        showError(name, 'Name is required');
      }

      if (email) {
        if (!email.value.trim()) {
          showError(email, 'Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          showError(email, 'Please enter a valid email');
        }
      }

      if (message && !message.value.trim()) {
        showError(message, 'Message is required');
      }

      if (valid) {
        // Build mailto link as a fallback since this is static hosting
        const subject = encodeURIComponent(`Portfolio Contact from ${name.value}`);
        const body = encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\n\nMessage:\n${message.value}`);
        window.location.href = `mailto:dhani.nugroho@example.com?subject=${subject}&body=${body}`;

        // Show success state
        const btn = contactForm.querySelector('.btn-submit');
        if (btn) {
          const originalText = btn.textContent;
          btn.textContent = '✓ Opening mail client...';
          btn.style.background = 'var(--accent-warm)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 3000);
        }
      }
    });
  }


  // =========================================
  // 9. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // =========================================
  // 10. TECH STRIP — DUPLICATE FOR INFINITE SCROLL
  // =========================================
  const techStripInner = document.querySelector('.tech-strip-inner');
  if (techStripInner) {
    // Clone children for seamless infinite loop
    const items = techStripInner.innerHTML;
    techStripInner.innerHTML = items + items;
  }

});
