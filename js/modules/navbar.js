export function initNavbar() {
  const navbar = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateNavbar() {
    if (!navbar) return;

    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ── Bottom-of-page guard ──────────────────────────────────────────
    // In Quick Scan mode the page is shorter (hidden sections collapsed),
    // so the last section (#contact) may be unreachable via the -120px
    // threshold. When at/near the page bottom, force the last VISIBLE
    // nav link active regardless of the offset math.
    const atBottom =
      scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;

    if (atBottom && scrollY > 80) {
      // Walk links in reverse to find the last one that is currently visible
      const links = Array.from(navLinks);
      let lastVisible = null;
      for (let i = links.length - 1; i >= 0; i--) {
        if (getComputedStyle(links[i]).display !== 'none') {
          lastVisible = links[i];
          break;
        }
      }
      navLinks.forEach(l => l.classList.remove('active'));
      if (lastVisible) lastVisible.classList.add('active');
      return; // skip normal offset detection
    }

    // ── Normal scroll detection ───────────────────────────────────────
    let currentSection = '';
    if (scrollY > 80) {
      sections.forEach(function (section) {
        // display:none sections (hidden by Quick Scan mode) have offsetParent === null
        // and offsetTop === 0, which would make them always "win" the >= check.
        // Skip them entirely so only rendered sections participate.
        if (section.offsetParent === null) return;
        const top = section.offsetTop - 120;
        if (scrollY >= top) {
          currentSection = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (currentSection && link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

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
