/* ==========================================================================
   GS Builder & Engineers — Property Inventory (data file)
   --------------------------------------------------------------------------
   This is the ONLY file you edit to manage the inventory page. Add, remove
   or update a listing below and pages/inventory.html updates automatically
   (filters, search, counts, price labels and WhatsApp enquiries all read
   from here).

   Each listing supports these fields:

     id          unique reference shown to customers (e.g. 'GS-101')
     type        'plot' | 'shop' | 'apartment'
     purpose     'sale' | 'rent'
     society     one of: D-17 MVHS · D-18 ECHS · D-18 AWT · Wapda Town ·
                 B-17 Multi · Faisal Town · Faisal Hills · Mumtaz City
                 (must match exactly — filters and the society-card
                 "Inventory" buttons link with these names)
     block       block / sector / street (shown on the card)
     title       listing headline shown on the card
     area        numeric size (used by the size filter and sorting)
     unit        'marla' for plots & shops · 'sqft' for apartments/shops
     price       number, PKR — total price for sale listings,
                 monthly rent for rent listings (filters + sorting use it)
     beds        apartments: bedrooms (optional)
     baths       apartments: bathrooms (optional)
     floor       shop/apartment floor, e.g. 'Ground' (optional)
     status      'available' | 'reserved' | 'booked'
     featured    true = pinned first in the default (Featured) sort
     images      OPTIONAL array of 1–3 photos for the card. The first one
                 is shown; small dots let the visitor switch photos.
                 [] / missing = branded "Photo coming soon" placeholder.
                 Paths are relative to pages/, e.g.
                 '../assets/images/services/society-mvhs.webp'
     description one/two-line sales pitch shown under the title
     date        YYYY-MM-DD, used by the "Newest first" sort
     whatsapp    OPTIONAL custom WhatsApp number for this listing only
                 (digits, international format) — e.g. a dedicated
                 agent's number. Leave it out to use the site-wide
                 number configured in GS_SITE (assets/js/includes.js).
     phone       OPTIONAL custom tel: number for this listing only
                 (with '+'), same fallback rules as whatsapp.

   The SITE-WIDE WhatsApp number is set once in GS_SITE at the top of
   assets/js/includes.js and applies to every WhatsApp / phone link on
   every page — header, footer, floating button, CTA bands and all
   inventory enquiry buttons. Prices are displayed automatically from
   the number — sale prices as "PKR 52 Lac" / "PKR 1.35 Crore", rents
   as "PKR 55,000 / month" — so you never need to format them by hand.
   ========================================================================== */

window.GS_INVENTORY = {

  updated: '2026-10-22',

  listings: [

    /* ---------------------------- PLOTS ---------------------------- */

    {
      id: 'GS-101',
      type: 'plot',
      purpose: 'sale',
      society: 'D-17 MVHS',
      block: 'Block B, D-17/2',
      title: '5 Marla Residential Plot — Block B',
      area: 5,
      unit: 'marla',
      price: 5200000,
      status: 'available',
      featured: true,
      images: [
        '../assets/images/services/society-mvhs.webp',
      ],
      description: 'Level, possession-ready plot on a 40ft street — walking distance to the main park and market.',
      date: '2026-10-18'
    },
    {
      id: 'GS-102',
      type: 'plot',
      purpose: 'sale',
      society: 'D-17 MVHS',
      block: 'Block C, D-17/2',
      title: '8 Marla Corner Plot — Block C',
      area: 8,
      unit: 'marla',
      price: 8800000,
      status: 'reserved',
      featured: false,
      images: ['../assets/images/services/society-mvhs.webp'],
      description: 'South-facing corner with extra green belt on two sides. Utility connections paid up to date.',
      date: '2026-10-12'
    },
    {
      id: 'GS-103',
      type: 'plot',
      purpose: 'sale',
      society: 'D-18 ECHS',
      block: 'Block A',
      title: '5 Marla Plot near Main Boulevard',
      area: 5,
      unit: 'marla',
      price: 6500000,
      status: 'available',
      featured: true,
      images: ['../assets/images/services/society-echs.webp'],
      description: 'Quiet street plot two minutes from the main boulevard — ideal for a family home build.',
      date: '2026-10-15'
    },
    {
      id: 'GS-104',
      type: 'plot',
      purpose: 'sale',
      society: 'B-17 Multi',
      block: 'Block D, MPCHS',
      title: '10 Marla Plot — Block D',
      area: 10,
      unit: 'marla',
      price: 13500000,
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-b17.webp'],
      description: 'Developed block with active construction around — strong 3–5 year appreciation profile.',
      date: '2026-10-08'
    },
    {
      id: 'GS-105',
      type: 'plot',
      purpose: 'sale',
      society: 'Faisal Hills',
      block: 'Block E',
      title: '5 Marla Plot — Block E',
      area: 5,
      unit: 'marla',
      price: 4800000,
      status: 'available',
      featured: true,
      images: [
        '../assets/images/services/society-faisal-hills.webp',
      ],
      description: 'Best entry point in Faisal Hills right now — development work in full swing on the block.',
      date: '2026-10-19'
    },
    {
      id: 'GS-106',
      type: 'plot',
      purpose: 'sale',
      society: 'Faisal Town',
      block: 'Block B',
      title: '1 Kanal Plot — Block B',
      area: 20,
      unit: 'marla',
      price: 32000000,
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-faisal-town.webp'],
      description: 'Premium 1 kanal in a fully developed block — grand houses all around, immediate possession.',
      date: '2026-09-29'
    },
    {
      id: 'GS-107',
      type: 'plot',
      purpose: 'sale',
      society: 'Mumtaz City',
      block: 'Block C',
      title: '7 Marla Plot — Block C',
      area: 7,
      unit: 'marla',
      price: 6200000,
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-mumtaz-city.webp'],
      description: 'On-ground block near the sector park — clear file, ready for transfer any working day.',
      date: '2026-10-05'
    },
    {
      id: 'GS-108',
      type: 'plot',
      purpose: 'sale',
      society: 'Wapda Town',
      block: 'Block B, WECHS',
      title: '5 Marla Plot — Block B',
      area: 5,
      unit: 'marla',
      price: 5800000,
      status: 'booked',
      featured: false,
      images: ['../assets/images/services/society-wapda.webp'],
      description: 'Booked in its first week — similar plots in Block A & C available, ask us for current options.',
      date: '2026-09-22'
    },

    /* ---------------------------- SHOPS ---------------------------- */

    {
      id: 'GS-201',
      type: 'shop',
      purpose: 'sale',
      society: 'D-17 MVHS',
      block: 'Main Commercial Market',
      title: '6 Marla Commercial Shop Unit',
      area: 6,
      unit: 'marla',
      price: 24000000,
      status: 'available',
      featured: true,
      images: ['../assets/images/services/society-mvhs.webp'],
      description: 'Corner shop unit facing the main market road — high footfall area with ATM and bank nearby.',
      date: '2026-10-11'
    },
    {
      id: 'GS-202',
      type: 'shop',
      purpose: 'sale',
      society: 'Mumtaz City',
      block: 'Main Boulevard',
      title: '4 Marla Shop — Main Boulevard',
      area: 4,
      unit: 'marla',
      price: 18000000,
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-mumtaz-city.webp'],
      description: 'Brand-new commercial unit on the boulevard — ideal for a franchise, clinic or showroom.',
      date: '2026-10-02'
    },
    {
      id: 'GS-203',
      type: 'shop',
      purpose: 'sale',
      society: 'B-17 Multi',
      block: 'Sector Commercial, MPCHS',
      title: '8 Marla Commercial Plot for Shop',
      area: 8,
      unit: 'marla',
      price: 31000000,
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-b17.webp'],
      description: 'Corner commercial plot at the sector entrance — build-to-suit with our in-house design team.',
      date: '2026-09-26'
    },
    {
      id: 'GS-204',
      type: 'shop',
      purpose: 'rent',
      society: 'Faisal Town',
      block: 'Markaz, Block A',
      title: '250 sqft Shop for Rent — Markaz',
      area: 250,
      unit: 'sqft',
      price: 85000,
      floor: 'Ground',
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-faisal-town.webp'],
      description: 'Ground-floor shop in the busy markaz — shutter, mezzanine and washroom already in place.',
      date: '2026-10-14'
    },
    {
      id: 'GS-205',
      type: 'shop',
      purpose: 'rent',
      society: 'Wapda Town',
      block: 'Shopping Mall, WECHS',
      title: 'Shop for Rent — Shopping Mall',
      area: 220,
      unit: 'sqft',
      price: 60000,
      floor: 'First',
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-wapda.webp'],
      description: 'First-floor shop unit inside the main mall — steady footfall, parking in front, ready to move in.',
      date: '2026-09-30'
    },

    /* ------------------------- APARTMENTS ------------------------- */

    {
      id: 'GS-301',
      type: 'apartment',
      purpose: 'sale',
      society: 'D-18 ECHS',
      block: 'ECHS Town Apartments',
      title: '3 Bed Apartment — 1450 sqft',
      area: 1450,
      unit: 'sqft',
      price: 12500000,
      beds: 3,
      baths: 2,
      floor: '2nd',
      status: 'available',
      featured: true,
      images: [
        '../assets/images/services/society-echs.webp',
        '../assets/images/services/design-built-result.webp'
      ],
      description: 'Bright corner apartment with open kitchen, servant quarter and covered parking — immediate possession.',
      date: '2026-10-16'
    },
    {
      id: 'GS-302',
      type: 'apartment',
      purpose: 'sale',
      society: 'Mumtaz City',
      block: 'Tower A',
      title: '2 Bed Apartment — 1050 sqft',
      area: 1050,
      unit: 'sqft',
      price: 7200000,
      beds: 2,
      baths: 2,
      floor: '4th',
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-mumtaz-city.webp'],
      description: 'Lift, standby power and 24/7 security in the building — walking distance to the sector mosque.',
      date: '2026-10-06'
    },
    {
      id: 'GS-303',
      type: 'apartment',
      purpose: 'sale',
      society: 'Faisal Hills',
      block: 'Hills Residency',
      title: '2 Bed Apartment — 1100 sqft',
      area: 1100,
      unit: 'sqft',
      price: 6800000,
      beds: 2,
      baths: 2,
      floor: '3rd',
      status: 'available',
      featured: true,
      images: ['../assets/images/services/society-faisal-hills.webp'],
      description: 'Valley-view apartment at pre-launch pricing — installment plan available through our office.',
      date: '2026-10-20'
    },
    {
      id: 'GS-304',
      type: 'apartment',
      purpose: 'rent',
      society: 'D-17 MVHS',
      block: 'Park View Apartments',
      title: '3 Bed Apartment for Rent — 1400 sqft',
      area: 1400,
      unit: 'sqft',
      price: 55000,
      beds: 3,
      baths: 2,
      floor: '1st',
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-mvhs.webp'],
      description: 'Furnished-option family apartment with generator backup — 10+11 month agreement, verified tenants only.',
      date: '2026-10-13'
    },
    {
      id: 'GS-305',
      type: 'apartment',
      purpose: 'sale',
      society: 'Wapda Town',
      block: 'WECHS Apartments',
      title: '3 Bed Apartment — 1500 sqft',
      area: 1500,
      unit: 'sqft',
      price: 14500000,
      beds: 3,
      baths: 3,
      floor: 'Ground',
      status: 'booked',
      featured: false,
      images: ['../assets/images/services/society-wapda.webp'],
      description: 'Booked — join our waiting list and we will call you first when the next unit opens in this block.',
      date: '2026-09-25'
    },
    {
      id: 'GS-306',
      type: 'apartment',
      purpose: 'rent',
      society: 'D-18 AWT',
      block: 'AWT Apartments',
      title: '2 Bed Apartment for Rent — 1000 sqft',
      area: 1000,
      unit: 'sqft',
      price: 45000,
      beds: 2,
      baths: 1,
      floor: '2nd',
      status: 'available',
      featured: false,
      images: ['../assets/images/services/society-awt.webp'],
      description: 'Neat, freshly painted unit near the society gate — family or bachelors (subject to society rules).',
      date: '2026-10-09'
    }
  ]
};