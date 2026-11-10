// Keep every photo from an event together; the arrows change events.
(() => {
  'use strict';
  const gallery = document.getElementById('photo-gallery');
  const list = document.getElementById('photo-events');
  const controls = document.getElementById('photo-event-controls');
  const count = document.getElementById('photo-event-count');
  const empty = document.getElementById('photos-empty');
  if (!gallery || !list || !controls || !count) return;
  const events = [...list.children].filter(event => event.classList.contains('photo-event'));
  if (!events.length) return;

  const previous = controls.querySelector('.photo-event-arrow--previous');
  const next = controls.querySelector('.photo-event-arrow--next');
  if (!previous || !next) return;
  let current = 0;

  function showEvent(index) {
    if (index < 0 || index >= events.length) return;
    current = index;
    events.forEach((event, position) => { event.hidden = position !== current; });
    previous.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === events.length - 1));
    const title = events[current].querySelector('h2')?.textContent.trim() || 'Photos';
    count.textContent = `${current + 1} / ${events.length} — ${title}`;
  }

  previous.addEventListener('click', () => showEvent(current - 1));
  next.addEventListener('click', () => showEvent(current + 1));
  // Keyboard arrows work only while focus is in the event controls.
  controls.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showEvent(current + (event.key === 'ArrowRight' ? 1 : -1));
  });

  showEvent(0);
  gallery.classList.add('photo-gallery--ready');
  gallery.hidden = false;
  controls.hidden = events.length < 2;
  if (empty) empty.hidden = true;
})();
