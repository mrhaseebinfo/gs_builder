/* ==========================================================================
   GS Builder & Engineers - Page includes (header, nav, footer)
   Injects the shared header / fullscreen menu / footer into every page.
   Configure social links & nav via GS_SITE if needed.
   ========================================================================== */

(function () {
  'use strict';

  var ROOT = (document.currentScript && document.currentScript.dataset.root) || '.';

  function rel(p) { return ROOT + '/' + p; }

  /* ---------------------------------------------------------------- */
  var HEADER_HTML =
    '<header class="site-header">' +
    '<div class="container">' +
    '<a href="' + rel('index.html') + '" class="site-logo">' +
    '<img src="' + rel('assets/images/logo.png') + '" alt="GS Builder &amp; Engineers">' +
    '</a>' +
    '<div class="header-right">' +
    '<nav class="inline-nav" aria-label="Primary">' +
    '<a href="' + rel('index.html') + '">Home</a>' +
    '<a href="' + rel('pages/about.html') + '">About</a>' +
    '<span class="nav-mega-wrap">' +
    '<a class="nav-mega-trigger" href="' + rel('pages/services.html') + '">Services <span class="caret"></span></a>' +
    '<div class="mega-card" role="menu" aria-label="Services menu">' +
    '<div class="mega-col">' +
    '<div class="mega-cat"><i></i>Construction &amp; Builders</div>' +
    '<div class="mega-links">' +
    '<a class="mega-link" href="' + rel('pages/service-constructor.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h1M14 10h1M9 14h1M14 14h1"/></svg><span>Constructor<small>Commercial &amp; Residential projects</small></span></a>' +
    '<a class="mega-link" href="' + rel('pages/service-consultancy.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 13-3.5M16 21l2-6 6 3-4 2-4 1z"/></svg><span>Consultancy<small>Expert guidance &amp; cost planning</small></span></a>' +
    '<a class="mega-link" href="' + rel('pages/service-renovation.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3l7 7-4 1-4 4-1 4-7-7 4-1 4-4 1-4zM5 15l-2 6 6-2"/></svg><span>Renovation<small>Remodeling &amp; upgrades</small></span></a>' +
    '<a class="mega-link" href="' + rel('pages/service-design.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20M4 21V8l8-5 8 5v13M4 8h16M9 21v-6h6v6"/></svg><span>Structural &amp; Architectural Design<small>Drawings, maps &amp; 3D elevations</small></span></a>' +
    '<a class="mega-link" href="' + rel('pages/service-soil-testing.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg><span>Soil Testing<small>Geotechnical investigation</small></span></a>' +
    '<a class="mega-link" href="' + rel('pages/service-smart-home.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15v-4M11 15V9M15 15v-2M19 15v-6"/></svg><span>Smart Home Automation<small>Control your home from anywhere</small></span></a>' +
    '</div>' +
    '</div>' +
    '<div class="mega-col">' +
    '<div class="mega-cat"><i></i>Real Estate</div>' +
    '<div class="mega-links">' +
    '<a class="mega-link" href="' + rel('pages/real-estate.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg><span>Real Estate Overview<small>Sale &amp; purchase &mdash; plots to shops</small></span></a>' +
    '</div>' +
    '<div class="mega-chips">' +
    '<a href="' + rel('pages/service-constructor.html') + '">Grey Structure</a>' +
    '<a href="' + rel('pages/service-constructor.html') + '">Turnkey</a>' +
    '<a href="' + rel('pages/inventory.html') + '">Plots &amp; Houses</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</span>' +
    '<a href="' + rel('pages/contact.html') + '">Contact</a>' +
    '</nav>' +
    '<button class="header-search-btn" data-search-open aria-label="Search">' +
    '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
    '</button>' +
    '<button id="nav-icon4" aria-label="Menu" role="button" tabindex="0"><span></span><span></span><span></span></button>' +
    '</div>' +
    '</div>' +
    '</header>' +

    '<div class="search-overlay" data-search-overlay>' +
    '<button class="search-close" data-search-close aria-label="Close search">&times;</button>' +
    '<div class="search-panel">' +
    '<form class="search-form" data-search-form>' +
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
    '<input type="text" data-search-input placeholder="Search services, inventory, sectors..." autocomplete="off">' +
    '</form>' +
    '<div class="search-suggest" data-search-suggest>' +
    '<div class="search-suggest-title">Popular Searches</div>' +
    '<div class="search-tags">' +
    '<a href="' + rel('pages/services.html') + '">Construction</a>' +
    '<a href="' + rel('pages/services.html#real-estate') + '">Real Estate</a>' +
    '<a href="' + rel('pages/services.html#construction') + '">Soil Testing</a>' +
    '<a href="' + rel('pages/inventory.html') + '">Plots &amp; Houses</a>' +
    '<a href="' + rel('pages/inventory.html') + '">Inventory</a>' +
    '<a href="' + rel('pages/contact.html') + '">Contact</a>' +
    '</div>' +
    '</div>' +
    '<div class="search-results" data-search-results hidden></div>' +
    '</div>' +
    '</div>';

  /* ---------------------------------------------------------------- */
  var NAV_HTML =
    '<nav class="full-screen-navmenu" aria-label="Main navigation">' +
    '<div class="fsnm-container">' +
    '<div class="fsnm-row">' +
    '<div class="fsnm-col">' +
    '<div class="fsnm-header"><a href="' + rel('pages/services.html') + '">Services</a></div>' +
    '<ul class="fsnm-list">' +
    '<li><a href="' + rel('pages/services.html') + '">Services Overview</a></li>' +
    '<li><a href="' + rel('pages/service-constructor.html') + '">Constructor (Commercial &amp; Residential)</a></li>' +
    '<li><a href="' + rel('pages/service-consultancy.html') + '">Consultancy</a></li>' +
    '<li><a href="' + rel('pages/service-renovation.html') + '">Renovation</a></li>' +
    '<li><a href="' + rel('pages/service-design.html') + '">Structural &amp; Architectural Design</a></li>' +
    '<li><a href="' + rel('pages/service-soil-testing.html') + '">Soil Testing</a></li>' +
    '<li><a href="' + rel('pages/service-smart-home.html') + '">Smart Home Automation</a></li>' +
    '<li><a href="' + rel('pages/real-estate.html') + '">Real Estate &mdash; Societies</a></li>' +
    '<li><a href="' + rel('pages/project-showcase.html') + '">Projects Showcase</a></li>' +
    '<li><a href="' + rel('pages/inventory.html') + '">Inventory &mdash; Plots &amp; Houses</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="fsnm-col">' +
    '<div class="fsnm-header"><a href="' + rel('pages/about.html') + '">The Company</a></div>' +
    '<ul class="fsnm-list">' +
    '<li><a href="' + rel('pages/about.html') + '">About</a></li>' +
    '<li><a href="' + rel('pages/leadership.html') + '">Leadership</a></li>' +
    '<li><a href="' + rel('pages/group-companies.html') + '">The Group</a></li>' +
    '<li><a href="' + rel('pages/csr.html') + '">CSR</a></li>' +
    '<li><a href="' + rel('pages/news-events.html') + '">News &amp; Events</a></li>' +
    '<li><a href="' + rel('pages/faqs.html') + '">FAQs</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="fsnm-col">' +
    '<div class="fsnm-header"><a href="' + rel('pages/expertise.html') + '">Expertise</a></div>' +
    '<ul class="fsnm-list">' +
    '<li><a href="' + rel('pages/expertise.html') + '">Expertise Overview</a></li>' +
    '<li><a href="' + rel('pages/expertise-construction.html') + '">Construction</a></li>' +
    '<li><a href="' + rel('pages/expertise-design-build.html') + '">Design &amp; Build</a></li>' +
    '<li><a href="' + rel('pages/expertise-value-engineering.html') + '">Value Engineering</a></li>' +
    '<li><a href="' + rel('pages/excellence-innovation.html') + '">Excellence &amp; Innovation</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="fsnm-col">' +
    '<div class="fsnm-header">Connect</div>' +
    '<ul class="fsnm-list">' +
    '<li><a href="' + rel('pages/contact.html') + '">Contact us</a></li>' +
    '<li><a href="https://wa.me/923453707530" target="_blank" rel="noopener">WhatsApp</a></li>' +
    '<li><a href="mailto:gs.builder2006@gmail.com">gs.builder2006@gmail.com</a></li>' +
    '<li><a href="https://www.linkedin.com/company/software-disruption" target="_blank" rel="noopener">LinkedIn</a></li>' +
    '<li><a href="https://www.facebook.com/gsbuilderengineers" target="_blank" rel="noopener">Facebook</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</nav>';

  /* ---------------------------------------------------------------- */
  var FOOTER_HTML =
    '<footer class="site-footer">' +
    '<div class="container">' +
    '<div class="footer-top">' +
    '<div class="footer-col footer-about">' +
    '<div class="footer-logo"><img src="' + rel('assets/images/logo.png') + '" alt="GS Builder &amp; Engineers"></div>' +
    '<p class="footer-desc">GS Builder &amp; Engineers — established in 2006 in Islamabad, Pakistan — is an independent construction and real estate company delivering quality construction, property development and trusted plot sale &amp; purchase services.</p>' +
    '<div class="footer-social">' +
    '<a href="https://www.facebook.com/engfaisalsarwer" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg></a>' +
    '<a href="https://www.instagram.com/gsbuilder2006" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32zm0 6.83a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34zm5.29-7.04a.97.97 0 1 0 0-1.94.97.97 0 0 0 0 1.94z"/></svg></a>' +
    '</div>' +
    '</div>' +
    '<div class="footer-col">' +
    '<h5>Company</h5>' +
    '<ul>' +
    '<li><a href="' + rel('pages/about.html') + '">About</a></li>' +
    '<li><a href="' + rel('pages/services.html') + '">Services</a></li>' +
    '<li><a href="' + rel('pages/project-showcase.html') + '">Projects</a></li>' +
    '<li><a href="' + rel('pages/inventory.html') + '">Inventory</a></li>' +
    '<li><a href="' + rel('pages/contact.html') + '">Contact</a></li>' +
    '<li><a href="https://wa.me/923453707530" target="_blank" rel="noopener">WhatsApp</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="footer-col">' +
    '<h5>Services</h5>' +
    '<ul>' +
    '<li><a href="' + rel('pages/service-constructor.html') + '">Constructor</a></li>' +
    '<li><a href="' + rel('pages/service-consultancy.html') + '">Consultancy</a></li>' +
    '<li><a href="' + rel('pages/service-renovation.html') + '">Renovation</a></li>' +
    '<li><a href="' + rel('pages/service-design.html') + '">Structural &amp; Architectural Design</a></li>' +
    '<li><a href="' + rel('pages/service-soil-testing.html') + '">Soil Testing</a></li>' +
    '<li><a href="' + rel('pages/service-smart-home.html') + '">Smart Home Automation</a></li>' +
    '<li><a href="' + rel('pages/real-estate.html') + '">Real Estate</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="footer-col">' +
    '<h5>Get in touch</h5>' +
    '<ul>' +
    '<li><a href="mailto:gs.builder2006@gmail.com">gs.builder2006@gmail.com</a></li>' +
    '<li><a href="tel:+923453707530">+92 345 3707530</a></li>' +
    '<li><a href="' + rel('pages/contact.html') + '">Office # 112, Park View Plaza, D-17/2 MVHS, Islamabad</a></li>' +
    '<li><a href="' + rel('pages/contact.html') + '" target="_blank" rel="noopener">View Location Map</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '<div class="footer-middle">' +
    '<h5 style="color:#fff;margin-bottom:0;">Subscribe to our Newsletter</h5>' +
    '<form class="newsletter-form"><input type="email" placeholder="Your email address" required aria-label="Email"><button type="submit">Send</button></form>' +
    '</div>' +
    '<div class="footer-bottom">' +
    '<div>GS Builder &amp; Engineers, Islamabad, Pakistan. All Rights Reserved. © 2026 — Established 2006.</div>' +
    '<div class="footer-legal-links"><a href="' + rel('pages/privacy.html') + '">Privacy</a><a href="' + rel('pages/cookies.html') + '">Cookies</a><a href="' + rel('pages/terms.html') + '">Terms of use</a></div>' +
    '</div>' +
    '</div>' +
    '</footer>' +
    '<a href="#" class="back-to-top" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>' +
    '<a class="whatsapp-float" data-tip="Chat with us on WhatsApp" href="https://wa.me/923453707530" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.02 3 3.32 8.7 3.32 15.72c0 2.24.59 4.42 1.7 6.34L3.2 29l7.13-1.87c1.85 1 3.94 1.54 6.07 1.54h.01c7.01 0 12.72-5.7 12.72-12.72C28.13 8.7 23.06 3 16.04 3zm0 23.33c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.03 1.06 1.08-3.93-.25-.4a10.55 10.55 0 0 1-1.62-5.63c0-5.85 4.76-10.61 10.62-10.61 2.83 0 5.49 1.1 7.49 3.11a10.55 10.55 0 0 1-1.5 16.62 10.6 10.6 0 0 1-6 1.49zm5.82-7.94c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.83.99-1.01 1.2-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.29c.16.21 2.21 3.55 5.51 4.83.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z"/></svg>' +
    '</a>';

  /* ---------------------------------------------------------------- */
  function inject() {
    var mount = document.querySelector('[data-include="header"]');
    if (mount) { mount.outerHTML = HEADER_HTML + NAV_HTML; }
    var fmount = document.querySelector('[data-include="footer"]');
    if (fmount) { fmount.outerHTML = FOOTER_HTML; }
    if (document.body) document.body.dataset.root = ROOT;
  }

  // Expose root so main.js search can resolve relative links
  window.GS_SITE_ROOT = ROOT;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();