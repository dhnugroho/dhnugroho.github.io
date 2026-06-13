'use strict';
/* ============================================
   MAIN.JS — Adventurous Tech Portfolio
   Pure Vanilla JS — Zero Dependencies
   ============================================ */

(function () {

  document.addEventListener('DOMContentLoaded', function () {

    // =========================================
    // 1. PARTICLE STAR-FIELD CANVAS
    // =========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let mouse = { x: null, y: null };
      let animationId = null;

      function resizeCanvas() {
        // Cancel current frame before resizing to avoid jank
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
        animate();
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
            this.color = '0, 229, 255';   // cyan
          } else {
            this.color = '255, 107, 53';  // warm accent
          }
        }

        update(time) {
          this.x += this.speedX;
          this.y += this.speedY;

          // Twinkle — use bounded time to avoid float drift
          this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));

          // Mouse interaction — gentle repel
          if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
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
          ctx.fillStyle = 'rgba(' + this.color + ', ' + this.currentOpacity + ')';
          ctx.fill();

          // Glow for larger particles
          if (this.size > 1.2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.currentOpacity * 0.1) + ')';
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
              ctx.strokeStyle = 'rgba(0, 229, 255, ' + opacity + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Bounded time counter: keeps value in [0, 360000) to prevent float precision drift
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

      // Mouse tracking for particle interaction
      canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      canvas.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
      });

      // Debounce resize to avoid excessive reinit
      let resizeTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
      });

      resizeCanvas(); // sets canvas size, inits particles, starts animation
    }


    // =========================================
    // 2. TYPED TEXT EFFECT
    // =========================================
    const typedElement = document.getElementById('typedText');
    if (typedElement) {
      // aria-live so screen readers announce changes
      typedElement.setAttribute('aria-live', 'polite');
      typedElement.setAttribute('aria-atomic', 'true');

      const phrases = [
        'Pragmatic Programmer',
        'Fullstack Engineer',
        'Digital Nomad',
        'Lifelong Learner',
        'Explorer'
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typeSpeed = 80;
      let typeTimer = null;

      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
          charIndex--;
          typeSpeed = 40;
        } else {
          charIndex++;
          typeSpeed = 80 + Math.random() * 40;
        }

        // Use textContent — never innerHTML — for XSS safety
        typedElement.textContent = currentPhrase.substring(0, charIndex);

        if (!isDeleting && charIndex === currentPhrase.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typeSpeed = 400;
        }

        typeTimer = setTimeout(typeEffect, typeSpeed);
      }

      typeTimer = setTimeout(typeEffect, 1200);
    }


    // =========================================
    // 3. CUSTOM CURSOR
    // =========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
      let dotX = 0, dotY = 0;
      let ringX = 0, ringY = 0;
      let cursorRafId = null;

      // Signal to CSS that a fine pointer is active
      document.body.classList.add('has-cursor');

      document.addEventListener('mousemove', function (e) {
        dotX = e.clientX;
        dotY = e.clientY;
      });

      function animateCursor() {
        // Dot follows immediately
        cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';

        // Ring follows with lag
        ringX += (dotX - ringX) * 0.15;
        ringY += (dotY - ringY) * 0.15;
        cursorRing.style.transform = 'translate(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px)';

        cursorRafId = requestAnimationFrame(animateCursor);
      }

      animateCursor();

      // Hover effect on interactive elements
      const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, input, textarea');
      hoverTargets.forEach(function (el) {
        el.addEventListener('mouseenter', function () { cursorRing.classList.add('hover'); });
        el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hover'); });
      });

      // On first touch: hide cursor elements and stop RAF
      document.addEventListener('touchstart', function () {
        document.body.classList.remove('has-cursor');
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
        if (cursorRafId !== null) {
          cancelAnimationFrame(cursorRafId);
          cursorRafId = null;
        }
      }, { once: true });

    } else {
      // Remove cursor elements on non-pointer devices to save DOM nodes
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
      sections.forEach(function (section) {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
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
      navToggle.addEventListener('click', function () {
        const isOpen = navLinksContainer.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinksContainer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navToggle.classList.remove('open');
          navLinksContainer.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }


    // =========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // =========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars if any exist inside this element
            entry.target.querySelectorAll('.skill-bar[data-w]').forEach(function (bar) {
              bar.style.width = bar.getAttribute('data-w') + '%';
            });
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
      // Fallback: show everything immediately
      revealElements.forEach(function (el) { el.classList.add('visible'); });
    }


    // =========================================
    // 7. PORTFOLIO MODALS
    //    Security: all user-visible content set via textContent (never innerHTML)
    //    Accessibility: role=dialog, aria-modal, focus trap, keyboard dismiss
    // =========================================
    const modalBackdrop = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalClose = document.getElementById('modalClose');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // Elements that can receive focus, for focus-trap
    const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';
    let previouslyFocused = null;

    /**
     * Safely build tag <span> elements using DOM API only — no innerHTML.
     * This prevents XSS from data-tags attribute values.
     */
    function renderTags(tagsString) {
      if (!modalTags) return;
      // Clear existing children safely
      while (modalTags.firstChild) {
        modalTags.removeChild(modalTags.firstChild);
      }
      if (!tagsString) return;
      tagsString.split(',').forEach(function (tag) {
        const span = document.createElement('span');
        span.textContent = tag.trim(); // textContent — never innerHTML
        modalTags.appendChild(span);
      });
    }

    function openModal(card) {
      if (!modalBackdrop) return;

      // Read data — will be set as textContent only
      const img = card.dataset.image || '';
      const title = card.dataset.title || '';
      const desc = card.dataset.description || '';
      const tags = card.dataset.tags || '';

      if (modalImage) {
        modalImage.src = img;
        modalImage.alt = title; // descriptive alt for accessibility
      }
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      renderTags(tags);

      // Trap focus inside modal
      previouslyFocused = document.activeElement;
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Move focus to close button
      if (modalClose) {
        setTimeout(function () { modalClose.focus(); }, 50);
      }
    }

    function closeModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';

      // Restore focus to the element that opened the modal
      if (previouslyFocused) {
        previouslyFocused.focus();
        previouslyFocused = null;
      }
    }

    // Focus trap: keep Tab / Shift+Tab inside the modal while open
    if (modalBackdrop) {
      modalBackdrop.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        const focusable = Array.from(modalBackdrop.querySelectorAll(FOCUSABLE));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    // Portfolio cards: click + keyboard activation
    portfolioCards.forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });

      // Keyboard: Enter or Space activates the card (for tabindex="0" users)
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // Global Escape key — only closes when modal is actually open
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });


    // =========================================
    // 8. CONTACT FORM VALIDATION
    // =========================================
    const contactForm = document.getElementById('contactForm');

    /**
     * Shows a validation error below an input using a CSS class (not inline style).
     * Message is set via textContent to avoid XSS.
     */
    function showError(input, msg) {
      const error = document.createElement('span');
      error.className = 'form-error';
      error.textContent = msg; // safe — no innerHTML
      input.parentElement.appendChild(error);
      input.style.borderColor = 'var(--accent-warm)';
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', error.id = 'err-' + input.id);
    }

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameEl = document.getElementById('contactName');
        const emailEl = document.getElementById('contactEmail');
        const messageEl = document.getElementById('contactMessage');
        let valid = true;

        // Clear previous errors
        contactForm.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });

        // Reset field states
        [nameEl, emailEl, messageEl].forEach(function (input) {
          if (!input) return;
          input.style.borderColor = '';
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
        });

        if (nameEl && !nameEl.value.trim()) {
          showError(nameEl, 'Name is required');
          valid = false;
        }

        if (emailEl) {
          if (!emailEl.value.trim()) {
            showError(emailEl, 'Email is required');
            valid = false;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            showError(emailEl, 'Please enter a valid email');
            valid = false;
          }
        }

        if (messageEl && !messageEl.value.trim()) {
          showError(messageEl, 'Message is required');
          valid = false;
        }

        if (valid) {
          // Static hosting: use mailto as fallback
          const subject = encodeURIComponent('Portfolio Contact from ' + nameEl.value.trim());
          const body = encodeURIComponent(
            'Name: ' + nameEl.value.trim() +
            '\nEmail: ' + emailEl.value.trim() +
            '\n\nMessage:\n' + messageEl.value.trim()
          );
          // Open mailto without navigate-away side effects
          const link = document.createElement('a');
          link.href = 'mailto:dhnugroho@gmail.com?subject=' + subject + '&body=' + body;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Show success feedback
          const btn = contactForm.querySelector('.btn-submit');
          if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Opening mail client...';
            btn.disabled = true;
            btn.style.background = 'var(--accent-warm)';
            setTimeout(function () {
              btn.textContent = originalText;
              btn.style.background = '';
              btn.disabled = false;
            }, 3000);
          }
        } else {
          // Move focus to first invalid field for screen reader users
          const firstError = contactForm.querySelector('[aria-invalid="true"]');
          if (firstError) firstError.focus();
        }
      });
    }


    // =========================================
    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });


    // =========================================
    // 10. TECH STRIP — SAFE INFINITE SCROLL CLONE
    //     Uses cloneNode (DOM API) instead of innerHTML duplication
    //     to avoid any risk of doubling inline event handlers or scripts.
    // =========================================
    const techStripInner = document.querySelector('.tech-strip-inner');
    if (techStripInner) {
      // Snapshot original children before we start adding clones
      const originals = Array.from(techStripInner.children);
      originals.forEach(function (child) {
        techStripInner.appendChild(child.cloneNode(true));
      });
    }


    // =========================================
    // 11. NOTES LANGUAGE TOGGLE
    //     CSP-safe: all wiring done here, no inline onclick in HTML.
    //     Google Translate widget loads asynchronously — we poll
    //     for the select element and retry if not yet ready.
    // =========================================
    const langBtnId = document.getElementById('langBtnId');
    const langBtnEn = document.getElementById('langBtnEn');

    function setActiveLangBtn(lang) {
      [langBtnId, langBtnEn].forEach(function (btn) {
        if (btn) btn.classList.remove('active');
      });
      var activeBtn = lang === 'id' ? langBtnId : langBtnEn;
      if (activeBtn) activeBtn.classList.add('active');
    }

    function changeLanguage(lang) {
      var domain = window.location.hostname;
      if (lang === 'en') {
        document.cookie = 'googtrans=/id/en; path=/; domain=' + domain;
        document.cookie = 'googtrans=/id/en; path=/; domain=.' + domain;
      } else {
        // Clear cookie to restore original language
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain;
      }
      window.location.reload();
    }

    // Set initial button state based on cookie
    var match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
    if (match && match[1] === '/id/en') {
      setActiveLangBtn('en');
    } else {
      setActiveLangBtn('id');
    }

    if (langBtnId) {
      langBtnId.addEventListener('click', function () { changeLanguage('id'); });
    }
    if (langBtnEn) {
      langBtnEn.addEventListener('click', function () { changeLanguage('en'); });
    }

  }); // end DOMContentLoaded

}()); // end IIFE
