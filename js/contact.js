/* ============================================================
   CONTACT — TRANSMISSION LOGIC
   ============================================================ */

(function initContact() {

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const button = document.getElementById('transmit-button');

  if (!form) return;


  /* ==========================================================
     TRANSMISSION SOUND
     ========================================================== */

  const transmitSound = new Audio('./sounds/transmit.mp3');

  function playTransmitSound() {
    transmitSound.currentTime = 0;

    transmitSound.play().catch(error => {
      console.log('Transmit sound could not play:', error);
    });
  }


  /* ==========================================================
     FORM SUBMISSION
     ========================================================== */

  form.addEventListener('submit', event => {

    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();


    /* validation */

    if (!name || !email || !message) {

      status.textContent =
        'TRANSMISSION BLOCKED — COMPLETE ALL FIELDS.';

      status.classList.remove('success');

      return;
    }


    /* start transmission */

    playTransmitSound();

    form.classList.add('is-transmitting');

    button.disabled = true;

    status.textContent =
      'ESTABLISHING CONNECTION...';

    status.classList.remove('success');


    /* simulated transmission */

    setTimeout(() => {

      status.textContent =
        'SIGNAL QUEUED — CONNECTION RECEIVED.';

      status.classList.add('success');

      form.classList.remove('is-transmitting');

      button.disabled = false;

      form.reset();

    }, 1400);

  });


  /* ==========================================================
     INPUT SIGNAL EFFECT
     ========================================================== */

  const inputs = form.querySelectorAll(
    'input, textarea'
  );

  inputs.forEach(input => {

    input.addEventListener('focus', () => {

      input.closest('label')?.classList.add('is-active');

    });

    input.addEventListener('blur', () => {

      input.closest('label')?.classList.remove('is-active');

    });

  });

})();