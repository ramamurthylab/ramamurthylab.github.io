// Preserve links to sections of the original single-page website.
(() => {
  const paths = {'#research': '/research/', '#people': '/team/', '#publications': '/publications/', '#news': '/news/', '#contact': '/contact/', '#undergraduate-application': '/contact/#undergraduate-application'};
  const redirect = () => {
    if ((location.pathname === '/' || location.pathname === '/index.html') && paths[location.hash]) {
      location.replace(paths[location.hash]);
    }
  };
  redirect();
  window.addEventListener('hashchange', redirect);
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (!toggle || !nav) return;

  root.classList.add('js');
  toggle.hidden = false;
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = '+';
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    toggle.querySelector('span').textContent = open ? '−' : '+';
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  const mobile = window.matchMedia('(max-width: 700px)');
  mobile.addEventListener('change', closeMenu);


})();

(() => {
  'use strict';
  const list = document.getElementById('publications-list');
  const toggle = document.getElementById('publications-toggle');
  if (!list || !toggle) return;

  const previewYear = Number(list.dataset.previewYear);
  const additionalPapers = [...list.children].filter(paper => {
    const year = Number(paper.querySelector('.pub-year')?.textContent.trim());
    return Number.isFinite(year) && year > 0 && year < previewYear;
  });
  if (!additionalPapers.length) return;

  const setExpanded = expanded => {
    for (const paper of additionalPapers) paper.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Show fewer publications' : 'Show all publications';
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (expanded) {
      additionalPapers[0].querySelector('a')?.focus({preventScroll: true});
      additionalPapers[0].scrollIntoView({block: 'nearest'});
    } else {
      toggle.scrollIntoView({block: 'nearest'});
    }
  });

  setExpanded(false);
  toggle.hidden = false;
})();

// A quiet surprise: three separate visits to the pyramidal cell body.
(() => {
  'use strict';
  const soma = document.querySelector('.hero-visual #pyramidal-soma');
  const neuron = document.querySelector('.hero-visual #pyramidal-neuron');
  if (!soma || !neuron) return;

  const entryWindow = 10000;
  const highlightDuration = 10000;
  let visits = 0;
  let lastEntry = null;
  let inside = false;
  let highlightTimer = null;

  const resetVisits = () => {
    visits = 0;
    lastEntry = null;
  };

  soma.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || inside) return;
    inside = true;
    if (highlightTimer !== null) return;

    const now = performance.now();
    visits = lastEntry !== null && now - lastEntry < entryWindow ? visits + 1 : 1;
    lastEntry = now;
    if (visits < 3) return;

    resetVisits();
    neuron.classList.add('is-highlighted');
    highlightTimer = window.setTimeout(() => {
      neuron.classList.remove('is-highlighted');
      highlightTimer = null;
      resetVisits();
    }, highlightDuration);
  });

  soma.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') inside = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetVisits();
  });
})();

// Keep recent news visible; older entries can be expanded as the feed grows.
(() => {
  'use strict';
  const feed = document.getElementById('news-feed');
  const toggle = document.getElementById('news-toggle');
  if (!feed || !toggle) return;

  const count = Number(feed.dataset.previewCount);
  const previewCount = Number.isInteger(count) && count > 0 ? count : 3;
  const entries = [...feed.children].filter(entry => entry.classList.contains('news-entry'));
  const olderEntries = entries.slice(previewCount);
  if (!olderEntries.length) return;

  function setExpanded(expanded) {
    olderEntries.forEach(entry => { entry.hidden = !expanded; });
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Show fewer news items' : 'Show older news';
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (expanded) olderEntries[0].scrollIntoView({block: 'nearest'});
    else toggle.scrollIntoView({block: 'nearest'});
  });

  setExpanded(false);
  toggle.hidden = false;
})();
