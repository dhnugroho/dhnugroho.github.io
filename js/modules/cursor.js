export function initCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let cursorRafId = null;

    document.body.classList.add('has-cursor');

    document.addEventListener('mousemove', function (e) {
      dotX = e.clientX;
      dotY = e.clientY;
    });

    function animateCursor() {
      cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';

      ringX += (dotX - ringX) * 0.15;
      ringY += (dotY - ringY) * 0.15;
      cursorRing.style.transform = 'translate(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px)';

      cursorRafId = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, input, textarea');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hover'); });
    });

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
    if (cursorDot) cursorDot.remove();
    if (cursorRing) cursorRing.remove();
  }
}
