/* ==========================================================================
   GS Builder & Engineers — Main JavaScript
   Pure vanilla JS. Modules: header, nav, hero slider, reveal, counters,
   sectors, group carousel, timeline, filters, accordion, faq, modal,
   contact form, newsletter, image fallback + download, misc
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Sticky header
  ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     2. Full-screen navigation menu
  ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('#nav-icon4');
    var menu = document.querySelector('.full-screen-navmenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      menu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Support keyboard access on the hamburger (click already covers touch)
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });

    // Always run the mobile accordion binding — it only responds on small screens
    var cols = document.querySelectorAll('.fsnm-col');
    cols.forEach(function (col) {
      var header = col.querySelector('.fsnm-header');
      if (!header) return;
      header.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        if (!window.matchMedia('(max-width: 1024px)').matches) return;
        var isOpen = col.classList.contains('open');
        cols.forEach(function (c) {
          c.classList.remove('open');
          var l = c.querySelector('.fsnm-list');
          if (l) l.style.maxHeight = '0';
        });
        if (!isOpen) {
          col.classList.add('open');
          var list = col.querySelector('.fsnm-list');
          if (list) list.style.maxHeight = list.scrollHeight + 'px';
        }
      });
    });

    // Auto-open the Services column on mobile so links are reachable
    if (window.matchMedia('(max-width: 1024px)').matches) {
      var svcCol = document.querySelector('.fsnm-col');
      if (svcCol) {
        svcCol.classList.add('open');
        var svcList = svcCol.querySelector('.fsnm-list');
        if (svcList && svcList.style.maxHeight === '') svcList.style.maxHeight = svcList.scrollHeight + 'px';
      }
    }

    // Close the menu with Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggle.classList.remove('open');
        menu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });

    // Highlight current page link
    var path = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    document.querySelectorAll('.fsnm-list a, .footer-col a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.endsWith(path) && path !== 'index.html') a.classList.add('active');
    });
  }

  /* ------------------------------------------------------------------
     3. Hero slider (homepage)
  ------------------------------------------------------------------ */
  function initHeroSlider() {
    var slider = document.querySelector('.hero-slider');
    if (!slider) return;
    var slides = slider.querySelectorAll('.hero-slide');
    var currEl = slider.querySelector('.slides-frac .curr');
    var totEl = slider.querySelector('.slides-frac .tot');
    if (!slides.length) return;

    var index = 0;
    var timer = null;
    var SPEED = 9000;

    totEl.textContent = String(slides.length).padStart(2, '0');

    function show(i) {
      slides[index].classList.remove('active');
      var video = slides[index].querySelector('video');
      if (video) video.pause();
      index = (i + slides.length) % slides.length;
      var slide = slides[index];
      slide.classList.add('active');
      var nextVideo = slide.querySelector('video');
      if (nextVideo) { nextVideo.currentTime = 0; nextVideo.play().catch(function(){}); }
      if (currEl) currEl.textContent = String(index + 1).padStart(2, '0');
      // retrigger title animation
      var title = slide.querySelector('.hero-slide-title');
      if (title) {
        title.querySelectorAll('span').forEach(function (s) {
          s.style.animation = 'none';
          void s.offsetWidth;
          s.style.animation = '';
        });
      }
    }

    function start() {
      stop();
      timer = setInterval(function () { show(index + 1); }, SPEED);
    }
    function stop() { if (timer) clearInterval(timer); }

    var prev = slider.querySelector('[data-slide-prev]');
    var next = slider.querySelector('[data-slide-next]');
    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    // Pause videos except active
    slides.forEach(function (s, i) {
      var v = s.querySelector('video');
      if (v && i !== 0) v.pause();
    });
    start();
  }

  /* ------------------------------------------------------------------
     4. Reveal on scroll
  ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ------------------------------------------------------------------
     5. Animated counters
  ------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('.counter-number');
    if (!counters.length) return;

    function animate(el) {
      var from = parseFloat(el.dataset.from || '0');
      var to = parseFloat(el.dataset.to);
      var dur = parseInt(el.dataset.duration || '2000', 10);
      var plain = el.dataset.format === 'plain';
      var start = null;
      // Preserve any inline suffix (e.g. "+", "%") that lives inside .counter-number —
      // setting el.textContent on each frame would wipe it out mid-animation.
      var suffixEl = el.querySelector('.counter-suffix');
      var suffix = suffixEl ? (suffixEl.dataset.suffix || suffixEl.textContent) : '';
      var textNode = null;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(from + (to - from) * eased);
        var text = plain ? String(val) : val.toLocaleString('en-US');
        if (suffixEl) {
          if (!textNode || !textNode.parentNode) {
            // first (or rebuilt) frame — clear any junk children except the suffix
            Array.prototype.slice.call(el.childNodes).forEach(function (n) {
              if (n !== suffixEl) el.removeChild(n);
            });
            textNode = document.createTextNode(text);
            el.insertBefore(textNode, suffixEl);
          } else {
            textNode.nodeValue = text;
          }
          if (suffix && suffixEl.textContent !== suffix) suffixEl.textContent = suffix;
        } else {
          el.textContent = text;
        }
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });

    // About page stat bars — fill when scrolled into view
    var bars = document.querySelectorAll('.ab-bar-fill[data-width]');
    if (bars.length) {
      var barIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.setProperty('--bar-w', entry.target.dataset.width + '%');
            // trigger transition on next frame
            requestAnimationFrame(function () {
              entry.target.classList.add('animated');
            });
            barIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      bars.forEach(function (b) { barIo.observe(b); });
    }
  }

  /* ------------------------------------------------------------------
     6. Sectors expandable rows (homepage)
  ------------------------------------------------------------------ */
  function initSectorRows() {
    var rows = document.querySelectorAll('.sector-row[data-toggle]');
    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var wasOpen = row.classList.contains('open');
        rows.forEach(function (r) { r.classList.remove('open'); });
        if (!wasOpen) row.classList.add('open');
      });
    });

    // Sector flip-tiles — click navigates (tiles are divs to allow CSS hover)
    document.querySelectorAll('.sector-tile[data-href]').forEach(function (tile) {
      tile.addEventListener('click', function () {
        window.location.href = tile.dataset.href;
      });
    });
  }

  /* ------------------------------------------------------------------
     7. Group companies carousel
  ------------------------------------------------------------------ */
  function initGroupCarousel() {
    var track = document.querySelector('.group-track');
    if (!track) return;
    var prev = document.querySelector('[data-group-prev]');
    var next = document.querySelector('[data-group-next]');
    var step = function () { return (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 450) + 30; };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  /* ------------------------------------------------------------------
     8. History timeline (About page)
  ------------------------------------------------------------------ */
  function initTimeline() {
    var yearsWrap = document.querySelector('.timeline-years');
    var content = document.querySelector('.event-content');
    if (!yearsWrap || !content || typeof GS_HISTORY === 'undefined') return;

    var data = GS_HISTORY;
    var years = Object.keys(data);
    var current = years[0];
    var itemIndex = 0;
    var filter = 'all';

    // Build year buttons
    yearsWrap.innerHTML = '';
    years.forEach(function (y) {
      var btn = document.createElement('button');
      btn.className = 'timeline-year';
      btn.dataset.year = y;
      btn.innerHTML = '<span class="circle"></span><span>' + y + '</span>';
      btn.addEventListener('click', function () {
        current = y;
        itemIndex = 0;
        render();
      });
      yearsWrap.appendChild(btn);
    });

    var filterSelect = document.querySelector('#event-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', function () {
        filter = this.value;
        itemIndex = 0;
        // Move to first year that has items matching filter
        var found = false;
        for (var i = 0; i < years.length; i++) {
          if (filter === 'all' || data[years[i]].some(function (e) { return e.type === filter; })) {
            current = years[i];
            found = true;
            break;
          }
        }
        if (!found) { current = years[0]; }
        itemIndex = 0;
        render();
      });
    }

    var prevBtn = document.querySelector('[data-event-prev]');
    var nextBtn = document.querySelector('[data-event-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { move(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { move(1); });

    function visibleItems() {
      return data[current].filter(function (e) { return filter === 'all' || e.type === filter; });
    }

    function move(dir) {
      var items = visibleItems();
      if (!items.length) return;
      itemIndex = (itemIndex + dir + items.length) % items.length;
      render();
    }

    function render() {
      var items = visibleItems();
      if (!items.length) {
        content.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:rgba(255,255,255,.6)">No entries for this filter.</div>';
        highlight();
        return;
      }
      if (itemIndex >= items.length) itemIndex = 0;
      var e = items[itemIndex];

      var badge = e.type === 'Project' ? 'Key Project' : e.type === 'Group' ? 'Group Companies' : 'Award';
      var metas = '';
      if (e.type === 'Project') {
        if (e.sector) metas += '<span><b>Sector:</b> ' + e.sector + '</span>';
        if (e.developer) metas += '<span><b>Developer:</b> ' + e.developer + '</span>';
        if (e.status) metas += '<span><b>Status:</b> ' + e.status + '</span>';
        if (e.scope) metas += '<span><b>Scope:</b> ' + e.scope + '</span>';
        if (e.contractValue) metas += '<span><b>Contract Value:</b> ' + e.contractValue + '</span>';
        if (e.city) metas += '<span><b>City:</b> ' + e.city + '</span>';
      }
      var desc = e.description || '';
      content.innerHTML =
        '<div class="event-img" data-badge="' + badge + '"><img src="' + e.img + '" alt="' + e.title + '" loading="lazy"></div>' +
        '<div class="event-info">' +
          '<span class="event-year">' + current + (items.length > 1 ? ' &mdash; ' + (itemIndex + 1) + ' / ' + items.length : '') + '</span>' +
          '<h3>' + e.title + '</h3>' +
          (desc ? '<p>' + desc + '</p>' : '') +
          (metas ? '<div class="meta-row">' + metas + '</div>' : '') +
        '</div>';
      highlight();
    }

    function highlight() {
      yearsWrap.querySelectorAll('.timeline-year').forEach(function (b) {
        b.classList.toggle('active', b.dataset.year === current);
      });
      var active = yearsWrap.querySelector('.timeline-year.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    render();
  }

  /* ------------------------------------------------------------------
     9. Projects page filters
  ------------------------------------------------------------------ */
  function initProjectFilters() {
    var grid = document.querySelector('.projects-grid[data-filterable]');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
    var selects = document.querySelectorAll('.filters-bar select');
    var noResults = document.querySelector('.no-results');
    var loadMore = document.querySelector('.projects-load-more');
    var shown = 6;

    function apply() {
      var status = document.querySelector('#f-status') ? document.querySelector('#f-status').value : 'all';
      var scope = document.querySelector('#f-scope') ? document.querySelector('#f-scope').value : 'all';
      var sector = document.querySelector('#f-sector') ? document.querySelector('#f-sector').value : 'all';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var match =
          (status === 'all' || card.dataset.status === status) &&
          (scope === 'all' || card.dataset.scope === scope) &&
          (sector === 'all' || card.dataset.sector === sector);
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (noResults) noResults.classList.toggle('show', visibleCount === 0);
      paginate();
    }

    function paginate() {
      var visible = cards.filter(function (c) { return c.style.display !== 'none'; });
      visible.forEach(function (c, i) {
        c.style.display = i < shown ? '' : 'none';
      });
      if (loadMore) loadMore.style.display = shown >= visible.length ? 'none' : '';
    }

    if (loadMore) {
      loadMore.addEventListener('click', function (e) {
        e.preventDefault();
        shown += 6;
        paginate();
      });
    }

    selects.forEach(function (s) { s.addEventListener('change', function () { shown = 6; apply(); }); });
    apply();
  }

  /* ------------------------------------------------------------------
     10. Accordions (expertise tabs)
  ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
      9b. Homepage "Latest Projects" — category filter buttons
   ------------------------------------------------------------------ */
  function initCategoryFilter() {
    var section = document.querySelector('[data-project-filter]');
    if (!section) return;
    var grid = section.querySelector('.projects-grid');
    if (!grid) return;
    var buttons = section.querySelectorAll('.lp-btn');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.category;
        buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        cards.forEach(function (card) {
          var show = cat === 'all' || card.dataset.category === cat;
          card.classList.toggle('is-hidden', !show);
          if (show) card.classList.add('visible'); // skip stagger, keep filters instant
        });
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll('.accordion-tab').forEach(function (tab) {
      var head = tab.querySelector('.acc-head');
      var body = tab.querySelector('.acc-body');
      if (!head || !body) return;
      head.addEventListener('click', function () {
        var isOpen = tab.classList.contains('open');
        // close siblings
        tab.parentElement.querySelectorAll('.accordion-tab.open').forEach(function (t) {
          t.classList.remove('open');
          t.querySelector('.acc-body').style.maxHeight = '0';
        });
        if (!isOpen) {
          tab.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     11. FAQ accordion
  ------------------------------------------------------------------ */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-question');
      var a = item.querySelector('.faq-answer');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-answer').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     12. Leader modals
  ------------------------------------------------------------------ */
  function initModals() {
    var overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;
    var body = overlay.querySelector('.modal-body');

    // Society map cards ([data-map]) reuse the same overlay
    document.querySelectorAll('[data-map]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var id = 'map-' + trigger.dataset.map;
        var tpl = document.getElementById(id);
        if (!tpl || !body) return;
        body.innerHTML = tpl.innerHTML;
        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
      });
    });

    document.querySelectorAll('[data-modal]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var id = trigger.dataset.modal;
        var tpl = document.getElementById(id);
        if (tpl && body) body.innerHTML = tpl.innerHTML;
        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
      });
    });

    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ------------------------------------------------------------------
     13. Contact form
  ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (f) {
        if (!f.value.trim()) {
          valid = false;
          f.style.borderBottomColor = '#ffaa00';
        } else {
          f.style.borderBottomColor = '';
        }
      });
      if (!valid) return;
      var success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
      form.reset();
    });
  }

  /* ------------------------------------------------------------------
     14. Newsletter forms
  ------------------------------------------------------------------ */
  function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input');
        if (input && !input.value.trim()) return;
        var btn = form.querySelector('button');
        var original = btn.textContent;
        btn.textContent = 'Subscribed ✓';
        setTimeout(function () { btn.textContent = original; form.reset(); }, 2600);
      });
    });
  }

  /* ------------------------------------------------------------------
      14b. FAQ tabs (contact page) — Construction / Real Estate
   ------------------------------------------------------------------ */
  function initFaqTabs() {
    var tabs = document.querySelectorAll('.faq-tab');
    var panels = document.querySelectorAll('.faq-panel');
    if (!tabs.length || !panels.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var target = document.querySelector('#' + tab.dataset.faqTab);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ------------------------------------------------------------------
      14c. Contact form — floating labels, validation + reCAPTCHA guard
   ------------------------------------------------------------------ */
  function initCfForm() {
    var form = document.querySelector('#cf-form');
    if (!form) return;

    var nameField = form.querySelector('#cf-name');
    var emailField = form.querySelector('#cf-email');
    var msgField = form.querySelector('#cf-message');
    var err = form.querySelector('.cf-error');
    var success = form.querySelector('.cf-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = [];

      if (!nameField || !nameField.value.trim()) problems.push('your name');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) problems.push('a valid email address');
      if (msgField && !msgField.value.trim()) problems.push('a message');

      var hasCaptcha = !!form.querySelector('.g-recaptcha');
      if (hasCaptcha && typeof grecaptcha !== 'undefined') {
        var token = grecaptcha.getResponse ? grecaptcha.getResponse() : '';
        if (!token) problems.push('the reCAPTCHA verification');
      }

      if (problems.length) {
        if (err) {
          err.textContent = 'Please provide ' + problems.join(', ') + '.';
          err.classList.add('show');
        }
        return;
      }
      if (err) err.classList.remove('show');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      if (hasCaptcha && typeof grecaptcha !== 'undefined' && grecaptcha.reset) grecaptcha.reset();
    });
  }

  /* ------------------------------------------------------------------
     15. Back to top
  ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     16. Lightbox for "Enlarge photo" links
  ------------------------------------------------------------------ */
  function initLightbox() {
    document.querySelectorAll('a[data-lightbox]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = '<img src="' + link.getAttribute('href') + '" alt="">' +
                       '<button class="lightbox-close" aria-label="Close">×</button>';
        document.body.appendChild(lb);
        document.body.classList.add('no-scroll');
        requestAnimationFrame(function () { lb.classList.add('open'); });
        function close() {
          lb.classList.remove('open');
          document.body.classList.remove('no-scroll');
          setTimeout(function () { lb.remove(); }, 300);
        }
        lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
        lb.querySelector('.lightbox-close').addEventListener('click', close);
      });
    });
  }

  /* ------------------------------------------------------------------
     16b. Image fallback — swap missing photos for the branded
          default listing image
   ------------------------------------------------------------------ */
  function initImageFallback() {
    var DEFAULT_IMG = (window.GS_SITE_ROOT || '.') + '/assets/images/default-listing.jpg';

    function useDefault(img) {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.classList.add('img-fallback');
      var card = img.closest('a, .inv-card, .project-card, .soc-card');
      if (card) {
        card.classList.add('no-photo');
        card.setAttribute('data-photo-state', 'default');
      }
      img.src = DEFAULT_IMG;
    }

    document.querySelectorAll('img').forEach(function (img) {
      if (img.closest('.mega-card, .mega-side, .search-overlay')) return; // nav decoration only
      if (img.complete && img.naturalWidth === 0) useDefault(img);
      img.addEventListener('error', function () { useDefault(img); });
    });

    // Re-check lazily-loaded images when they come near the viewport
    if ('IntersectionObserver' in window) {
      document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        var once = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              if (img.complete && img.naturalWidth === 0 && !img.dataset.fallbackApplied) useDefault(img);
              once.unobserve(en.target);
            }
          });
        }, { rootMargin: '200px' });
        once.observe(img);
      });
    }
  }

  /* ------------------------------------------------------------------
     16d. Society card "Download Map" buttons — [data-download-map]
          saves the referenced PDF (download attr fallback included)
   ------------------------------------------------------------------ */
  function initMapDownloads() {
    document.querySelectorAll('[data-download-map]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var href = btn.getAttribute('href');
        if (!href) return;
        var testA = document.createElement('a');
        if ('download' in testA) return; // native download attribute handles it
        // Legacy browsers: force download via XHR blob, or open as fallback
        e.preventDefault();
        var name = (href.split('/').pop() || 'society-map.pdf');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', href);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (xhr.status !== 200) { window.open(href, '_blank', 'noopener'); return; }
          var url = URL.createObjectURL(xhr.response);
          var a = document.createElement('a');
          a.href = url; a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        };
        xhr.onerror = function () { window.open(href, '_blank', 'noopener'); };
        xhr.send();
      });
    });
  }

  /* ------------------------------------------------------------------
     16c. Downloadable images — buttons with [data-download-img]
          save the referenced picture (incl. the default image)
   ------------------------------------------------------------------ */
  function initImageDownloads() {
    document.querySelectorAll('[data-download-img]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var src = btn.getAttribute('data-download-img');
        var name = btn.getAttribute('data-download-name') || 'gs-listing.jpg';
        var done = function () {
          var original = btn.innerHTML;
          btn.innerHTML = '✓ Downloaded';
          btn.classList.add('done');
          setTimeout(function () { btn.innerHTML = original; btn.classList.remove('done'); }, 2400);
        };
        fetch(src).then(function (r) {
          if (!r.ok) throw new Error('network');
          return r.blob();
        }).then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          done();
        }).catch(function () {
          // Final fallback: open in a new tab so the user can save manually
          var a = document.createElement('a');
          a.href = src; a.download = name; a.target = '_blank'; a.rel = 'noopener';
          document.body.appendChild(a); a.click(); a.remove();
          done();
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     17. Search overlay
  ------------------------------------------------------------------ */
  function initSearch() {
    var overlay = document.querySelector('[data-search-overlay]');
    var openBtns = document.querySelectorAll('[data-search-open]');
    if (!overlay || !openBtns.length) return;
    var input = overlay.querySelector('[data-search-input]');
    var results = overlay.querySelector('[data-search-results]');
    var suggest = overlay.querySelector('[data-search-suggest]');
    var form = overlay.querySelector('[data-search-form]');
    var items = (typeof GS_SEARCH_INDEX !== 'undefined') ? GS_SEARCH_INDEX : [];

    function open() {
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      setTimeout(function () { if (input) input.focus(); }, 120);
    }
    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (input) input.value = '';
      if (results) { results.innerHTML = ''; results.hidden = true; }
      if (suggest) suggest.style.display = '';
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', open); });
    var closeBtn = overlay.querySelector('[data-search-close]');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });

    function renderResults(q) {
      if (!results) return;
      var query = q.trim().toLowerCase();
      if (!query) { results.innerHTML = ''; results.hidden = true; if (suggest) suggest.style.display = ''; return; }
      if (suggest) suggest.style.display = 'none';
      var matches = items.filter(function (it) {
        var text = it.t.toLowerCase();
        return text.indexOf(query) !== -1 || query.indexOf(text.split(' ')[0]) !== -1;
      }).slice(0, 8);
      if (!matches.length) {
        var root = (typeof window.GS_SITE_ROOT !== 'undefined') ? window.GS_SITE_ROOT : '.';
        results.innerHTML = '<a href="' + root + '/pages/contact.html">Can\'t find what you\'re looking for? <small>Contact us →</small></a>';
        results.hidden = false;
        return;
      }
      results.innerHTML = matches.map(function (it) {
        return '<a href="' + it.p + '">' + it.t + '<small>' + it.c + '</small></a>';
      }).join('');
      results.hidden = false;
    }

    if (input) input.addEventListener('input', function () { renderResults(input.value); });
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); renderResults(input ? input.value : ''); });
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initNav();
    initHeroSlider();
    initReveal();
    initCounters();
    initSectorRows();
    initGroupCarousel();
    initTimeline();
    initProjectFilters();
    initCategoryFilter();
    initAccordions();
    initFaq();
    initModals();
    initContactForm();
    initFaqTabs();
    initCfForm();
    initNewsletter();
    initBackToTop();
    initLightbox();
    initSearch();
    initImageFallback();
    initImageDownloads();
    initMapDownloads();
  });
})();
/* ------------------------------------------------------------------
   18. Society cards → navigate to inventory on click/Enter
       (cards are divs so they can contain nested quick links)
------------------------------------------------------------------ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-inv-go]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; // nested links handle themselves
        window.location.href = card.dataset.invGo;
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.target.closest('a')) {
          window.location.href = card.dataset.invGo;
        }
      });
    });
  });
})();
