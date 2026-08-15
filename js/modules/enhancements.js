/* ============================================
   ENHANCEMENTS MODULE — Premium Interactions
   ============================================ */

export function initEnhancements() {

  // ---- 5. SCROLL PROGRESS INDICATOR ----
  initScrollProgress();

  // ---- 6. PARALLAX DEPTH ON HERO ----
  initHeroParallax();

  // ---- 7. MAGNETIC HOVER ON CTA BUTTONS ----
  initMagneticButtons();

  // ---- 9. ANIMATED COUNTER FOR STATS ----
  initAnimatedCounters();

  // ---- 11. TILT 3D ON PORTFOLIO CARDS ----
  initCardTilt();

  // ---- 12. DYNAMIC TIME-BASED GREETING ----
  initTimeGreeting();

  // ---- 14. SMOOTH PAGE TRANSITION ON NAV ----
  initNavTransition();

  // ---- 16. BACK-TO-TOP FAB ----
  initBackToTop();

  // ---- 17. ENHANCED CURSOR LABELS ----
  initCursorLabels();

  // ---- 18. SMOOTH THEME TOGGLE ----
  initThemeTransition();
}


// ================================================================
// 5. SCROLL PROGRESS INDICATOR
// ================================================================
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  let docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let isTicking = false;

  window.addEventListener('resize', function () {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
  }, { passive: true });

  function renderProgress() {
    const scrollTop = window.scrollY;
    if (docHeight > 0) {
      const pct = (scrollTop / docHeight) * 100;
      bar.style.width = pct + '%';
    }
  }

  window.addEventListener('scroll', function () {
    if (!isTicking) {
      requestAnimationFrame(function () {
        renderProgress();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  renderProgress();
}


// ================================================================
// 6. PARALLAX DEPTH ON HERO
// ================================================================
function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const avatar = hero.querySelector('.hero-avatar');
  const greeting = hero.querySelector('.hero-greeting');
  const heroName = hero.querySelector('.hero-name');
  const canvas = hero.querySelector('#particleCanvas');

  let heroH = hero.offsetHeight;
  let isTicking = false;

  window.addEventListener('resize', function () {
    heroH = hero.offsetHeight;
  }, { passive: true });

  function renderParallax() {
    const scrollY = window.scrollY;
    if (scrollY > heroH) return;

    if (avatar) avatar.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    if (greeting) greeting.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
    if (heroName) heroName.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
    if (canvas) canvas.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
  }

  window.addEventListener('scroll', function () {
    if (!isTicking) {
      requestAnimationFrame(function () {
        renderParallax();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}


// ================================================================
// 7. MAGNETIC HOVER ON CTA BUTTONS
// ================================================================
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const buttons = document.querySelectorAll('.hero-cta, .pj-live-btn');
  buttons.forEach(function (btn) {
    let btnRect = null;

    btn.addEventListener('mouseenter', function () {
      btnRect = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', function (e) {
      if (!btnRect) btnRect = btn.getBoundingClientRect();
      const cx = btnRect.left + btnRect.width / 2;
      const cy = btnRect.top + btnRect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btnRect = null;
      btn.style.transform = 'translate(0, 0)';
    });
  });
}


// ================================================================
// 9. ANIMATED COUNTER FOR STATS
// ================================================================
function initAnimatedCounters() {
  const statValues = document.querySelectorAll('.stat-value');
  if (statValues.length === 0) return;

  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + '+';
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const numMatch = text.match(/^(\d+)/);
        if (numMatch) {
          const target = parseInt(numMatch[1], 10);
          animateValue(el, target, 1500);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(function (el) {
    counterObserver.observe(el);
  });
}


// ================================================================
// 11. TILT 3D ON PORTFOLIO CARDS
// ================================================================
function initCardTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(function (card) {
    // Add glare element
    const glare = document.createElement('div');
    glare.className = 'card-glare';
    card.appendChild(glare);

    let cardRect = null;

    card.addEventListener('mouseenter', function () {
      cardRect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', function (e) {
      if (!cardRect) cardRect = card.getBoundingClientRect();
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      const cx = cardRect.width / 2;
      const cy = cardRect.height / 2;

      const rotateY = ((x - cx) / cx) * 8;
      const rotateX = ((cy - y) / cy) * 8;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';

      // Update glare position
      const glareX = (x / cardRect.width) * 100;
      const glareY = (y / cardRect.height) * 100;
      glare.style.setProperty('--glare-x', glareX + '%');
      glare.style.setProperty('--glare-y', glareY + '%');
    });

    card.addEventListener('mouseleave', function () {
      cardRect = null;
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}


// ================================================================
// 12. DYNAMIC TIME-BASED GREETING
// ================================================================
function initTimeGreeting() {
  const greetingEl = document.querySelector('.hero-greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting = '// hello & welcome';

  if (hour >= 5 && hour < 12) {
    greeting = '// good morning & welcome';
  } else if (hour >= 12 && hour < 17) {
    greeting = '// good afternoon & welcome';
  } else if (hour >= 17 && hour < 21) {
    greeting = '// good evening & welcome';
  } else {
    greeting = '// good night & welcome';
  }

  greetingEl.textContent = greeting;
}


// ================================================================
// 14. SMOOTH PAGE TRANSITION ON NAV CLICK
// ================================================================
function initNavTransition() {
  const overlay = document.querySelector('.nav-transition-overlay');
  if (!overlay) return;

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      overlay.classList.add('flash');
      setTimeout(function () {
        overlay.classList.remove('flash');
      }, 300);
    });
  });
}


// ================================================================
// 16. BACK-TO-TOP FAB WITH PROGRESS RING
// ================================================================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const circle = btn.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 20; // r=20
  if (circle) {
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
  }

  let docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let isTicking = false;

  window.addEventListener('resize', function () {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
  }, { passive: true });

  function renderBtn() {
    const scrollTop = window.scrollY;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;

    // Show/hide
    if (scrollTop > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    // Update ring
    if (circle) {
      const offset = circumference - (pct * circumference);
      circle.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener('scroll', function () {
    if (!isTicking) {
      requestAnimationFrame(function () {
        renderBtn();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  renderBtn();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ================================================================
// 17. ENHANCED CURSOR WITH TEXT LABELS
// ================================================================
function initCursorLabels() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const ring = document.querySelector('.cursor-ring');
  if (!ring) return;

  // Create label element
  const label = document.createElement('span');
  label.className = 'cursor-label';
  ring.appendChild(label);

  // Define label targets
  const labelMap = [
    { selector: '.portfolio-card', text: 'View' },
    { selector: '.hero-cta', text: 'Click' },
    { selector: '.pj-accordion-header', text: 'Expand' },
    { selector: '.pj-live-btn', text: 'Visit' },
    { selector: '.nav-links a', text: 'Go' },
    { selector: '.back-to-top', text: 'Top' },
    { selector: '.theme-toggle-btn', text: 'Theme' }
  ];

  labelMap.forEach(function (item) {
    const elements = document.querySelectorAll(item.selector);
    elements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        label.textContent = item.text;
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        label.textContent = '';
        ring.classList.remove('hover');
      });
    });
  });
}


// ================================================================
// 18. SMOOTH THEME TOGGLE ANIMATION
// ================================================================
function initThemeTransition() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const circle = document.querySelector('.theme-transition-circle');
  if (!circle) return;

  themeBtn.addEventListener('click', function () {
    const rect = themeBtn.getBoundingClientRect();
    const cW = circle.offsetWidth;
    const cH = circle.offsetHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Position circle centered on button (reads before writes)
    circle.style.left = (cx - cW / 2) + 'px';
    circle.style.top = (cy - cH / 2) + 'px';

    // Trigger expansion
    circle.classList.add('expanding');

    setTimeout(function () {
      circle.classList.remove('expanding');
      circle.style.transform = 'scale(0)';
    }, 600);
  });
}
