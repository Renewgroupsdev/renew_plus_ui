RENEW+ HAIR & SKIN CARE - WEBSITE TEMPLATE
==========================================
Open index.html directly in Chrome/Edge. No build step is needed to view the site.

PROJECT STRUCTURE
-----------------
index.html                     Home
about.html                     About (success story, founders, mission, vision, roadmap, awards)
awards.html                    All awards
clinics.html                   Renew Centres (all clinics, addresses, directions)
gallery.html                   Gallery with category filters
blogs.html                     Blog list
hair-care.html, skin-care.html Treatment listings
*-treatment.html, beard-transplant.html, female-hair-transplant.html
                               Individual treatment pages (6 hair + 5 skin)
favicon.ico

css/
  fonts.css                    Self-hosted @font-face rules (no Google Fonts request)
  style.css                    Base design, header, hero, home sections, footer
  pages.css                    Dropdown nav + inner pages (listings, treatments, gallery, blogs, clinics, awards)
  about.css                    About page sections
  effects.css                  Decorative patterns, leaves, shape and scroll effects

js/
  script.js                    Shared: mobile menu, reveal, counters, sliders, booking popup
  nav.js                       Drawer + dropdown menus
  fx.js                        Heading letter effects
  about.js                     Franchise popup + branch roadmap
  gallery.js, clinics.js       Filters (+ image viewer for the gallery)
  blogs.js                     Blog list behaviour

assets/
  fonts/                       DM Sans, Dancing Script, Libre Caslon Text (woff2, latin + latin-ext)
  brand/                       Logos
  favicon/                     Favicon PNG sizes (favicon.ico is in the project root)
  banners/                     Hero and page banner images
  treatments/                  Treatment photos (hair + skin)
  results/                     Before / after result images
  clinics/                     Clinic building photos
  avatars/                     Testimonial avatars
  team/                        Founder and co-founder portraits
  awards/                      Award images (replace award-placeholder.svg)
  leaves/                      Decorative leaf images
  reference/                   Original design-reference crops (not used by the site; safe to delete)

tools/
  data.js                      Content for treatments, blogs, gallery, awards and clinics
  build-pages.js               Regenerates the inner pages from data.js, and syncs the
                               shared header/footer into index.html and about.html

EDITING CONTENT
---------------
Treatments, blogs, gallery, awards and clinics live in tools/data.js. After editing run:
    node tools/build-pages.js
Do not hand-edit the generated pages (hair-care.html, skin-care.html, treatment pages,
awards.html, clinics.html, gallery.html, blogs.html) - the next build overwrites them.
index.html and about.html are edited directly.

BEFORE GOING LIVE
-----------------
- Replace the placeholder awards in tools/data.js (name, year, image in assets/awards/).
- Add photos for clinics that have none (set img in the clinics list in tools/data.js).
- Replace reference-based images with licensed original photography.
- Create privacy-policy.html and terms-and-conditions.html (linked from the footers).
- Check phone, email and addresses; hook the booking/franchise forms to a real endpoint.
