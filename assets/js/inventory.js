/* ==========================================================================
   GS Builder & Engineers — Inventory page (render / filter / search)
   Pure vanilla JS. Reads window.GS_INVENTORY from assets/js/inventory-data.js
   (the only file that holds listings) and drives pages/inventory.html:

   - free-text search across title, society, block, id & description
     (every space-separated term must match — "5 marla mvhs" works)
   - filters: type chips (Plot / Shop / Apartment), society, purpose
     (sale / rent), price bands (per purpose), size bands (per unit)
   - sorts: Featured first, Newest, Price low→high / high→low, Size
   - up to 3 optional photos per card (data `images` array) with small
     dot switchers on the card; missing photos fall back to the
     branded placeholder
   - live count + empty state + one-click "clear all filters"
   - deep links: every filter lives in the URL
     (?type=shop&society=Faisal+Town&purpose=rent) so a filtered view is
     shareable and the society-card "Inventory" buttons land pre-filtered
   ========================================================================== */

(function () {
  'use strict';

  var DATA = window.GS_INVENTORY || { listings: [] };
  var LISTINGS = DATA.listings || [];
  var DEFAULT_IMG = (window.GS_SITE_ROOT || '.') + '/assets/images/default-listing.webp';

  var LAC = 100000;
  var CRORE = 10000000;

  /* ------------------------------------------------------------------
     Price / size bands — options in the page's selects carry these ids
  ------------------------------------------------------------------ */
  var PRICE_BANDS = {
    'sale-under-1cr': { purpose: 'sale', min: 0, max: 10000000 },
    'sale-1-2cr': { purpose: 'sale', min: 10000000, max: 20000000 },
    'sale-2cr-plus': { purpose: 'sale', min: 20000000, max: Infinity },
    'rent-under-60k': { purpose: 'rent', min: 0, max: 60000 },
    'rent-60k-1lac': { purpose: 'rent', min: 60000, max: 100000 },
    'rent-1lac-plus': { purpose: 'rent', min: 100000, max: Infinity }
  };

  var SIZE_BANDS = {
    'marla-up-to-5': { unit: 'marla', min: 0, max: 5 },
    'marla-5-8': { unit: 'marla', min: 5, max: 8 },
    'marla-10': { unit: 'marla', min: 8, max: 12 },
    'marla-kanal': { unit: 'marla', min: 18, max: Infinity },
    'sqft-up-to-1100': { unit: 'sqft', min: 0, max: 1100 },
    'sqft-1100-1400': { unit: 'sqft', min: 1100, max: 1400 },
    'sqft-1400-plus': { unit: 'sqft', min: 1400, max: Infinity }
  };

  var TYPE_LABELS = { plot: 'Plot', shop: 'Shop', apartment: 'Apartment' };
  var STATUS_LABELS = { available: 'Available', reserved: 'Reserved', booked: 'Booked' };

  var els = {};
  var state = { q: '', type: 'all', society: 'all', purpose: 'all', price: 'all', size: 'all', sort: 'featured' };
  var searchTimer = null;

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* sale → "PKR 52 Lac" / "PKR 1.35 Crore" · rent → "PKR 55,000 / month" */
  function formatPrice(l) {
    var n = l.price;
    if (l.purpose === 'rent') {
      return 'PKR ' + n.toLocaleString('en-PK') + ' <span>/ month</span>';
    }
    if (n >= CRORE) {
      var cr = Math.round((n / CRORE) * 100) / 100;
      return 'PKR ' + cr + ' Crore';
    }
    return 'PKR ' + Math.round(n / LAC) + ' Lac';
  }

  function sizeLabel(l) {
    if (!l.area) return '';
    var v = l.area % 1 === 0 ? l.area : l.area.toFixed(1);
    if (l.unit === 'sqft') return v.toLocaleString('en-PK') + ' sqft';
    if (l.area >= 19.5) return '1 Kanal';       /* 20 marla = 1 kanal */
    return v + ' Marla';
  }

  /* listing photos: `images` array (1–3, optional) with backward
     compatibility for a plain `image` string; none = branded placeholder */
  function listingImages(l) {
    var imgs = [];
    if (l.images && l.images.length) imgs = l.images.slice(0, 3);
    else if (l.image) imgs = [l.image];
    if (!imgs.length) imgs = [DEFAULT_IMG];
    return imgs;
  }

  function searchableText(l) {
    return [
      l.id, l.title, l.society, l.block, l.description,
      TYPE_LABELS[l.type], l.purpose === 'rent' ? 'rent for rent' : 'sale buy',
      formatPrice(l).replace(/<[^>]*>/g, ''), sizeLabel(l)
    ].join(' ').toLowerCase();
  }

  /* ------------------------------------------------------------------
     Filtering
  ------------------------------------------------------------------ */
  function matches(l) {
    if (state.type !== 'all' && l.type !== state.type) return false;
    if (state.society !== 'all' && l.society !== state.society) return false;
    if (state.purpose !== 'all' && l.purpose !== state.purpose) return false;

    if (state.price !== 'all') {
      var pb = PRICE_BANDS[state.price];
      if (!pb) return false;
      if (l.purpose !== pb.purpose) return false;
      if (l.price < pb.min || l.price >= pb.max) return false;
    }

    if (state.size !== 'all') {
      var sb = SIZE_BANDS[state.size];
      if (!sb) return false;
      if (l.unit !== sb.unit) return false;
      if (l.area < sb.min || l.area >= sb.max) return false;
    }

    var terms = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var hay = searchableText(l);
    for (var i = 0; i < terms.length; i++) {
      if (hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function sortResults(list) {
    var byPrice = function (a, b) { return a.price - b.price; };
    var byDate = function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); };
    switch (state.sort) {
      case 'price-asc': list.sort(function (a, b) { return byPrice(a, b) || byDate(b, a); }); break;
      case 'price-desc': list.sort(function (a, b) { return byPrice(b, a) || byDate(b, a); }); break;
      case 'size-desc': list.sort(function (a, b) { return (b.area || 0) - (a.area || 0); }); break;
      case 'newest': list.sort(byDate); break;
      /* featured first, then newest */
      default: list.sort(function (a, b) {
        return (!!b.featured - !!a.featured) || byDate(b, a);
      });
    }
    return list;
  }

  /* ------------------------------------------------------------------
     Rendering
  ------------------------------------------------------------------ */
  function cardHTML(l, i) {
    var imgs = listingImages(l);

    /* Custom number option: a listing may carry its own `whatsapp` /
       `phone` (e.g. a dedicated agent); otherwise the site-wide numbers
       from GS_SITE (assets/js/includes.js) are used. */
    var waNum = String(l.whatsapp || (window.GS_SITE && window.GS_SITE.whatsapp) || '923453707530')
      .replace(/[^\d]/g, '');
    var telNum = String(l.phone || (window.GS_SITE && window.GS_SITE.phone) || '+923453707530')
      .replace(/[^+\d]/g, '');
    var wa = 'https://wa.me/' + waNum +
      '?text=' + encodeURIComponent(
        'Hello GS Builder & Engineers, I am interested in listing ' +
        ' — ' + l.title + ' (' + l.society + '). Is it still available?');
    var tel = 'tel:' + telNum;

    var meta = [];
    var sl = sizeLabel(l);
    if (sl) meta.push('<li>' + esc(sl) + '</li>');
    if (l.beds) meta.push('<li>' + l.beds + ' Bed' + (l.beds > 1 ? 's' : '') + '</li>');
    if (l.baths) meta.push('<li>' + l.baths + ' Bath' + (l.baths > 1 ? 's' : '') + '</li>');
    if (l.floor) meta.push('<li>' + esc(l.floor) + '</li>');

    /* dot switchers — only when the listing has more than one photo */
    var dots = '';
    if (imgs.length > 1) {
      dots = '<div class="inv-dots" role="group" aria-label="Listing photos">';
      for (var d = 0; d < imgs.length; d++) {
        dots += '<button type="button" class="inv-dot' + (d === 0 ? ' on' : '') +
          '" data-src="' + esc(imgs[d]) + '" aria-label="Photo ' + (d + 1) +
          ' of ' + imgs.length + '"></button>';
      }
      dots += '</div>';
    }

    return (
      '<article class="inv-card" style="animation-delay:' + Math.min(i * 35, 320) + 'ms">' +
      '<div class="inv-thumb">' +
      '<img src="' + esc(imgs[0]) + '" alt="' + esc(l.title) + ' — ' + esc(l.society) + '" loading="lazy">' +
      dots +
      '<span class="inv-chip inv-chip-type">' + TYPE_LABELS[l.type] + '</span>' +
      (l.status !== 'available' ? '<span class="inv-chip inv-chip-status s-' + l.status + '">' + STATUS_LABELS[l.status] + '</span>' : '') +
      (l.purpose === 'rent' ? '<span class="inv-chip inv-chip-rent">For Rent</span>' : '') +
      '</div>' +
      '<div class="inv-base">' +
      '<div class="inv-ref">' + esc(l.society) + '</div>' +
      '<h3>' + esc(l.title) + '</h3>' +
      '<div class="inv-loc">' + esc(l.block) + '</div>' +
      (meta.length ? '<ul class="inv-meta">' + meta.join('') + '</ul>' : '') +
      '<div class="inv-price">' + formatPrice(l) + '</div>' +
      '<div class="inv-actions">' +
      '<a class="inv-wa" href="' + wa + '" target="_blank" rel="noopener">' +
      '<svg width="13" height="13" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.02 3 3.32 8.7 3.32 15.72c0 2.24.59 4.42 1.7 6.34L3.2 29l7.13-1.87c1.85 1 3.94 1.54 6.07 1.54h.01c7.01 0 12.72-5.7 12.72-12.72C28.13 8.7 23.06 3 16.04 3zm0 23.33c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.03 1.06 1.08-3.93-.25-.4a10.55 10.55 0 0 1-1.62-5.63c0-5.85 4.76-10.61 10.62-10.61 2.83 0 5.49 1.1 7.49 3.11a10.55 10.55 0 0 1-1.5 16.62 10.6 10.6 0 0 1-6 1.49zm5.82-7.94c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.83.99-1.01 1.2-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.29c.16.21 2.21 3.55 5.51 4.83.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z"/></svg>' +
      'Enquire' +
      '</a>' +
      '<a class="inv-call" href="' + tel + '">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
      'Call' +
      '</a>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function render() {
    var results = sortResults(LISTINGS.filter(matches));
    els.grid.innerHTML = results.map(cardHTML).join('');
    els.empty.hidden = results.length > 0;
    var n = results.length;
    els.count.textContent = n + ' propert' + (n === 1 ? 'y' : 'ies') +
      (LISTINGS.length !== n ? ' of ' + LISTINGS.length : '');
    writeURL();
  }

  /* ------------------------------------------------------------------
     URL sync — filtered views are shareable / bookmarkable
  ------------------------------------------------------------------ */
  function writeURL() {
    try {
      var p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.type !== 'all') p.set('type', state.type);
      if (state.society !== 'all') p.set('society', state.society);
      if (state.purpose !== 'all') p.set('purpose', state.purpose);
      if (state.price !== 'all') p.set('price', state.price);
      if (state.size !== 'all') p.set('size', state.size);
      if (state.sort !== 'featured') p.set('sort', state.sort);
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + '#societies');
    } catch (e) { /* older browsers — filtering still works without URL sync */ }
  }

  function readURL() {
    try {
      var p = new URLSearchParams(location.search);
      if (p.get('q')) state.q = p.get('q');
      var t = p.get('type');
      if (t && TYPE_LABELS[t]) state.type = t;
      if (p.get('society') && els.society) {
        var s = p.get('society');
        var opt = els.society.querySelector('option[value="' + s.replace(/"/g, '\\"') + '"]');
        if (opt) state.society = s;
      }
      if (p.get('purpose') === 'sale' || p.get('purpose') === 'rent') state.purpose = p.get('purpose');
      var price = p.get('price');
      /* legacy band ids from earlier pages → current bands */
      if (price === 'sale-under-60' || price === 'sale-60-1cr') price = 'sale-under-1cr';
      if (price && PRICE_BANDS[price]) state.price = price;
      if (p.get('size') && SIZE_BANDS[p.get('size')]) state.size = p.get('size');
      if (p.get('sort')) state.sort = p.get('sort');
      if (p.get('q')) els.q.value = state.q;
    } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------
     Wiring
  ------------------------------------------------------------------ */
  function syncControls() {
    els.chips.forEach(function (c) {
      var on = c.dataset.type === state.type;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    els.society.value = state.society;
    els.purpose.value = state.purpose;
    els.price.value = state.price;
    els.size.value = state.size;
    els.sort.value = state.sort;
  }

  function apply() {
    syncControls();
    render();
  }

  function reset() {
    state = { q: '', type: 'all', society: 'all', purpose: 'all', price: 'all', size: 'all', sort: 'featured' };
    els.q.value = '';
    apply();
    els.q.focus();
  }

  function init() {
    els.grid = document.getElementById('inv-grid');
    els.empty = document.getElementById('inv-empty');
    els.count = document.getElementById('inv-count');
    els.q = document.getElementById('inv-q');
    els.society = document.getElementById('inv-society');
    els.purpose = document.getElementById('inv-purpose');
    els.price = document.getElementById('inv-price');
    els.size = document.getElementById('inv-size');
    els.sort = document.getElementById('inv-sort');
    els.reset = document.querySelectorAll('.inv-reset');
    els.chips = Array.prototype.slice.call(document.querySelectorAll('.inv-chipbtn'));
    if (!els.grid) return;

    /* photo dots + broken-photo fallback (delegated — cards re-render) */
    els.grid.addEventListener('click', function (e) {
      var dot = e.target && e.target.closest ? e.target.closest('.inv-dot') : null;
      if (!dot) return;
      var card = dot.closest('.inv-card');
      var img = card.querySelector('.inv-thumb img');
      img.src = dot.getAttribute('data-src');
      var dots = card.querySelectorAll('.inv-dot');
      for (var k = 0; k < dots.length; k++) {
        dots[k].classList[dots[k] === dot ? 'add' : 'remove']('on');
      }
    });
    els.grid.addEventListener('error', function (e) {
      var img = e.target;
      if (!img || img.tagName !== 'IMG' || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = DEFAULT_IMG;
    }, true);

    /* society select options come straight from the data file */
    var societies = [];
    LISTINGS.forEach(function (l) {
      if (societies.indexOf(l.society) === -1) societies.push(l.society);
    });
    societies.sort();
    societies.forEach(function (s) {
      var o = document.createElement('option');
      o.value = s; o.textContent = s;
      els.society.appendChild(o);
    });

    els.q.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.q = els.q.value;
        render();
      }, 180);
    });

    els.chips.forEach(function (c) {
      c.addEventListener('click', function () {
        state.type = c.dataset.type;
        apply();
      });
    });

    els.society.addEventListener('change', function () { state.society = els.society.value; render(); });
    els.purpose.addEventListener('change', function () {
      state.purpose = els.purpose.value;
      /* price band belongs to a purpose — drop it if it no longer applies */
      if (state.price !== 'all' && PRICE_BANDS[state.price] && PRICE_BANDS[state.price].purpose !== state.purpose) {
        state.price = 'all';
      }
      apply();
    });
    els.price.addEventListener('change', function () {
      state.price = els.price.value;
      if (state.price !== 'all') {
        state.purpose = PRICE_BANDS[state.price].purpose;
        apply();
      } else {
        render();
      }
    });
    els.size.addEventListener('change', function () { state.size = els.size.value; render(); });
    els.sort.addEventListener('change', function () { state.sort = els.sort.value; render(); });
    Array.prototype.forEach.call(els.reset, function (btn) {
      btn.addEventListener('click', reset);
    });

    readURL();
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();