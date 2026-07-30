/* Scroll-clip reveal for the interstitial image under Featured Creators —
   recreates the Izanami "mesh clip" feel without WebGL: the framed image opens
   from a thin centre band to full height while the picture eases from a slight
   zoom back to 1:1, scrubbed to scroll position. Pure clip-path + transform. */
(function () {
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function init() {
    var sec = document.querySelector('.ukReveal');
    if (!sec || sec.dataset.rev === '1') return;
    sec.dataset.rev = '1';
    var frame = sec.querySelector('.ukReveal_frame');
    var img = sec.querySelector('.ukReveal_img');
    if (!frame) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame.style.clipPath = 'inset(0)';
      if (img) img.style.transform = 'scale(1)';
      return;
    }

    var MAX_INSET = parseFloat(frame.dataset.inset);   // % top & bottom when closed
    if (isNaN(MAX_INSET)) MAX_INSET = 38;
    var MAX_ZOOM = frame.dataset.zoom != null ? parseFloat(frame.dataset.zoom) : 0.14;

    function loop() {
      var r = frame.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 0 as the frame's top enters the bottom of the viewport, 1 once it has
      // risen to ~15% from the top — the image opens as you scroll through it
      var p = clamp((vh - r.top) / (vh * 0.85), 0, 1);
      var inset = ((1 - p) * MAX_INSET).toFixed(2);
      frame.style.clipPath = 'inset(' + inset + '% 0 ' + inset + '% 0)';
      if (img) img.style.transform = 'scale(' + (1 + (1 - p) * MAX_ZOOM).toFixed(4) + ')';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
