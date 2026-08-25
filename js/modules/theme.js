export function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark  = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  // ── Light / Dark preference (persisted) ──────────────────────────────────
  const savedTheme        = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-mode');
    if (themeIconDark)  themeIconDark.style.display  = 'none';
    if (themeIconLight) themeIconLight.style.display = 'block';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
  }
  // Clean up the early-init class now that body.light-mode is authoritative
  document.documentElement.classList.remove('light-mode-pending');

  // ── Green alternate theme (random per page load, not persisted) ──────────
  // 50 % chance — flips on every refresh independently of light/dark mode
  if (Math.random() < 0.5) {
    document.body.classList.add('green-theme');
  }

  // ── Theme toggle button ───────────────────────────────────────────────────
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const isLight = document.body.classList.toggle('light-mode');

      if (isLight) {
        localStorage.setItem('theme', 'light');
        if (themeIconDark)  themeIconDark.style.display  = 'none';
        if (themeIconLight) themeIconLight.style.display = 'block';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        localStorage.setItem('theme', 'dark');
        if (themeIconDark)  themeIconDark.style.display  = 'block';
        if (themeIconLight) themeIconLight.style.display = 'none';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0e17');
      }
    });
  }
}
