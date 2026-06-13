export function initLang() {
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
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain;
    }
    window.location.reload();
  }

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
}
