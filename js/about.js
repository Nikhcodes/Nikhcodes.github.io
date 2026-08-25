/* ============================================================
   ABOUT — SIDE C / LINER NOTES
   ============================================================ */

(function initAboutPage() {

const prefersReducedMotion =
window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ==========================================================
     INTEREST LIST STAGGER
     Tags each row with a --stagger index so about.css can
     cascade the entrance, same pattern as the project grid
     on the home page.
  ========================================================== */

document
  .querySelectorAll('.interest-list')
  .forEach(list => {

    Array.from(list.children).forEach((child, i) => {

      child.style.setProperty('--stagger', i);

    });

  });


/* ==========================================================
     TIMELINE REVEAL
  ========================================================== */

const timelineItems =
document.querySelectorAll('.timeline-item');

if (timelineItems.length) {

if (prefersReducedMotion) {

timelineItems.forEach(item => {
item.classList.add('is-visible');
      });

    } else {

const observer = new IntersectionObserver(
        (entries, observer) => {

entries.forEach(entry => {

if (!entry.isIntersecting) return;

const item = entry.target;

const index =
Array.from(timelineItems).indexOf(item);

setTimeout(() => {

item.classList.add('is-visible');

            }, index * 140);

observer.unobserve(item);

          });

        },
        {
threshold: 0.15
        }
      );


timelineItems.forEach(item => {
observer.observe(item);
      });

    }

  }


/* ==========================================================
     HERO MICRO DRIFT
  ========================================================== */

const hero =
document.querySelector('.about-hero');

if (
hero &&
!prefersReducedMotion &&
window.matchMedia('(pointer: fine)').matches
  ) {

let ticking = false;

window.addEventListener('mousemove', event => {

if (ticking) return;

ticking = true;

requestAnimationFrame(() => {

const x =
          (event.clientX / window.innerWidth - 0.5) * 3;

const y =
          (event.clientY / window.innerHeight - 0.5) * 3;

const main =
          hero.querySelector('.about-hero-main');

const signature =
          hero.querySelector('.signature-wrap');

if (main) {

          main.style.transform =
`translate(${x}px, ${y}px)`;

        }

if (signature) {

          signature.style.marginTop =
`${y * -2}px`;

        }

        ticking = false;

      });

    });

  }


/* ==========================================================
     INTEREST HOVER
  ========================================================== */

const interests =
    document.querySelectorAll('.interest');

  interests.forEach(item => {

    item.addEventListener('mouseenter', () => {

      item.style.paddingLeft = '8px';

    });

    item.addEventListener('mouseleave', () => {

      item.style.paddingLeft = '0';

    });

  });


/* ==========================================================
     SUBTLE TITLE GLITCH
  ========================================================== */

const title =
    document.querySelector('.about-title');

if (
    title &&
!prefersReducedMotion
  ) {

function microGlitch() {

if (Math.random() > 0.3) {

        title.style.transform =
`translateX(${Math.random() * 2 - 1}px)`;

        title.style.letterSpacing =
`${Math.random() * 0.8 - 0.4}px`;

setTimeout(() => {

          title.style.transform = '';
          title.style.letterSpacing = '';

        }, 90);

      }

setTimeout(
        microGlitch,
4000 + Math.random() * 5000
      );

    }

setTimeout(microGlitch, 2500);

  }


})();