/* ============================================
   EARLY-INIT.JS — runs synchronously in <head>
   Applies theme + focus-mode before first paint
   and activates the async Google Fonts stylesheet.
   Kept external so the CSP needs no 'unsafe-inline'.
   ============================================ */

(function () {
  /* 1. Theme — set class immediately so CSS variables resolve correctly */
  try {
    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && !window.matchMedia('(prefers-color-scheme: light)').matches;
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      document.documentElement.classList.add('light-mode-pending');
    }
  } catch (_) { }

  /* 2. Color Theme Variant — honors persistent user pick, otherwise randomizes once per load */
  try {
    var variants = ['default', 'green', 'cocoa', 'mocha', 'truffle', 'maroon'];
    var userPicked = localStorage.getItem('userPickedColorTheme');
    var chosenVariant;
    if (userPicked && variants.indexOf(userPicked) !== -1) {
      chosenVariant = userPicked;
    } else {
      var lastVariant = localStorage.getItem('lastColorThemeVariant');
      var pool = variants.filter(function (v) { return v !== lastVariant; });
      chosenVariant = pool[Math.floor(Math.random() * pool.length)];
      localStorage.setItem('lastColorThemeVariant', chosenVariant);
    }
    /* Write chosen variant to sessionStorage so theme.js can read the same value */
    sessionStorage.setItem('chosenColorThemeVariant', chosenVariant);
    if (chosenVariant !== 'default') {
      document.documentElement.classList.add(chosenVariant + '-theme-pending');
    }
  } catch (_) { }

  /* 3. Focus / view mode — sessionStorage so every fresh visit starts in Quick Scan */
  try {
    var vm = sessionStorage.getItem('dhn-view-mode') || 'scan';
    if (vm === 'scan') {
      document.documentElement.setAttribute('data-mode-pending', 'scan');
    }
  } catch (_) { }
})();

/* 4. Fonts — swap the non-blocking stylesheet from media="print" to "all" once loaded */
(function () {
  var fonts = document.getElementById('googleFonts');
  if (!fonts) return;
  if (fonts.sheet) {
    fonts.media = 'all';
  } else {
    fonts.addEventListener('load', function () { fonts.media = 'all'; });
  }
})();
