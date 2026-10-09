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

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# VS Code
Use the "Live Server" extension
```

Then visit `http://localhost:8000`.

## Design System

| Token         | Value     | Usage                          |
|---------------|-----------|--------------------------------|
| `--eccDark`   | `#031427` | Dark navy sections, footer, hero overlay |
| `--eccBlue`   | `#1a3453` | Secondary dark, careers band   |
| `--eccAccent` | `#ff0100` | GS red — buttons, icons, highlights |
| `--gold`      | `#ffbc7d` | Accents on dark sections       |
| Font          | Helvetica Now Display Pro (300–800) | Headings & body |

## Features

- **Company map PDFs** — branded location map for the head office + official master-plan map for each society; every map downloads via the society card "Download Map" button
- **"Download Map"** (accent button, saves the society's master-plan PDF) + **"Inventory"** link on every society card
- **Society cards show only the society name + actions** (no hover overlay text — works on desktop & touch devices identically); D-17 MVHS is written out in full as "Margalla View Housing Scheme"; **Master Plans strip removed** (downloads happen from the cards)
- **Contact page map card** — "View Location on Map" PDF + "Get Directions" link + downloadable map image
- **Real photography** — society gates, streets, listings and projects use real site imagery; any missing photo automatically falls back to a branded "Photo coming soon" placeholder with a one-click **Download Image** button
- **Projects Showcase page** — attractive, client-facing showcase covering Construction, Commercial, Residential and Consultancy streams + clearly-labelled International portfolio; linked from the footer "Projects" link
- **Navbar "Services" mega-menu card** on hover (all 7 categories + featured society maps + CTA)
- **Dedicated pages per service category**, each with unique content, imagery, animations and FAQs
- **Real Estate page** with 8 society cards (name + "Download Map" / "Inventory" actions) and a premium gradient "Browse Inventory" CTA banner
- **Homepage sectors flip-tiles** — 3D flip animation on hover (touch devices show images natively)
- **Creative contact form** — floating labels, name/email/message, Google reCAPTCHA, social links (Facebook & Instagram)
- **FAQ tabs on contact page** — 5 construction + 5 real-estate questions
- **Topbar hides on mobile**; header gets a solid dark background so the (larger) hamburger is always visible
- **Full-screen overlay navigation** with desktop hover layout + mobile accordion
- **Hero video slider** with slide counter, arrows, autoplay, pause-on-hover
- **Animated stat counters** (Established 2006 / Employees / Completed Projects)
- **Map PDF contact details rendered in white** — phone, email and badge text are clearly readable on the dark panels of every map PDF
- **Divisions carousel** (scroll-snap, arrow controls)
- **About page** — animated **Project Completion 80%** & **Customer Satisfaction 85%** progress bars (count-up numbers + fill-on-scroll), Vision & Mission cards, high-resolution project imagery, partners marquee, timeline since 2006
- **Projects page with live filters** (Status / Scope / Sector) + "See More" pagination
- **Leader bio modals** (click any director card)
- **FAQ accordion** (18 questions)
- **Newsletter subscribe** in footer
- **Scroll-reveal animations**, sticky header, back-to-top, image lightbox
- Fully **responsive** (1200px / 1024px / 768px / 640px / 480px / 420px / 360px breakpoints — verified overflow-free on 360 / 768 / 1366 widths)

## Notes

- All content reflects **GS Builder & Engineers, Islamabad, Pakistan — established 2006**.
- Society master-plan maps and the company location map are served from `assets/maps/` as branded PDFs (view in new tab or download).
- No external dependencies — no jQuery, no CDN, works offline (map PDFs use © OpenStreetMap data, attribution included).
- Contact form is client-side only; wire it to your backend or a service (e.g. Formspree) for live submissions. reCAPTCHA uses Google's test key for development — replace with your production key before launch.