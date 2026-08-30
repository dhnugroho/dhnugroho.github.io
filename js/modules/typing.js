export function initTyping() {
  const typedElement = document.getElementById('typedText');
  if (typedElement) {
    typedElement.setAttribute('aria-live', 'polite');
    typedElement.setAttribute('aria-atomic', 'true');

    const phrases = [
      'Senior Fullstack Engineer',
      'Architecting Enterprise-Scale Solutions',
      'End-to-End Delivery · Product Ownership',
      'Jakarta · Remote Ready'
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
}
