/* ==========================================================================
   GS Builder & Engineers — Map Scope (magnifying-glass map viewer)
   Pure vanilla JS. Browsers can't magnify the layers inside a PDF, so every
   society map PDF has a high-resolution WebP twin (built by
   tools/maps_to_webp.py). This viewer shows that image full-screen and floats
   a circular "scope" lens under the pointer that samples the same image at
   1.5–6x, never beyond its native pixels so plot numbers stay crisp.

   Pages opt in by loading this script and adding triggers:
     <button data-map-view
             data-map-img="../assets/maps/d-17-mvhs-map.webp"
             data-map-pdf="../assets/maps/d-17-mvhs-map.pdf"
             data-map-title="D-17 MVHS — Margalla View Housing Scheme">
   Modules: singleton overlay, loader, lens math (edge-clamped), zoom
   controls + wheel, touch drag, keyboard, resize
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Config
  ------------------------------------------------------------------ */
  var ZOOM_DEF = 3;        // on-screen magnification when a map opens
  var ZOOM_MIN = 1.5;
  var ZOOM_MAX = 6;        // hard ceiling — the real one is the image itself
  var BTN_STEP = 1.5;      // x / ÷ per button press
  var WHEEL_STEP = 1.12;   // x / ÷ per wheel notch

  /* ------------------------------------------------------------------
     State — the overlay is a singleton built on first open
  ------------------------------------------------------------------ */
  var viewer = null;
  var els = {};
  var zoom = ZOOM_DEF;
  var lensD = 236;         // lens size in CSS px (re-read from CSS on measure)
  var maxZoom = ZOOM_MAX;
  var rect = null;         // displayed image box, viewport coordinates
  var lastPtr = null;      // last pointer position (clientX/Y)
  var lastPlaceAt = 0;     // ts of last lens placement — suppresses ghost clicks
  var raf = null;
  var isOpen = false;
  var lastTrigger = null;

  function clampZoom(z) {
    var ceiling = Math.max(maxZoom, ZOOM_MIN + 0.5);
    return Math.min(Math.max(z, ZOOM_MIN), ceiling);
  }

  function setReadout() {
    els.zval.textContent = zoom.toFixed(1) + '\u00D7';
  }

  /* ------------------------------------------------------------------
     Overlay markup — created once, appended to <body>
  ------------------------------------------------------------------ */
  function build() {
    viewer = document.createElement('div');
    viewer.className = 'map-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Society map viewer');
    viewer.innerHTML =
      '<div class="mv-top">' +
        '<div class="mv-head">' +
          '<span class="mv-kicker">Official Master Plan</span>' +
          '<strong class="mv-title"></strong>' +
        '</div>' +
        '<div class="mv-tools">' +
          '<div class="mv-zoom" role="group" aria-label="Scope zoom">' +
            '<button type="button" class="mv-zbtn" data-mv="out" aria-label="Zoom out">&minus;</button>' +
            '<span class="mv-zval" aria-live="polite"></span>' +
            '<button type="button" class="mv-zbtn" data-mv="in" aria-label="Zoom in">+</button>' +
          '</div>' +
          '<a class="mv-pdf" download target="_blank" rel="noopener">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14M6 11l6 6 6-6"/><path d="M5 21h14"/></svg>' +
            'PDF</a>' +
          '<button type="button" class="mv-close" aria-label="Close map viewer">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="mv-stage">' +
        '<img class="mv-img" alt="" draggable="false">' +
        '<div class="mv-lens" aria-hidden="true"></div>' +
        '<div class="mv-loader"><span></span></div>' +
        '<div class="mv-msg">The map image could not be loaded &mdash; please use the PDF button instead.</div>' +
        '<div class="mv-hint"></div>' +
      '</div>';

    document.body.appendChild(viewer);
    els = {
      stage: viewer.querySelector('.mv-stage'),
      img: viewer.querySelector('.mv-img'),
      lens: viewer.querySelector('.mv-lens'),
      loader: viewer.querySelector('.mv-loader'),
      msg: viewer.querySelector('.mv-msg'),
      hint: viewer.querySelector('.mv-hint'),
      zval: viewer.querySelector('.mv-zval'),
      title: viewer.querySelector('.mv-title'),
      pdf: viewer.querySelector('.mv-pdf'),
      close: viewer.querySelector('.mv-close')
    };

    /* Lens follows the pointer (mouse hover, pen & touch drag alike).
       e.isPrimary === false filters extra fingers on multi-touch without
       rejecting synthetic/polyfilled events where the flag is undefined. */
    els.img.addEventListener('pointerenter', function (e) {
      if (e.isPrimary === false) return;
      queueLens(e);
    });
    els.img.addEventListener('pointermove', function (e) {
      if (e.isPrimary === false) return;
      queueLens(e);
    });
    els.img.addEventListener('pointerleave', hideLens);
    els.img.addEventListener('pointercancel', hideLens);

    els.img.addEventListener('load', onImageLoad);
    els.img.addEventListener('error', onImageError);

    /* Wheel zooms the scope; empty-stage clicks close the viewer — but a
       click right after a touch drag is a ghost tap, not a close request */
    els.stage.addEventListener('wheel', onWheel, { passive: false });
    els.stage.addEventListener('click', function (e) {
      if (e.target !== els.stage) return;
      if (performance.now() - lastPlaceAt < 400) return;
      close();
    });

    viewer.querySelector('[data-mv="in"]').addEventListener('click', function () {
      setZoom(zoom * BTN_STEP);
    });
    viewer.querySelector('[data-mv="out"]').addEventListener('click', function () {
      setZoom(zoom / BTN_STEP);
    });
    els.close.addEventListener('click', close);

    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
  }

  /* ------------------------------------------------------------------
     Open / close
  ------------------------------------------------------------------ */
  function open(trigger) {
    if (!viewer) build();
    var src = trigger.getAttribute('data-map-img');
    if (!src) return;
    lastTrigger = trigger;
    var title = trigger.getAttribute('data-map-title') || 'Society master plan';
    var pdf = trigger.getAttribute('data-map-pdf');

    els.title.textContent = title;
    viewer.setAttribute('aria-label', title + ' \u2014 map viewer');
    els.img.alt = title + ' \u2014 official master plan';
    els.lens.style.backgroundImage = 'url("' + src + '")';
    if (pdf) {
      els.pdf.setAttribute('href', pdf);
      els.pdf.setAttribute('download', pdf.split('/').pop() || 'society-map.pdf');
      els.pdf.style.display = '';
    } else {
      els.pdf.removeAttribute('href');
      els.pdf.style.display = 'none';
    }

    els.msg.classList.remove('on');
    els.hint.classList.remove('hide');
    els.hint.textContent = window.matchMedia('(hover: none), (pointer: coarse)').matches
      ? 'Touch and drag the map to read the fine print'
      : 'Move over the map to magnify \u00B7 scroll or + / \u2212 to zoom';
    hideLens();
    els.img.classList.remove('ready');
    els.loader.classList.add('on');
    rect = null;

    viewer.classList.add('open');
    document.body.classList.add('no-scroll');
    isOpen = true;
    setReadout();

    /* Re-opening the same URL: the cached decode resolves instantly and no
       load event refires, so resolve manually. */
    var abs = new URL(src, document.baseURI).href;
    if (els.img.src === abs && els.img.complete && els.img.naturalWidth) onImageLoad();
    else els.img.src = src;

    els.close.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    viewer.classList.remove('open');
    document.body.classList.remove('no-scroll');
    hideLens();
    lastPtr = null;
    if (lastTrigger) lastTrigger.focus();
  }

  /* ------------------------------------------------------------------
     Image lifecycle
  ------------------------------------------------------------------ */
  function onImageLoad() {
    els.loader.classList.remove('on');
    els.img.classList.add('ready');
    measure();
  }

  function onImageError() {
    els.loader.classList.remove('on');
    els.msg.classList.add('on');
  }

  /* Cache the displayed image box, lens size and the native-pixel zoom
     ceiling (zooming past it would only interpolate a blur). */
  function measure() {
    if (!els.img.naturalWidth) return;
    lensD = els.lens.offsetWidth || 236;
    rect = els.img.getBoundingClientRect();
    if (!rect.width) { rect = null; return; }
    maxZoom = Math.min(ZOOM_MAX, els.img.naturalWidth / rect.width);
    setZoom(zoom); // re-clamp + refresh the readout
  }

  /* ------------------------------------------------------------------
     Lens
  ------------------------------------------------------------------ */
  function queueLens(e) {
    lastPtr = { x: e.clientX, y: e.clientY };
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      if (lastPtr) place(lastPtr);
    });
  }

  function hideLens() {
    els.lens.classList.remove('on');
  }

  /* Position the lens at the pointer and sample the matching region of the
     image. background-position is clamped to the image so the lens never
     shows empty space beyond the map's edges. */
  function place(p) {
    if (!rect) return;
    var x = p.x - rect.left;
    var y = p.y - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) { hideLens(); return; }
    var half = lensD / 2;
    var bw = rect.width * zoom;
    var bh = rect.height * zoom;
    var bgX = Math.min(Math.max(x * zoom - half, 0), Math.max(bw - lensD, 0));
    var bgY = Math.min(Math.max(y * zoom - half, 0), Math.max(bh - lensD, 0));
    els.lens.style.backgroundSize = bw + 'px ' + bh + 'px';
    els.lens.style.backgroundPosition = (-bgX) + 'px ' + (-bgY) + 'px';
    var s = els.stage.getBoundingClientRect();
    els.lens.style.left = (p.x - s.left - half) + 'px';
    els.lens.style.top = (p.y - s.top - half) + 'px';
    els.lens.classList.add('on');
    lastPlaceAt = performance.now();
    els.hint.classList.add('hide');
  }

  /* ------------------------------------------------------------------
     Zoom
  ------------------------------------------------------------------ */
  function setZoom(z) {
    zoom = clampZoom(z);
    setReadout();
    if (els.lens.classList.contains('on') && lastPtr) place(lastPtr);
  }

  function onWheel(e) {
    if (!isOpen || !rect) return;
    e.preventDefault();
    var d = e.deltaY * (e.deltaMode === 1 ? 33 : 1);
    setZoom(d < 0 ? zoom * WHEEL_STEP : zoom / WHEEL_STEP);
  }

  /* ------------------------------------------------------------------
     Keyboard + resize
  ------------------------------------------------------------------ */
  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === '+' || e.key === '=') setZoom(zoom * BTN_STEP);
    if (e.key === '-') setZoom(zoom / BTN_STEP);
  }

  function onResize() {
    if (!isOpen) return;
    measure();
    if (lastPtr) place(lastPtr);
  }

  /* ------------------------------------------------------------------
     Init — any [data-map-view] trigger opens the viewer
  ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    var triggers = document.querySelectorAll('[data-map-view]');
    if (!triggers.length) return;
    triggers.forEach(function (t) {
      t.addEventListener('click', function () { open(t); });
    });
  });
})();