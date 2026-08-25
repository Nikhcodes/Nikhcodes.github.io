/* ============================================================
   WORK — SIDE B INTERACTIONS

   Small interactions.
   No heavy animation.
   The page should feel alive, not like a demo reel.
   ============================================================ */

(function initWorkPage() {

const cards = document.querySelectorAll('.work-card');
const signal = document.querySelector('.signal');
const waveform = document.querySelectorAll('.waveform i');


/* ==========================================================
     CARD STAGGER
     Tags each card with a --stagger index so work.css can
     cascade the scroll entrance, same pattern used for the
     home page's project grid.
  ========================================================== */

cards.forEach((card, index) => {

  card.style.setProperty('--stagger', index);

});


/* ==========================================================
     CARD HOVER
  ========================================================== */

cards.forEach((card, index) => {

card.addEventListener('mouseenter', () => {

cards.forEach(other => {
if (other !== card) {
other.style.opacity = '0.55';
        }
      });

card.style.opacity = '1';

    });

card.addEventListener('mouseleave', () => {

cards.forEach(other => {
other.style.opacity = '1';
      });

    });

  });


/* ==========================================================
     WAVEFORM — RANDOMIZED MICRO MOVEMENT
  ========================================================== */

function pulseWaveform() {

waveform.forEach((bar, index) => {

const height = 6 + Math.random() * 24;

bar.style.height = `${height}px`;

bar.style.transition = `
        height ${300 + Math.random() * 400}ms ease
      `;

    });

  }

pulseWaveform();

setInterval(pulseWaveform, 650);


/* ==========================================================
     SIGNAL HOVER
  ========================================================== */

if (signal) {

signal.dataset.state = 'idle';

signal.addEventListener('mouseenter', () => {
signal.dataset.state = 'active';
    });

signal.addEventListener('mouseleave', () => {
signal.dataset.state = 'idle';
    });

  }


/* ==========================================================
     SUBTLE CARD PARALLAX

     Only a few pixels.
     The goal is tactile, not gimmicky.
  ========================================================== */

cards.forEach(card => {

    card.addEventListener('mousemove', (event) => {

const rect = card.getBoundingClientRect();

const x =
        (event.clientX - rect.left) /
        rect.width -
0.5;

const y =
        (event.clientY - rect.top) /
        rect.height -
0.5;

const thumb = card.querySelector('.work-thumb');

if (!thumb) return;

      thumb.style.transform = `
        translate(${x * 3}px, ${y * 3}px)
      `;

    });

    card.addEventListener('mouseleave', () => {

const thumb = card.querySelector('.work-thumb');

if (!thumb) return;

      thumb.style.transform = 'translate(0, 0)';

    });

  });

})();