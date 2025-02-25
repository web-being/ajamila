// handle stills scroll
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

setInterval(() => frames.scrollLeft += 1, 25)



// Initialize Lenis
const lenis = new Lenis({
  smooth: true,
  lerp: 0.01,
  duration: 0.01, // Smoothness duration
  autoRaf: true,
});
// let isScrolling // if page is scrolling (eg. to hover interaction)
// let scrollTimeout

// window.addEventListener('wheel', (e) => {
//   // track if page is scrolling
//   isScrolling = true
//   if (scrollTimeout) clearTimeout(scrollTimeout);
//   scrollTimeout = setTimeout(() => isScrolling = false, 200);

//   // handle hanging
//   const stillsRect = stills.getBoundingClientRect();
//   const framesScrollMax = frames.scrollWidth - frames.clientWidth; // Max scrollable distance
//   const threshold = framesScrollMax * 0.15; // Halfway point
//   const shouldStop = stillsRect.top <= (window.innerHeight/2-stillsRect.height/2) && stillsRect.bottom <= window.innerHeight && stillsRect.bottom >= stillsRect.height;

//   if (frames.contains(e.target)) frames.scrollLeft += e.deltaX

//   if (shouldStop && e.deltaY > 0) {
//     if (frames.scrollLeft < threshold) {
//       e.preventDefault() // Hold the page scroll position
//       frames.scrollLeft += e.deltaY
//       return;
//     }
//   }
// }, {passive:false});



// Cards stack
document.querySelectorAll('#philosophy article').forEach((article, index) => {
  const cardRect = article.getBoundingClientRect();
  const threshold = cardRect.height * 0.6

  lenis.on('scroll', l => {
    const cardRect = article.getBoundingClientRect();

    if (cardRect.top < threshold) {
      // How far past the trigger point are we?
      const progress = Math.log10((threshold - cardRect.top) / threshold + 1);
      article.style.transform = `scale(${1 - progress * (.1 - index*.02)})`
    }
    else article.style.transform = null
  })
})



// Handle h2 sticky class
const h2s = document.querySelectorAll('section > h2');

const threshold = 108
h2s.forEach(h2 => {
  let section = h2.parentNode

  lenis.on('scroll', () => {
    const top = section.getBoundingClientRect().top;
    if (top >= threshold) return

    let progress = Math.min(Math.max(-top + threshold, 0) / threshold, 1)
    h2.style.transform = `scale(${0.8 + 0.2*Math.pow(1-progress, .54)})`
  })
});



// add anchor links to headers
function addAnchorLinks() {
  // Get all <h2> elements
  const headings = document.querySelectorAll('section > h2');

  headings.forEach(heading => {
    // Get the existing ID
    const id = heading.parentElement.getAttribute('id');

    // Skip if there's no ID
    if (!id) return;

    // Get the current text content
    const text = heading.textContent.trim();

    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.setAttribute('href', `#${id}`);
    anchor.textContent = '🔗';
    anchor.classList.add('anchor')

    heading.appendChild(anchor);
  });
}

// Run the function when the page loads
addAnchorLinks()



// Make play button
const trailer = document.getElementById('trailer');
const playButton = document.getElementById('play');
const video = trailer.querySelector('video')

function unfoldTrailer() {
  trailer.classList.remove('folded');

  lenis.scrollTo(trailer, {
    offset: -window.innerHeight / 2 + trailer.offsetHeight / 2,
    duration: 1,
  });

  video.play();
  document.getElementById('cta').hidden = true;
}

function closeTrailer() {
  trailer.classList.add('folded')
  video.pause();
  document.getElementById('cta').hidden = null;
}



// handle feedback form to insert email body from text
function openEmailDialog(event) {
  event.preventDefault(); // Prevent default form submission
  const feedback = document.getElementById('feedback').value;
  const body = encodeURIComponent(feedback);
  const form = document.getElementById('feedbackForm')
  const mailtoLink = `${form.action}&body=${body}`;
  window.location.href = mailtoLink; // Open email client with enhanced body
}
