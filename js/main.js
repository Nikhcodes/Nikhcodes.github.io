/* ============================================================
   NIKHIEL LINGARD — PORTFOLIO
   main.js

   Shared behaviour:
   - VHS timestamp
   - REC indicator (+ click to pause)
   - Hero glitch
   - Mobile navigation
   - Scroll reveals (+ stagger)
   - Hero music player
   - CRT boot flash
   - Custom tape-reel cursor
   - Tape counter (scroll-driven)
   - Magnetic CTAs
   - Glitch nav labels
   - UI sounds
   ============================================================ */


/* ============================================================
   GLOBAL SETTINGS
   ============================================================ */

const prefersReducedMotion =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

const isCoarsePointer =
  window.matchMedia('(pointer: coarse)').matches;


/* ============================================================
   UI SOUNDS
   ============================================================

   sounds/
   ├── click.mp3
   ├── radio-click.mp3
   └── transmit.mp3

   click.mp3
   → Normal buttons / UI interaction

   radio-click.mp3
   → Internal page navigation

   transmit.mp3
   → Contact form transmission
   ============================================================ */

const uiSounds = {
  click: new Audio('./sounds/click.mp3'),
  radioClick: new Audio('./sounds/radio-click.mp3'),
  transmit: new Audio('./sounds/transmit.mp3')
};


/*
   Preload the sounds so they are ready immediately.
*/
Object.values(uiSounds).forEach(sound => {
  sound.preload = 'auto';
});


/*
   Play a UI sound.

   currentTime = 0 means the sound can be triggered
   repeatedly without waiting for the previous playback.
*/
function playSound(name) {
  const sound = uiSounds[name];

  if (!sound) return;

  sound.currentTime = 0;

  sound.play().catch(() => {
    /*
      Browser autoplay restrictions can block audio
      until the user has interacted with the page.
      That's normal — button clicks will work.
    */
  });
}


/* ============================================================
   CRT BOOT FLASH
   Plays once on load, then removes itself.
   ============================================================ */

(function initBoot() {

  if (prefersReducedMotion) return;

  const el = document.createElement('div');

  el.className = 'crt-boot';

  document.body.prepend(el);

  el.addEventListener('animationend', () => {
    el.remove();
  });

})();


/* ============================================================
   VHS TIMESTAMP
   ============================================================ */

(function initTimestamp() {

  const el = document.createElement('div');

  el.className = 'vhs-timestamp';

  document.body.appendChild(el);


  function tick() {

    const now = new Date();

    const pad = n =>
      String(n).padStart(2, '0');

    el.textContent =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  }


  tick();

  setInterval(tick, 1000);

})();


/* ============================================================
   REC INDICATOR
   Click to pause/resume the "recording".
   ============================================================ */

(function initRec() {

  const el = document.createElement('div');

  el.className = 'rec-indicator';

  el.innerHTML =
    '<span class="rec-dot"></span>Rec';

  el.setAttribute('role', 'button');

  el.setAttribute('tabindex', '0');

  el.setAttribute(
    'aria-label',
    'Toggle recording indicator'
  );

  document.body.appendChild(el);


  let paused = false;


  function toggle() {

    paused = !paused;

    el.classList.toggle(
      'is-paused',
      paused
    );

    el.lastChild.textContent =
      paused ? 'Pause' : 'Rec';

    /*
      Small UI click sound.
    */
    playSound('click');

  }


  el.addEventListener(
    'click',
    toggle
  );


  el.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        toggle();

      }

    }
  );

})();


/* ============================================================
   HERO GLITCH
   ============================================================ */

(function initGlitch() {

  if (prefersReducedMotion) return;

  const hero =
    document.querySelector('.hero-image');

  if (!hero) return;


  let active = false;


  function reset() {

    hero.style.transform = '';

    hero.style.filter =
      'saturate(0.7) contrast(0.92)';

    active = false;

  }


  function glitch() {

    if (active) return;

    active = true;


    const shiftX =
      (Math.random() * 7 + 2) *
      (Math.random() < 0.5 ? 1 : -1);


    const hue =
      (Math.random() * 14 - 7)
        .toFixed(1);


    const dur =
      40 + Math.random() * 90;


    const doubled =
      Math.random() < 0.38;


    hero.style.transition = 'none';


    hero.style.transform =
      `translateX(${shiftX}px)`;


    hero.style.filter =
      `saturate(0.88) contrast(0.96) hue-rotate(${hue}deg)`;


    setTimeout(() => {

      if (doubled) {

        hero.style.transform =
          `translateX(${(-shiftX * 0.55).toFixed(1)}px)`;


        setTimeout(
          reset,
          Math.round(dur * 0.55)
        );

      } else {

        reset();

      }

    }, dur);


    setTimeout(
      glitch,
      4000 + Math.random() * 9000
    );

  }


  setTimeout(
    glitch,
    2500 + Math.random() * 2500
  );

})();


/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

(function initNav() {

  const panel =
    document.getElementById('top-panel');

  const toggle =
    document.getElementById('nav-toggle');


  if (!panel || !toggle) return;


  toggle.addEventListener(
    'click',
    () => {

      const isOpen =
        panel.classList.toggle('nav-open');


      toggle.classList.toggle(
        'open',
        isOpen
      );


      toggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );


      document.body.style.overflow =
        isOpen ? 'hidden' : '';


      /*
        Normal UI button sound.
      */
      playSound('click');

    }
  );


  panel
    .querySelectorAll(
      '.links a, .socials a'
    )
    .forEach(link => {

      link.addEventListener(
        'click',
        () => {

          panel.classList.remove(
            'nav-open'
          );

          toggle.classList.remove(
            'open'
          );

          toggle.setAttribute(
            'aria-expanded',
            'false'
          );

          document.body.style.overflow = '';

        }
      );

    });

})();


/* ============================================================
   GLITCH NAV LABELS
   ============================================================ */

(function initGlitchLabels() {

  document
    .querySelectorAll(
      '.top-panel .links a'
    )
    .forEach(link => {

      link.setAttribute(
        'data-label',
        link.textContent.trim()
      );

    });

})();


/* ============================================================
   SCROLL REVEAL (+ stagger)
   ============================================================ */

(function initReveal() {

  const targets =
    document.querySelectorAll('.reveal');


  /*
    Tag children of grids/rows with a --stagger index
    so CSS transition-delay can cascade them naturally.
  */

  document
    .querySelectorAll('.project-grid')
    .forEach(group => {

      Array.from(group.children)
        .forEach((child, i) => {

          child.style.setProperty(
            '--stagger',
            i
          );

        });

    });


  document
    .querySelectorAll('.reel-section')
    .forEach(section => {

      const rows =
        section.querySelectorAll(
          '.session-row'
        );

      rows.forEach((row, i) => {

        row.style.setProperty(
          '--stagger',
          i
        );

      });

    });


  if (!targets.length) return;


  if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window)
  ) {

    targets.forEach(target => {

      target.classList.add(
        'is-visible'
      );

    });

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              'is-visible'
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.15,
        rootMargin:
          '0px 0px -60px 0px'
      }
    );


  targets.forEach(target => {

    observer.observe(target);

  });

})();


/* ============================================================
   TAPE COUNTER

   A running "CNT" readout in the corner that advances with
   scroll depth, like an analog tape deck counter rather than
   a generic progress bar.
   ============================================================ */

(function initTapeCounter() {

  const el =
    document.createElement('div');

  el.className = 'tape-counter';

  el.innerHTML =
    '<span class="tape-counter-label">Cnt</span>' +
    '<span class="tape-counter-value">00:00</span>';

  document.body.appendChild(el);


  const valueEl =
    el.querySelector(
      '.tape-counter-value'
    );


  const SIDE_LENGTH_SECONDS =
    12 * 60;


  function update() {

    const doc =
      document.documentElement;


    const scrollable =
      doc.scrollHeight -
      doc.clientHeight;


    const progress =
      scrollable > 0
        ? window.scrollY / scrollable
        : 0;


    const seconds =
      Math.round(
        progress *
        SIDE_LENGTH_SECONDS
      );


    const mm =
      String(
        Math.floor(seconds / 60)
      ).padStart(2, '0');


    const ss =
      String(
        seconds % 60
      ).padStart(2, '0');


    valueEl.textContent =
      `${mm}:${ss}`;

  }


  update();

  window.addEventListener(
    'scroll',
    update,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    update
  );

})();


/* ============================================================
   CUSTOM CURSOR

   A small tape-green dot with a lagging outer ring that
   swells over interactive elements.
   Desktop + motion only.
   ============================================================ */

(function initCursor() {

  if (
    prefersReducedMotion ||
    isCoarsePointer
  ) return;


  const dot =
    document.createElement('div');

  dot.className =
    'cursor-dot';


  const ring =
    document.createElement('div');

  ring.className =
    'cursor-ring';


  document.body.appendChild(dot);

  document.body.appendChild(ring);


  let mouseX =
    window.innerWidth / 2;

  let mouseY =
    window.innerHeight / 2;

  let ringX = mouseX;

  let ringY = mouseY;


  window.addEventListener(
    'mousemove',
    event => {

      mouseX =
        event.clientX;

      mouseY =
        event.clientY;


      dot.style.transform =
        `translate(${mouseX}px, ${mouseY}px)`;


      document.body.classList.add(
        'cursor-active'
      );

    }
  );


  function loop() {

    ringX +=
      (mouseX - ringX) * 0.18;

    ringY +=
      (mouseY - ringY) * 0.18;


    ring.style.transform =
      `translate(${ringX}px, ${ringY}px)`;


    requestAnimationFrame(loop);

  }


  loop();


  const hoverSelector =
    'a, button, .hero-image, .chip, [role="button"]';


  document.addEventListener(
    'mouseover',
    event => {

      if (
        event.target.closest(
          hoverSelector
        )
      ) {

        ring.classList.add(
          'is-hover'
        );

      }

    }
  );


  document.addEventListener(
    'mouseout',
    event => {

      if (
        event.target.closest(
          hoverSelector
        )
      ) {

        ring.classList.remove(
          'is-hover'
        );

      }

    }
  );

})();


/* ============================================================
   MAGNETIC CTAs
   ============================================================ */

(function initMagnetic() {

  if (
    prefersReducedMotion ||
    isCoarsePointer
  ) return;


  const targets =
    document.querySelectorAll(
      '.footer-cta, .view-all'
    );


  targets.forEach(target => {

    target.addEventListener(
      'mousemove',
      event => {

        const rect =
          target.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left -
          rect.width / 2;


        const y =
          event.clientY -
          rect.top -
          rect.height / 2;


        target.style.transform =
          `translate(${x * 0.18}px, ${y * 0.35}px)`;

      }
    );


    target.addEventListener(
      'mouseleave',
      () => {

        target.style.transform = '';

      }
    );

  });

})();


/* ============================================================
   HERO MUSIC PLAYER
   ============================================================ */

(function initMusic() {

  const audio =
    document.getElementById(
      'bg-music'
    );


  const heroImage =
    document.querySelector(
      '.hero-image'
    );


  const freqValue =
    document.getElementById(
      'freq-value'
    );


  if (!audio || !heroImage) return;


  const tracks = [
    'music/music1.mp3',
    'music/music2.mp3',
    'music/music3.mp3',
    'music/music4.mp3',
    'music/music5.mp3'
  ];


  let currentTrack = 0;

  let isPlaying = false;

  let clickTimer = null;


  /* ----------------------------------------------------------
     Update frequency UI
     ---------------------------------------------------------- */

  function updateFreqUI() {

    if (!freqValue) return;


    const current =
      String(currentTrack + 1)
        .padStart(2, '0');


    const total =
      String(tracks.length)
        .padStart(2, '0');


    freqValue.textContent =
      `${current} / ${total}`;

  }


  /* ----------------------------------------------------------
     Load track
     ---------------------------------------------------------- */

  function loadTrack(index) {

    audio.src =
      tracks[index];

    audio.load();

    updateFreqUI();

  }


  /* ----------------------------------------------------------
     Play
     ---------------------------------------------------------- */

  async function playTrack() {

    try {

      await audio.play();

      isPlaying = true;

      heroImage.classList.add(
        'is-playing'
      );

    } catch (error) {

      console.log(
        'Audio blocked until user gesture:',
        error
      );

      isPlaying = false;

    }

  }


  /* ----------------------------------------------------------
     Pause
     ---------------------------------------------------------- */

  function pauseTrack() {

    audio.pause();

    isPlaying = false;

    heroImage.classList.remove(
      'is-playing'
    );

  }


  /* ----------------------------------------------------------
     Single click
     ---------------------------------------------------------- */

  heroImage.addEventListener(
    'click',
    () => {

      /*
        Delay the single click slightly so
        double-click can take priority.
      */

      if (clickTimer) return;


      clickTimer =
        setTimeout(
          async () => {

            clickTimer = null;


            /*
              Load first track on first interaction.
            */

            if (!audio.src) {

              loadTrack(
                currentTrack
              );

            }


            if (isPlaying) {

              pauseTrack();

            } else {

              /*
                Hero music toggle gets the
                normal click sound.
              */
              playSound('click');

              await playTrack();

            }

          },
          250
        );

    }
  );


  /* ----------------------------------------------------------
     Double click = next track
     ---------------------------------------------------------- */

  heroImage.addEventListener(
    'dblclick',
    async () => {

      clearTimeout(
        clickTimer
      );

      clickTimer = null;


      currentTrack =
        (currentTrack + 1) %
        tracks.length;


      loadTrack(
        currentTrack
      );


      playSound('click');


      if (isPlaying) {

        await playTrack();

      }

    }
  );


  /* ----------------------------------------------------------
     Keyboard accessibility
     ---------------------------------------------------------- */

  heroImage.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        heroImage.click();

      }

    }
  );


  /* ----------------------------------------------------------
     Audio state
     ---------------------------------------------------------- */

  audio.addEventListener(
    'play',
    () => {

      isPlaying = true;

    }
  );


  audio.addEventListener(
    'pause',
    () => {

      isPlaying = false;

    }
  );


  audio.addEventListener(
    'ended',
    () => {

      isPlaying = false;

      heroImage.classList.remove(
        'is-playing'
      );

    }
  );


  /* ----------------------------------------------------------
     Initial UI
     ---------------------------------------------------------- */

  updateFreqUI();

})();


/* ============================================================
   PAGE NAVIGATION SOUND
   Old-radio click before switching pages.
   ============================================================ */

(function initNavigationSounds() {

  document
    .querySelectorAll('a[href]')
    .forEach(link => {

      link.addEventListener('click', event => {

        const href =
          link.getAttribute('href');

        if (!href) return;


        /*
          Ignore:
          - external links
          - new tabs
          - mail links
          - same-page anchors
          - javascript links
        */

        const isExternal =
          link.target === '_blank' ||
          href.startsWith('http') ||
          href.startsWith('mailto:') ||
          href.startsWith('#') ||
          href.startsWith('javascript:');


        if (isExternal) return;


        /*
          Don't interfere with modifier-clicks.
          Ctrl/Cmd-click etc. should behave normally.
        */

        if (
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }


        /*
          Stop the browser navigating immediately.
        */

        event.preventDefault();


        /*
          Play the old-radio sound.
        */

        const sound =
          new Audio('./sounds/click.mp3');

        sound.volume = 1;

        sound.currentTime = 0;


        /*
          Start the sound FIRST,
          then navigate shortly afterwards.
        */

        sound.play()
          .catch(() => {})
          .finally(() => {

            setTimeout(() => {

              window.location.href = href;

            }, 120);

          });

      });

    });

})();


/* ============================================================
   NORMAL BUTTON SOUNDS

   Any normal <button> gets:
   → click.mp3

   EXCEPT:
   - transmit button
   - navigation links
   ============================================================ */

(function initButtonSounds() {

  document
    .querySelectorAll('button')
    .forEach(button => {

      /*
        Contact transmit button has its own
        special transmission sound.
      */

      if (
        button.id ===
        'transmit-button'
      ) {
        return;
      }


      button.addEventListener(
        'click',
        () => {

          playSound('click');

        }
      );

    });

})();


/* ============================================================
   CONTACT TRANSMISSION SOUND

   The actual contact form submission sound is handled
   by contact.js.

   This is intentionally NOT attached here so the sound
   doesn't play twice.
   ============================================================ */