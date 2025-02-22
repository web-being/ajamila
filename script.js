
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

const threshold = 40
h2s.forEach(h2 => {
  let section = h2.parentNode

  document.addEventListener('scroll', () => {
    const top = section.getBoundingClientRect().top;
    if (top >= threshold) return

    let amt = Math.min(Math.max(-top + threshold, 0) / threshold, 1)
    h2.style.transform = `scale(${0.75 + 0.25*(1-amt)})`
  })
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
