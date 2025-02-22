
let isLightbox = false

Object.assign(Fancybox.defaults, {
  caption: false,
  Toolbar: false,
  Thumbs: false,
  wheel: 'slide',
  closeButton: false,
  on: {
    activate: (e) => (console.log('ACTIVATE', e), isLightbox = true),
    deactivate: () => (isLightbox = false)
  }
});

let frames = document.getElementById('frames')

setInterval(() => frames.scrollLeft += 0.5, 18)

let lastScrollTop = window.scrollY
let isScrolling // if page is scrolling (eg. to hover interaction)
let scrollTimeout

window.addEventListener('wheel', (e) => {
  // track if page is scrolling
  isScrolling = true
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => isScrolling = false, 200);

  // handle hanging
  const stillsRect = stills.getBoundingClientRect();
  const framesScrollMax = frames.scrollWidth - frames.clientWidth; // Max scrollable distance
  const threshold = framesScrollMax * 0.15; // Halfway point
  const isAtTop = stillsRect.top <= 0 && stillsRect.bottom <= window.innerHeight;

  e.preventDefault()

  if (frames.contains(e.target)) frames.scrollLeft += e.deltaX

  // Check if we're in the section and scrolling down
  if (isAtTop && e.deltaY > 0) {
    // If frames haven't reached halfway, "wait" by reverting page scroll
    if (frames.scrollLeft < threshold) {
      window.scrollTo(0, lastScrollTop); // Hold the page scroll position
      frames.scrollLeft += e.deltaY
      return;
    }
  }

  frames.scrollLeft += e.deltaY * .5
  window.scrollTo(0, lastScrollTop + e.deltaY);

  // Update last known scroll position when not waiting
  lastScrollTop = window.scrollY;
}, {passive:false});




// Handle h2 sticky class
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


// handle feedback form
function openEmailDialog(event) {
  event.preventDefault(); // Prevent default form submission
  const feedback = document.getElementById('feedback').value;
  const body = encodeURIComponent(feedback);
  const form = document.getElementById('feedbackForm')
  const mailtoLink = `${form.action}&body=${body}`;
  window.location.href = mailtoLink; // Open email client with enhanced body
}
