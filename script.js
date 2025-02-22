const h2s = document.querySelectorAll('section > h2');

document.addEventListener('scroll', () => {
  const scrollY = window.scrollY; // Current scroll position
  const threshold = 10; // How close h2 needs to be to top (in pixels)

  h2s.forEach(h2 => {
    const h2Top = h2.getBoundingClientRect().top; // h2 position relative to viewport
    const sectionBottom = h2.parentElement.getBoundingClientRect().bottom;

    // h2 is "stuck" if its top is near 0 (within threshold) and section is still in view
    const isNearTop = h2Top <= threshold;
    const isSectionInView = sectionBottom > 0;

    if (isNearTop) {
      h2.classList.add('sticky');
    } else {
      h2.classList.remove('sticky');
    }
  });
});
