(() => {
  const video = document.querySelector('#calcium-imaging-movie');
  if (!video) return;
  let visible = !('IntersectionObserver' in window);
  const updatePlayback = () => {
    if (visible) video.play().catch(() => {});
    else video.pause();
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updatePlayback();
    }, { threshold: 0.15 }).observe(video);
  }
  updatePlayback();
})();