export function initNavbar() {
  const navbar = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  let sectionPositions = [];
  let docHeight = 0;
  let winHeight = 0;
  let isTicking = false;

  function cachePositions() {
    winHeight = window.innerHeight;
    docHeight = document.documentElement.scrollHeight;
    sectionPositions = [];
    sections.forEach(function (section) {
      if (section.offsetParent !== null) {
        sectionPositions.push({
          id: section.getAttribute('id'),
          top: section.offsetTop - 120
        });
      }
    });
  }

  function renderNavbar() {
    if (!navbar) return;

    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ── Bottom-of-page guard ──────────────────────────────────────────
    const atBottom = scrollY + winHeight >= docHeight - 50;

    if (atBottom && scrollY > 80) {
      const links = Array.from(navLinks);
      let lastVisible = null;
      for (let i = links.length - 1; i >= 0; i--) {
        if (links[i].offsetWidth > 0 || links[i].offsetHeight > 0) {
          lastVisible = links[i];
          break;
        }
      }
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (lastVisible) lastVisible.classList.add('active');
      return;
    }

    // ── Normal scroll detection ───────────────────────────────────────
    let currentSection = '';
    if (scrollY > 80) {
      for (let i = 0; i < sectionPositions.length; i++) {
        if (scrollY >= sectionPositions[i].top) {
          currentSection = sectionPositions[i].id;
        }
      }
    }

    navLinks.forEach(function (link) {
      const isActive = currentSection && link.getAttribute('href') === '#' + currentSection;
      link.classList.toggle('active', !!isActive);
    });
  }

  function updateNavbar() {
    if (!isTicking) {
      requestAnimationFrame(function () {
        renderNavbar();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('resize', cachePositions, { passive: true });
  window.addEventListener('scroll', updateNavbar, { passive: true });

  cachePositions();
  renderNavbar();

  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Toggle backdrop overlay class on nav
      if (navbar) navbar.classList.toggle('nav-open', isOpen);
    });

    function closeNav() {
      navToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (navbar) navbar.classList.remove('nav-open');
    }

    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close nav when tapping the backdrop overlay
    if (navbar) {
      navbar.addEventListener('click', function (e) {
        if (e.target === navbar && navLinksContainer.classList.contains('open')) {
          closeNav();
        }
      });
    }
  }

  // SMOOTH SCROLL FOR ANCHOR LINKS
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
}
