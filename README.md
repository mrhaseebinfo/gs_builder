# GS Builder & Engineers — Corporate Website

A complete multi-page static website built with **pure HTML, CSS & JavaScript** (no frameworks, no build tools, no WordPress).

**Established 2006 · Head Office: Office # 112, Park View Plaza, D-17/2, MVHS, Islamabad, Pakistan**

## Project Structure

```
gs_builder/
│
├── index.html                        # Homepage (hero video slider, counters, divisions carousel)
│
├── pages/                            # All inner pages
│   ├── about.html                    # Our Story (core values, partners marquee, timeline since 2006)
│   ├── leadership.html               # Leadership (leader cards + bio modals)
│   ├── group-companies.html          # The GS Family (specialised divisions)
│   ├── csr.html                      # Corporate Social Responsibility (4 pillars)
│   ├── expertise.html                # Expertise overview
│   ├── expertise-construction.html  # Construction (accordion tabs)
│   ├── expertise-design-build.html   # Design & Build
│   ├── expertise-value-engineering.html # Value Engineering
│   ├── excellence-innovation.html   # Excellence & Innovation (7 processes)
│   ├── projects.html                 # Full portfolio with live filters (status / scope / sector)
│   ├── project-showcase.html         # ★ NEW Projects Showcase (Construction / Commercial / Residential / Consultancy + International strip)
│   ├── sectors.html                  # 11 sectors with sticky side navigation
│   ├── news-events.html              # Company News & Upcoming Events
│   ├── faqs.html                     # 18 FAQs accordion
│   ├── services.html                 # Services overview hub (links to every category page)
│   ├── service-constructor.html      # Constructor — Commercial & Residential (FAQs)
│   ├── service-consultancy.html      # Construction Consultancy (FAQs)
│   ├── service-renovation.html       # Renovation & Remodeling (FAQs)
│   ├── service-design.html           # Structural & Architectural Design (FAQs)
│   ├── service-soil-testing.html     # Soil Testing — Geotechnical (FAQs)
│   ├── service-smart-home.html       # Smart Home Automation (FAQs)
│   ├── real-estate.html              # Real Estate — 8 societies, real photos, society map PDFs, premium inventory CTA
│   ├── inventory.html                # Live listings with real photos, "Download Image" per listing
│   ├── contact.html                  # Contact (creative split form + reCAPTCHA + map card + FAQ tabs)
│   ├── privacy.html                  # Privacy policy
│   ├── cookies.html                  # Cookie policy
│   └── terms.html                    # Terms of use
│
├── assets/
│   ├── css/
│   │   ├── fonts.css                 # @font-face declarations (self-hosted Helvetica Now Display)
│   │   └── main.css                  # Complete design system + all page styles
│   │
│   ├── js/
│   │   ├── includes.js               # Shared header / fullscreen nav / footer injection
│   │   └── main.js                   # All interactions (vanilla JS, modular IIFE)
│   │
│   ├── fonts/                        # Self-hosted webfonts (woff2 + woff)
│   ├── videos/                       # Homepage hero slider videos
│   ├── maps/                         # ★ Branded map PDFs (company location + 7 society maps)
│   └── images/
│       ├── logo.png                  # GS Builder & Engineers company logo
│       ├── default-listing.jpg       # ★ Branded fallback image for missing listing photos
│       ├── contact-map.jpg           # Office locater map (contact page)
│       ├── certs/                    # ISO certification badges
│       ├── clients/                  # Partner & society logos
│       ├── expertise/                # Expertise section imagery
│       ├── group/                    # Division photos & logos
│       ├── history/                  # Timeline & international archive imagery
│       ├── icons/                    # Sector & UI icons
│       ├── leadership/               # Leader portraits
│       ├── news/                     # News & events thumbnails
│       ├── projects/                 # Project hero images (real GS project photos)
│       ├── services/                 # Service category & society imagery (real photos)
│       ├── sectors/                  # Sector hero images
│       └── societies/                # Society gates, streets & aerial photography
```

## Running the Website

The site is 100% static — just open `index.html` in a browser. For the best experience (correct relative paths, autoplay videos), serve it with any static server:

# VS Code
Use the "Live Server" extension

## Notes

- All content reflects **GS Builder & Engineers, Islamabad, Pakistan — established 2006**.
- Society master-plan maps and the company location map are served from `assets/maps/` as branded PDFs (view in new tab or download).
- No external dependencies — no jQuery, no CDN, works offline (map PDFs use © OpenStreetMap data, attribution included).
- Contact form is client-side only; wire it to your backend or a service (e.g. Formspree) for live submissions. reCAPTCHA uses Google's test key for development — replace with your production key before launch.
