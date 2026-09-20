(() => {
  'use strict';
  const form = document.getElementById('undergraduate-form');
  if (!form) return;

  const fileInput = document.getElementById('applicant-cv');
  const fileError = document.getElementById('cv-error');
  const status = document.getElementById('application-status');
  const submit = form.querySelector('button[type="submit"]');
  const idInput = form.querySelector('[name="applicationId"]');
  const configuredUrl = String(window.LAB_APPLICATION_URL || '').trim();
  const formUrl = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?authuser=0)?$/.test(configuredUrl) ? configuredUrl : '';
  const hasBackend = typeof google !== 'undefined' && google.script && google.script.run;
  let pending = false;
  let received = false;

  if (formUrl) {
    document.querySelectorAll('.application-link').forEach(link => {
      link.href = formUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  function setStatus(message, focus = false) {
    status.textContent = message;
    status.hidden = !message;
    if (focus) {
      status.tabIndex = -1;
      status.focus({preventScroll: true});
      status.scrollIntoView({block: 'nearest'});
    }
  }

  function validateCv() {
    const file = fileInput.files[0];
    let message = '';
    if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) message = 'Please choose a PDF, DOC, or DOCX file.';
    else if (file && !file.size) message = 'This file is empty. Please choose another CV.';
    else if (file && file.size > 10_000_000) message = 'Your CV must be 10 MB or smaller.';
    fileInput.setCustomValidity(message);
    fileInput.setAttribute('aria-invalid', String(!!message));
    fileError.textContent = message;
    fileError.hidden = !message;
    return !message;
  }

  function createApplicationId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  fileInput.addEventListener('change', validateCv);
  const focusHeading = () => {
    if (window.location.hash === '#undergraduate-application') {
      document.getElementById('application-title').focus({preventScroll: true});
    }
  };
  window.addEventListener('hashchange', focusHeading);
  focusHeading();

  if (hasBackend) {
    try {
      idInput.value = createApplicationId();
      submit.disabled = false;
    } catch (error) {
      setStatus('Please use an up-to-date browser to submit this application.');
    }
  } else {
    submit.disabled = true;
    setStatus(formUrl ? 'Please open the application form to submit your responses.' : 'Form preview — submissions are not open yet.');
    if (formUrl) {
      const link = document.createElement('a');
      link.href = formUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open application form ↗';
      status.append(link);
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!hasBackend || pending || received || !idInput.value) return;
    if (!validateCv() || !form.reportValidity()) return;
    pending = true;
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    form.setAttribute('aria-busy', 'true');
    setStatus('Saving your application. Please keep this page open.');

    const failed = error => {
      pending = false;
      submit.disabled = false;
      submit.textContent = 'Submit application';
      form.removeAttribute('aria-busy');
      const message = error && typeof error.message === 'string' ? error.message : 'Your submission could not be confirmed. Please try again.';
      setStatus(message, true);
    };
    const completed = result => {
      if (!result || result.ok !== true || result.applicationId !== idInput.value) {
        failed(new Error('Your submission could not be confirmed. Please keep this page open and try again.'));
        return;
      }
      received = true;
      pending = false;
      form.removeAttribute('aria-busy');
      form.querySelector('.application-fields').hidden = true;
      form.querySelector('.application-privacy').hidden = true;
      document.querySelector('.application-intro').hidden = true;
      submit.hidden = true;
      form.reset();
      setStatus('Application received. Thank you for your interest in the Ramamurthy Lab.', true);
    };
    try {
      google.script.run.withSuccessHandler(completed).withFailureHandler(failed).submitApplication(form);
    } catch (error) {
      failed(error);
    }
  });
})();
