'use strict';

document.querySelectorAll('.bib-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
  });
});

document.querySelectorAll('.copy-bib').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.bib);
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      status.textContent = 'BibTeX citation copied to clipboard.';
      window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 2000);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Text selected';
      status.textContent = 'Copy is unavailable. The citation is selected; copy it using your browser.';
      window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 3000);
    }
  });
});

const navigation = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
let framePending = false;
function updateNavigation() {
  let current = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 150) current = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
    current = sections[sections.length - 1].id;
  }
  navigation.forEach((link) => {
    if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; window.requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
