# GS Builder & Engineers — Corporate Website

A complete multi-page static website built with **pure HTML, CSS & JavaScript** (no frameworks, no build tools, no WordPress).

**Established 2006 · Head Office: Office # 112, Park View Plaza, D-17/2, MVHS, Islamabad, Pakistan**

## Project Structure

```
gs_builder/
│
├── index.html                        # Homepage (hero video slider, counters, services, sectors, projects, FAQs)
│
├── pages/                            # All inner pages
│   ├── about.html                    # Our Story (core values, partners marquee, timeline since 2006)
│   ├── sectors.html                  # 11 sectors with sticky side navigation
│   ├── faqs.html                     # 18 FAQs accordion
│   ├── services.html                 # Services overview hub (links to every category page)
│   ├── service-constructor.html      # Constructor — Commercial & Residential (FAQs)
│   ├── service-consultancy.html      # Construction Consultancy (FAQs)
│   ├── service-renovation.html       # Renovation & Remodeling (FAQs)
│   ├── service-design.html           # Structural & Architectural Design (FAQs)
│   ├── service-soil-testing.html     # Soil Testing — Geotechnical (FAQs)
│   ├── service-smart-home.html       # Smart Home Automation (FAQs)
│   ├── real-estate.html              # Real Estate — 8 societies, real photos, society map PDFs + map scope viewer
│   ├── inventory.html                # Property Inventory — plots, shops & apartments (search + filters, data in assets/js/inventory-data.js)
│   ├── contact.html                  # Contact (creative split form + reCAPTCHA + map card + FAQ tabs)
│   ├── privacy.html                  # Privacy policy
│   ├── cookies.html                  # Cookie policy
│   └── terms.html                    # Terms of use
│
├── tools/                            # Maintenance scripts (video re-encode, SEO injection, link check)
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
│   ├── maps/                         # ★ High-res society map PDFs (GS Builder & Real Estate branded) + WebP renders
│   └── images/
│       ├── logo.webp                  # GS Builder & Engineers company logo
│       ├── favicon.png                # favicon (PNG for widest browser support)
│       ├── default-listing.webp       # ★ Branded fallback image for missing listing photos
│       ├── cinematic/                # Cinematic construction photography (CTA/vision/design imagery)
│       ├── city/                     # Skyline, banner & Islamabad city imagery
│       ├── contact/                  # Contact page imagery
│       ├── csr/                      # CSR program imagery
│       ├── clients/                  # Partner university logos
│       ├── expertise/                # Expertise section imagery
│       ├── group/                    # Division photos
│       ├── history/                  # Timeline & international archive imagery
│       ├── leadership/               # Leader portraits
│       ├── news/                     # News & events thumbnails (branded placeholders)
│       ├── projects/                 # Project hero images (real GS project photos)
│       ├── services/                 # Service category & society imagery (real photos)
│       └── sectors/                  # Sector hero images
```

The project's content factsheet (company stats, societies, contact details) lives in
`docs/data.docs`.

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

## Manual Deployment (Vercel CLI)

The site ships as plain static files — deploy any time with:

```bash
bash deploy.sh
```

The script runs pre-flight checks (required files + every internal link resolved),
then runs `vercel deploy --prod --yes`. First-time setup only:

```bash
npm i -g vercel
vercel login        # once; links this folder to your project
```

If the live URL ever changes, update it in **one place** (it is the `BASE` constant
at the top of `tools/seo_inject.py`; the canonical/OG tags already rendered in the
HTML and `robots.txt`/`sitemap.xml` need a find-and-replace of
`gsbuilder-swart.vercel.app`).

After each deploy, quick SEO checks:
- Google Rich Results Test → paste the URL (validates FAQ/Organization JSON-LD)
- Facebook Sharing Debugger → paste the URL (validates OG image + titles)
- <https://gsbuilder-swart.vercel.app/sitemap.xml> must list the site's current pages (regenerate: see `tools/seo_inject.py` + sitemap script)

## Design System

| Token         | Value     | Usage                          |
|---------------|-----------|--------------------------------|
| `--eccDark`   | `#031427` | Dark navy sections, footer, hero overlay |
| `--eccBlue`   | `#1a3453` | Button text on yellow pills, secondary dark |
| `--eccAccent` | `#ffaa00` | GS yellow — button backgrounds, icons, highlights |
| `--gold`      | `#ffbc7d` | Accents on dark sections       |
| Font          | Helvetica Now Display Pro (300–800) | Headings & body |

**Button standard:** every call-to-action uses the pill shape (`border-radius: 999px`)
with a yellow background (`--eccAccent`) and navy-blue text (`--eccBlue`) — solid
(`.fill`), outlined (`.outline`), and on-dark (`.btn-white` / `.btn-on-dark`) variants
all resolve to it.

## Features

- **Company map PDFs** — official master-plan map for each society with the GS Builder & Real Estate branding (logo + contact info) on the map; every map downloads via the society card "Download Map" button
- **"Map Scope" viewer** — magnifying-glass map viewer on the Real Estate page. Browsers can't magnify a PDF's layers, so every map PDF has a high-resolution WebP twin (`tools/maps_to_webp.py` renders scans at their native DPI — e.g. 11765×7969 for Faisal Hills — and vector plans at up to 400 DPI) that the "View Map" button opens full-screen; a circular scope lens follows the pointer and samples the same image at 1.5–6×, edge-clamped and capped at the image's native pixels so plot numbers stay crisp. Zoom via buttons, scroll wheel or +/− keys; touch drag works on phones. The viewer lazy-loads one WebP only when opened (`assets/js/map-scope.js`)
- **"Download Map"** (accent button, saves the society's master-plan PDF) + **"Inventory"** link on every society card — the link opens the inventory page pre-filtered to that society (`inventory.html?society=…`)
- **Property Inventory page** — searchable, filterable listings of plots, shops and apartments for sale and rent, shown as **compact cards (4-up grid, tight type)**. **All listing data lives in one separate file: `assets/js/inventory-data.js`** (never touch the page to add or update a listing — edit the data file and the page, filters, counts, price labels and WhatsApp enquiry links all rebuild automatically). Free-text search matches every space-separated term across title, society, block, reference id and description ("5 marla plot", "shop for rent", "GS-105" all work); filters cover type chips, society, purpose (sale/rent), purpose-aware price bands (Lac/Crore for sale, thousands for rent), unit-aware size bands (Marla for plots/shops, sqft for apartments/shops) and sorting (featured, newest, price ↑/↓, largest). Each listing may carry **up to 3 optional photos** (`images: [ ... ]` in the data file) — the card shows the first photo with small dot switchers; missing photos fall back to the branded placeholder. Every filter state is written into the URL, so any filtered view is shareable/bookmarkable, and cards expose a prefilled **Enquire** WhatsApp button + **Call** button (`assets/js/inventory.js`)
- **Society cards show only the society name + actions** (no hover overlay text — works on desktop & touch devices identically); D-17 MVHS is written out in full as "Margalla View Housing Scheme"; **Master Plans strip removed** (downloads happen from the cards)
- **Contact page map card** — office map image + "Get Directions" pill + "Call First" link
- **Real photography** — society streets, listings and projects use real site imagery; any missing photo automatically falls back to a branded "Photo coming soon" placeholder with a one-click **Download Image** button
- **Navbar "Services" mega-menu card** on hover (all 7 categories + featured society maps + CTA)
- **Dedicated pages per service category**, each with unique content, imagery, animations and FAQs
- **Real Estate page** with 8 society cards (name + "Download Map" / "Inventory" actions), a gold **"Browse Inventory"** button in the hero, and a premium gradient **"Browse Inventory" CTA banner** below the societies grid — its live line ("19 properties are listed right now — 8 plots, 5 shops and 6 apartments, including 4 for rent.") is filled from `assets/js/inventory-data.js` at runtime, so it always matches the inventory page, plus quick-filter chips (Plots / Shops / Apartments / For Rent)
- **Custom WhatsApp number option — set it once, it applies everywhere.** Site-wide numbers live in `GS_SITE` at the top of `assets/js/includes.js`:
  ```js
  window.GS_SITE = Object.assign({
    whatsapp: '923453707530',   // ← change your WhatsApp number here (digits, no '+')
    phone: '+923453707530'     // ← number used by every tel: link
  }, window.GS_SITE || {});
  ```
  Every WhatsApp link — header nav, footer, floating WhatsApp button, CTA bands on all pages, the inventory empty state — and every `tel:` link is synced to these numbers at runtime (`?text=` prefills are preserved), so changing the number is a one-line edit. Individual inventory listings may also carry their own `whatsapp` / `phone` fields in `assets/js/inventory-data.js` (e.g. a dedicated agent's number) — they fall back to the site-wide numbers when omitted.
- **Homepage sectors tiles** on hover the tile widens to double width and reveals the sector photo edge-to-edge (touch devices show images natively)
- **Creative contact form** — floating labels, name/email/message, Google reCAPTCHA, social links (Facebook & Instagram)
- **FAQ tabs on contact page** — 5 construction + 5 real-estate questions
- **Topbar hides on mobile**; header gets a solid dark background so the (larger) hamburger is always visible
- **Full-screen overlay navigation** with desktop hover layout + mobile accordion
- **Hero video slider** with slide counter, arrows, autoplay, pause-on-hover — on portrait phones the video renders as the **complete, uncropped 16:9 frame** over a blurred self-backdrop (YouTube-style fullscreen look) with light mobile WebP posters swapped in automatically
- **Animated stat counters** (Established 2006 / Satisfied Customers / Completed Projects) — homepage only
- **Map PDF contact details rendered in white** — phone, email and badge text are clearly readable on the dark panels of every map PDF
- **About page** — animated **Project Completion 80%** & **Customer Satisfaction 85%** progress bars (count-up numbers + fill-on-scroll), Vision & Mission cards, high-resolution project imagery, partners marquee, timeline since 2006
- **FAQ accordion** (18 questions)
- **Newsletter subscribe** in footer
- **Scroll-reveal animations**, sticky header, back-to-top, image lightbox
- Fully **responsive** (1200px / 1024px / 768px / 640px / 480px / 420px / 360px breakpoints — verified overflow-free on 360 / 768 / 1366 widths)

## Notes

- **Hero videos were re-encoded 79.5 MB → ~28.5 MB total** (720p / CRF 24 / 30 fps / no audio track, `+faststart`; phones auto-download a 540p ~3 MB variant via `data-src-mobile` in `index.html` + `main.js`). To re-encode new sources, run `bash tools/video-optimize.sh "source.mp4" <slide-number>` (needs `npm i --no-save ffmpeg-static`). Images are already WebP-optimal (`python3 tools/image_recompress.py --check` reports savings).
- All content reflects **GS Builder & Engineers, Islamabad, Pakistan — established 2006**.
- Every raster image is served as **WebP** (`assets/images/**.webp`); the favicon stays PNG because some browsers (notably Safari) don't pick up WebP favicons.
- Society master-plan maps are served from `assets/maps/` as **high-resolution official society PDFs carrying the GS Builder & Real Estate branding (logo + office address + contact numbers) on the map** — that exact file is what visitors download — **plus high-res WebP renders of the same branded map for the Map Scope viewer**, so download and view always match. Each WebP renders at its PDF's native resolution (scans) or 400 DPI (vector plans) so the lens never magnifies soft pixels. After adding or replacing a map PDF, copy it in with its proper `<society>-map.pdf` name and regenerate the WebP with `python3 tools/maps_to_webp.py` (needs `poppler-utils`, `pikepdf` + Pillow; `--force` re-renders, or name a single map stem like `d-17-mvhs`).
- No external dependencies — no jQuery, no CDN, works offline (society map PDFs are the official master plans issued by each society).
- Contact form is client-side only, delivered through FormSubmit (`formsubmit.co/gs.builder2006@gmail.com`) so the in-page success message works without a backend.
- reCAPTCHA v2 is rendered explicitly on the contact page.

## reCAPTCHA Keys & Secrets

| Item | Value / location |
| --- | --- |
| Label | `GSBUILDERKEY` |
| Registered domain | `gsbuilder-swart.vercel.app` |
| Site key (public) | `window.GS_RECAPTCHA_SITEKEY` in `pages/contact.html` |
| Test key (localhost only) | Google's official public test key `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` |
| Secret key (PRIVATE) | **Never commit this file.** Store it only in the Vercel dashboard: Project → Settings → Environment Variables (e.g. name `RECAPTCHA_SECRET_KEY`). |

Rules to keep in mind:

- The **site key** is public by design — safe to commit.
- The **secret key** must never appear in this repository (it is public on GitHub) or in any client-side code.
- The current setup only gates submission **client-side** (the form cannot submit until the widget is solved). For real bot protection, verify the token server-side against the secret key — a small Vercel serverless function is the natural next step.