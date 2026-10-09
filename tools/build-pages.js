/* Generates the hair/skin/treatment/awards/gallery/blogs pages and syncs the
   shared header + footer into index.html and about.html.
   Run from the project root:  node tools/build-pages.js            */
const fs = require("fs");
const path = require("path");
const { hair, skin, blogs, gallery, awards, clinics, comingSoon } = require("./data");

const root = path.join(__dirname, "..");
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = t => `${t.slug}.html`;

/* ---------- shared pieces ---------- */
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/><path d="m9.5 9 1.8 1.8L15 7.5"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><path d="M12 20.5C6 16.5 3.5 13 3.5 9.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 3.5-2.5 7-8.5 11Z"/></symbol>
<symbol id="i-tech" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></symbol>
<symbol id="i-person" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/><path d="M9.5 17.5c1.5 1 3.5 1 5 0"/></symbol>
<symbol id="i-hair" viewBox="0 0 24 24"><path d="M5 20c1-6 1-11 2-15M10 20c0-6 0-11 1-16M15 20c0-5 1-10 3-14"/></symbol>
<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/></symbol>
<symbol id="i-cell" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="4.5" cy="8" r="2"/><circle cx="19.5" cy="8" r="2"/><circle cx="4.5" cy="16" r="2"/><circle cx="19.5" cy="16" r="2"/></symbol>
<symbol id="i-scalp" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 4v4.5M12 15.5V20M4 12h4.5M15.5 12H20"/></symbol>
<symbol id="i-face" viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 0-7 7c0 4 3 9 7 11 4-2 7-7 7-11a7 7 0 0 0-7-7Z"/><path d="M9 11h.01M15 11h.01M9.5 15.5c1.5 1 3.5 1 5 0"/></symbol>
<symbol id="i-spot" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9.5" r="1"/><circle cx="14.5" cy="8.5" r="1"/><circle cx="14" cy="14" r="1.2"/><circle cx="8.5" cy="14.5" r="1"/></symbol>
<symbol id="i-laser" viewBox="0 0 24 24"><path d="M3 21 14 10"/><path d="m14 10 3-3 3 3-3 3Z"/><path d="M5 5l1.5 1.5M9 3v2M3 9h2"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9.5h8M8 12.5h5"/></symbol>
<symbol id="i-support" viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
</defs></svg>`;

function navHtml(active, home = "index.html") {
  const on = k => (k === active ? ' class="active"' : "");
  const sub = list => list.map(t => `<a href="${link(t)}"${t.slug === active ? ' class="active"' : ""}>${t.title}</a>`).join("");
  return `<nav class="main-nav" aria-label="Main">
      <a href="${home}"${on("home")}>Home</a>
      <a href="about.html"${on("about")}>About</a>
      <div class="nav-item has-sub">
        <a href="hair-care.html"${on("hair")} aria-haspopup="true">Hair Care <small>&#9662;</small></a>
        <div class="sub"><a href="hair-care.html">All Hair Treatments</a>${sub(hair)}</div>
      </div>
      <div class="nav-item has-sub">
        <a href="skin-care.html"${on("skin")} aria-haspopup="true">Skin Care <small>&#9662;</small></a>
        <div class="sub"><a href="skin-care.html">All Skin Treatments</a>${sub(skin)}</div>
      </div>
      <a href="gallery.html"${on("gallery")}>Gallery</a>
      <a href="blogs.html"${on("blogs")}>Blogs</a>
      <a href="clinics.html"${on("clinics")}>Locations</a>
    </nav>`;
}

/* social links shown in the footer (from renewhairandskincare.com/contact-us). Edit here, then run node tools/build-pages.js */
const socials = [
  ["Facebook", "https://www.facebook.com/profile.php?id=100071560623843", '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13.5 21v-7.5H16l.5-3h-3V8.8c0-.9.3-1.5 1.6-1.5h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2H8v3h2.5V21h3Z"/></svg>'],
  ["Instagram", "https://www.instagram.com/renewplushairandskincare/", '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>'],
  ["WhatsApp", "https://wa.me/919080086365", '<svg viewBox="0 0 24 24"><path d="M3.5 20.5 5 16A8.5 8.5 0 1 1 8 19l-4.5 1.5Z"/><path d="M9.2 8.6c.2 2.4 2.8 5 5.2 5.2l1.2-1.2-1.9-.9-.8.7a4.4 4.4 0 0 1-2.1-2.1l.7-.8-.9-1.9-1.4 1Z" fill="currentColor" stroke="none"/></svg>']
];

const footer = `<footer class="footer">
  <div class="footer-grid">
    <div class="footer-contact"><a class="footer-logo" href="index.html" aria-label="Renew Plus home"><img src="assets/brand/logo-renew.png" alt="Renew Plus Hair and Skin Care logo"></a>
      <a class="fc-line" href="mailto:support@renewhairandskincare.com"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>support@renewhairandskincare.com</a>
      <a class="fc-line" href="tel:+919080086365"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>+91 90800 86365</a>
      <div class="footer-social" aria-label="Follow Renew Plus">${socials.map(([n, u, svg]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}" title="${n}">${svg}</a>`).join("")}</div>
    </div>
    <div><h4>Hair Treatments</h4>${hair.map(t => `<a href="${link(t)}">${t.title}</a>`).join("")}</div>
    <div><h4>Skin Treatments</h4>${skin.map(t => `<a href="${link(t)}">${t.title}</a>`).join("")}</div>
    <div><h4>Quick Links</h4><a href="about.html">About</a><a href="about.html#franchise">Franchise</a><a href="blogs.html">Blogs</a><a href="clinics.html">Clinics</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a><a href="gallery.html">Gallery</a></div>
  </div>
  <div class="footer-bottom">
    <div class="copyright">&copy; <span id="year"></span> Renew Plus Hair &amp; Skin Care. All rights reserved.</div>
    <div class="footer-tagline">Renew your hair. Renew your skin.</div>
    <div class="footer-credit">Developed and Managed by Zelora Infotech</div>
  </div>
</footer>`;

const header = active => `<header class="site-header" id="top">
  <div class="nav-wrap">
    <a class="brand" href="index.html" aria-label="Renew Plus home"><img src="assets/brand/logo-renew.png" alt="Renew Plus Hair and Skin Care logo"></a>
    <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    ${navHtml(active)}
    <a class="nav-phone" href="tel:+919080086365"><svg class="ico"><use href="#i-support"/></svg>+91 90800 86365</a>
    <a class="btn btn-primary nav-cta" href="index.html#contact">Contact <span>&rarr;</span></a>
  </div>
</header>`;

/* the booking popup lives in index.html; every generated page reuses it so "Book Consultation" opens the form in place */
const bookingDialog = () => (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/<dialog class="booking"[\s\S]*?<\/dialog>/) || [""])[0];
const withBooking = h => h.replace(/(?<!nav-cta" )href="index\.html#contact"/g, 'href="index.html#contact" data-book');
const themeOf = f => (f === "hair-care.html" || hair.some(t => link(t) === f)) ? "hair" : (f === "skin-care.html" || skin.some(t => link(t) === f)) ? "skin" : f.replace(".html", "");
function page({ file, title, desc, active, body, scripts = "", extraCss = "" }) {
  write(file, withBooking(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(desc)}">
  <title>${esc(title)} | Renew+ Hair &amp; Skin Care</title>
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="icon" href="favicon.ico?v=2" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png?v=2">
  <link rel="icon" type="image/png" sizes="192x192" href="assets/favicon/favicon-192.png?v=2">
  <link rel="apple-touch-icon" href="assets/favicon/favicon-180.png?v=2">
  <meta name="theme-color" content="#0a4a88">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/pages.css">
${extraCss}  <link rel="stylesheet" href="css/effects.css">
</head>
<body>
<div class="loader" id="loader" aria-hidden="true"><div class="loader-box"><img src="assets/brand/logo-3d.png" alt=""><span class="loader-ring"></span></div></div>
${sprite}
${header(active)}
<main class="page pg" data-theme="${themeOf(file)}">
${body}
</main>
${footer}
${bookingDialog()}
<script src="js/script.js"></script>
<script src="js/nav.js"></script>
<script src="js/fx.js"></script>
${scripts}</body>
</html>
`));
}

const banner = (eyebrow, h1, copy, crumbs, img) => `<section class="pg-hero">
  <div class="pg-hero-bg" style="background-image:url('${img}')" role="presentation"></div>
  <div class="inner">
    <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
    <p class="eyebrow">${eyebrow}</p>
    <h1>${h1}</h1>
    <p class="pg-hero-copy">${copy}</p>
  </div>
</section>`;

const ctaBand = (h = "Ready to start your renewal?", p = "Book a consultation and our specialists will build a plan around your hair, your skin and your goals.") => `<section class="pg-cta">
  <div class="inner pg-cta-inner reveal">
    <div><h2>${h}</h2><p>${p}</p></div>
    <div class="pg-cta-actions"><a class="btn btn-primary" href="index.html#contact">Book Consultation <span>&rarr;</span></a><a class="btn btn-light" href="tel:+919080086365">Call +91 90800 86365</a></div>
  </div>
</section>`;

/* ---------- treatment cards / listing pages ---------- */
const card = t => `<article class="tr-card reveal">
  <a class="tr-photo" href="${link(t)}" tabindex="-1" aria-hidden="true"><img src="${t.img}" alt="" loading="lazy"><span class="tr-tag">${t.kind}</span></a>
  <div class="tr-body">
    <i class="ico-wrap"><svg class="ico"><use href="#${t.icon}"/></svg></i>
    <h3><a href="${link(t)}">${t.title}</a></h3>
    <small>${t.short}</small>
    <p>${t.card}</p>
    <a class="text-link" href="${link(t)}">View treatment <span>&rarr;</span></a>
  </div>
</article>`;

function listing({ file, key, label, eyebrow, h1, copy, list, img, intro, introCopy, other }) {
  page({
    file, title: label, active: key, desc: copy,
    body: `${banner(eyebrow, h1, copy, `<a href="index.html">Home</a><span>/</span>${label}`, img)}
<section class="section pg-sec">
  <div class="inner">
    <div class="center-heading reveal"><p class="eyebrow">${intro}</p><h2 class="h-md">${introCopy[0]}</h2><p>${introCopy[1]}</p></div>
    <div class="tr-grid">${list.map(card).join("\n")}</div>
  </div>
</section>
<section class="section pg-alt">
  <div class="inner pg-split reveal">
    <div><p class="eyebrow">NOT SURE WHERE TO START?</p><h2 class="h-md">Every plan begins with an honest consultation</h2>
      <p>Our specialists examine your ${key === "hair" ? "scalp and hair density" : "skin type and concerns"} and recommend only what you actually need &mdash; including ${key === "hair" ? "non-surgical options before any surgery" : "the gentlest treatment that will work"}.</p>
      <p><a class="text-link" href="${other[0]}">${other[1]} <span>&rarr;</span></a></p></div>
    <ul class="pg-checks">
      <li><svg class="ico"><use href="#i-check"/></svg>Personalised treatment plans</li>
      <li><svg class="ico"><use href="#i-check"/></svg>Trained, experienced specialists</li>
      <li><svg class="ico"><use href="#i-check"/></svg>Advanced, safe technology</li>
      <li><svg class="ico"><use href="#i-check"/></svg>Clear pricing &mdash; no surprises</li>
    </ul>
  </div>
</section>
${ctaBand()}`
  });
}

listing({
  file: "hair-care.html", key: "hair", label: "Hair Care", eyebrow: "HAIR CARE & RESTORATION",
  h1: "Hair treatments, <em>for every stage</em> of hair loss",
  copy: "From non-surgical PRP and GFC to advanced FUE transplants for men and women.",
  list: hair, img: "assets/treatments/hair-transplant.jpg", intro: "OUR HAIR TREATMENTS",
  introCopy: ["Six ways to restore your hair", "Early thinning or advanced baldness &mdash; there is a treatment matched to your stage, your scalp and your goals."],
  other: ["skin-care.html", "Explore skin care treatments"]
});
listing({
  file: "skin-care.html", key: "skin", label: "Skin Care", eyebrow: "SKIN SOLUTIONS",
  h1: "Skin treatments for a <em>clearer, brighter</em> you",
  copy: "Hydrafacial, peels, laser and IV therapy &mdash; customised for every skin type.",
  list: skin, img: "assets/treatments/skin-rejuvenation.jpg", intro: "OUR SKIN TREATMENTS",
  introCopy: ["Five treatments, one goal: healthy skin", "Glow, clarity and even tone, with treatments that suit Indian skin and fit into your routine."],
  other: ["hair-care.html", "Explore hair care treatments"]
});

/* ---------- treatment detail pages ---------- */
function detail(t, group) {
  const gKey = group === hair ? "hair" : "skin";
  const gLabel = group === hair ? "Hair Care" : "Skin Care";
  const gFile = group === hair ? "hair-care.html" : "skin-care.html";
  const gi = group.indexOf(t);
  const steps = t.procedure.split(/(?<=[.!?])\s+/).filter(Boolean);
  const related = [1, 2, 3, 4].map(k => group[(gi + k) % group.length]);
  page({
    file: link(t), title: t.title, active: t.slug, desc: t.tagline,
    body: `<section class="pg-hero td-hero">
  <div class="td-hero-bg" style="background-image:url('${t.img}')" role="presentation"></div>
  <div class="inner td-hero-grid">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="${gFile}">${gLabel}</a><span>/</span>${t.title}</nav>
      <p class="eyebrow">${t.kind.toUpperCase()} &middot; ${t.short.toUpperCase()}</p>
      <h1>${t.title}</h1>
      <p class="pg-hero-copy">${t.tagline}</p>
      <div class="td-actions"><a class="btn btn-primary" href="index.html#contact">Book Consultation <span>&rarr;</span></a><a class="btn btn-light" href="tel:+919080086365">Call us</a></div>
    </div>
  </div>
</section>

<section class="td-facts"><div class="inner td-facts-grid">
  ${t.facts.map(f => `<div class="reveal"><small>${f[0]}</small><strong>${f[1]}</strong></div>`).join("\n  ")}
</div></section>

<section class="section pg-sec td-intro">
  <div class="inner td-intro-grid">
    <div class="reveal">
      <p class="eyebrow">OVERVIEW</p><h2 class="h-md">What is ${t.title.replace(/ Treatment$/, "")}?</h2>
      <p>${t.overview}</p>
      <p class="td-lead">${t.tagline}</p>
      <a class="btn btn-primary" href="index.html#contact">Book Consultation <span>&rarr;</span></a>
    </div>
    <figure class="td-photo reveal"><img src="${t.img}" alt="${esc(t.title)} at Renew Plus" loading="lazy"></figure>
  </div>
</section>

<section class="section pg-alt td-proc">
  <div class="inner">
    <div class="center-heading reveal"><p class="eyebrow">THE PROCEDURE</p><h2 class="h-md">How ${t.title.replace(/ Treatment$/, "")} works</h2></div>
    <ol class="td-steps">${steps.map((x, i) => `<li class="reveal"><b>${String(i + 1).padStart(2, "0")}</b><p>${x}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="section pg-sec">
  <div class="inner td-two">
    <div class="reveal td-box">
      <p class="eyebrow">WHO IS IT FOR</p><h2 class="h-md">Suitable candidates</h2><p>${t.candidates}</p>
      <p class="td-note">Results vary from person to person. Your specialist will confirm the right plan after examining you.</p>
    </div>
    <div class="reveal td-box">
      <p class="eyebrow">WHY CHOOSE IT</p><h2 class="h-md">Key benefits</h2>
      <ul class="td-benefits td-benefits--list">${t.benefits.map(b => `<li><i class="ico-wrap"><svg class="ico"><use href="#i-check"/></svg></i><span>${b}</span></li>`).join("")}</ul>
    </div>
  </div>
</section>

<section class="section pg-alt td-compare">
  <div class="inner">
    <div class="center-heading reveal"><p class="eyebrow">COMPARE OPTIONS</p><h2 class="h-md">${gLabel} treatments at a glance</h2><p>See how ${t.title.replace(/ Treatment$/, "")} fits alongside our other options.</p></div>
    <div class="td-table-wrap reveal"><table class="td-table">
      <thead><tr><th>Treatment</th><th>Type</th><th>Focus</th><th></th></tr></thead>
      <tbody>${group.map(g => `<tr${g === t ? ' class="is-current"' : ""}><td><strong>${g.title}</strong></td><td>${g.kind}</td><td>${g.short}</td><td>${g === t ? "You are here" : `<a class="text-link" href="${link(g)}">View <span>&rarr;</span></a>`}</td></tr>`).join("")}</tbody>
    </table></div>
  </div>
</section>

<section class="section pg-sec">
  <div class="inner td-faq-wrap">
    <div class="center-heading reveal"><p class="eyebrow">QUESTIONS</p><h2 class="h-md">Frequently asked</h2></div>
    <div class="faq reveal">${t.faqs.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}</div>
  </div>
</section>

<section class="section pg-alt">
  <div class="inner">
    <div class="center-heading reveal"><p class="eyebrow">MORE ${gLabel.toUpperCase()}</p><h2 class="h-md">Related treatments</h2></div>
    <div class="tr-grid tr-grid--sm">${related.map(card).join("\n")}</div>
  </div>
</section>
${ctaBand()}`
  });
}
hair.forEach(t => detail(t, hair));
skin.forEach(t => detail(t, skin));

/* ---------- awards (full list page; the About page shows the first few) ---------- */
const awardCard = a => `<article class="aw-item reveal"><figure><img src="${a.img}" alt="${esc(a.name)}" loading="lazy"></figure><div><h3>${esc(a.name)}</h3><span>${esc(a.year)}</span></div></article>`;
page({
  file: "awards.html", title: "Awards", active: "about", extraCss: `  <link rel="stylesheet" href="css/about.css">
`,
  desc: "Award-winning excellence in hair restoration and aesthetic care at Renew Plus.",
  body: `${banner("ABOUT &middot; AWARDS", "Award-winning <em>excellence</em>", "Recognition for hair restoration and aesthetic care, built on results patients can see.", `<a href="index.html">Home</a><span>/</span><a href="about.html">About</a><span>/</span>Awards`, "assets/clinics/clinic-chennai.jpg")}
<section class="ab-stats">
  <div class="inner ab-stats-grid aw-stats">
    <div class="reveal"><i class="ico-wrap"><svg class="ico"><use href="#i-award"/></svg></i><strong data-count="10" data-suffix="+">10+</strong><span>Awards Won</span></div>
    <div class="reveal"><i class="ico-wrap"><svg class="ico"><use href="#i-users"/></svg></i><strong data-count="1000" data-suffix="+">1,000+</strong><span>Satisfied Clients</span></div>
    <div class="reveal"><i class="ico-wrap"><svg class="ico"><use href="#i-sparkle"/></svg></i><strong data-count="98" data-suffix="%">98%</strong><span>Client Review Rating</span></div>
    <div class="reveal"><i class="ico-wrap"><svg class="ico"><use href="#i-hair"/></svg></i><strong>90&ndash;95%</strong><span>Graft Survival Rate</span></div>
  </div>
</section>
<section class="section pg-sec">
  <div class="inner">
    <div class="center-heading reveal"><p class="eyebrow">ALL AWARDS</p><h2 class="h-md">Our awards &amp; recognition</h2></div>
    <div class="aw-grid aw-grid--4">${awards.map(awardCard).join("\n")}</div>
  </div>
</section>
${ctaBand("Experience award-winning care", "Meet our specialists and see why thousands of patients trust Renew Plus.")}`
});

/* ---------- clinics / locations ---------- */
const mapUrl = c => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Renew Plus Hair and Skin Care, " + c.address)}`;
const states = ["All", ...new Set(clinics.map(c => c.state))];
const locCard = (c, i) => `<article class="lc-card" id="${c.slug}" data-slug="${c.slug}" data-state="${esc(c.state)}" data-text="${esc((c.name + " " + c.area + " " + c.state + " " + c.address).toLowerCase())}"${i >= 6 ? " data-extra" : ""}>
        <div class="lc-photo${c.img ? "" : " lc-photo--icon"}">${c.img ? `<img src="${c.img}" alt="Renew Plus clinic in ${c.name}" loading="lazy">` : `<img src="assets/cities/${c.slug}.png" alt="${c.name}" loading="lazy">`}${i === 0 ? `<span class="lc-tag"><svg class="ico"><use href="#i-pin"/></svg>Popular</span>` : ""}</div>
        <div class="lc-body">
          <h3><button type="button" class="lc-focus" data-focus="${c.slug}">${c.name}</button></h3>
          <p class="lc-area"><svg class="ico"><use href="#i-pin"/></svg>${c.area}, ${c.name}</p>
          <p class="lc-addr">${c.address}</p>
          <p class="lc-open"><b>Open Today</b><span>9:00 AM &ndash; 8:00 PM</span></p>
        </div>
        <div class="lc-actions">
          <a class="lc-ic lc-ic--dir" href="${mapUrl(c)}" target="_blank" rel="noopener" aria-label="Get directions to ${c.name}" title="Get directions"><svg viewBox="0 0 24 24"><path d="m3 11 18-8-8 18-2-8Z"/></svg></a>
          <a class="lc-ic lc-ic--call" href="tel:+919080086365" aria-label="Call Renew Plus ${c.name}" title="Call"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg></a>
        </div>
      </article>`;
const mapData = JSON.stringify([...clinics.map(c => ({ slug: c.slug, name: c.name, lat: c.lat, lng: c.lng, soon: false, left: ["tiruvallur", "coimbatore", "trichy"].includes(c.slug) })), ...comingSoon.map(c => ({ slug: c.slug, name: c.name, lat: c.lat, lng: c.lng, soon: true }))]);
page({
  file: "clinics.html", title: "Locations", active: "clinics", extraCss: `  <link rel="stylesheet" href="css/leaflet.css">
  <link rel="stylesheet" href="css/locations.css">
`,
  desc: "Find a Renew Plus Hair & Skin Care clinic near you – addresses, directions and map for all our locations.",
  body: `<section class="lc-hero">
  <div class="lc-hero-bg" role="presentation"></div>
  <div class="lc-hero-in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Locations</nav>
    <p class="eyebrow">OUR CLINIC LOCATIONS</p>
    <h1>Expert Care, <em>Closer to You</em></h1>
    <p class="lc-hero-copy">Find a Renew+ clinic near you and experience advanced hair &amp; skin treatments with our expert specialists.</p>
    <ul class="lc-feats"><li><i><svg class="ico"><use href="#i-pin"/></svg></i>Modern Clinics</li><li><i><svg class="ico"><use href="#i-users"/></svg></i>Expert Specialists</li><li><i><svg class="ico"><use href="#i-check"/></svg></i>Trusted Across Tamil Nadu &amp; Neighbouring States</li></ul>
  </div>
  <p class="lc-badge" aria-hidden="true">Same Expertise<br>More Locations</p>
  <div class="lc-stats">
    <div><i><svg class="ico"><use href="#i-pin"/></svg></i><b data-count="${clinics.length}">${clinics.length}</b><span>Locations</span></div>
    <div><i><svg class="ico"><use href="#i-award"/></svg></i><b data-count="${new Set(clinics.map(c => c.state)).size}">${new Set(clinics.map(c => c.state)).size}</b><span>States</span></div>
    <div><i><svg class="ico"><use href="#i-users"/></svg></i><b data-count="1000" data-suffix="+">1,000+</b><span>Happy Clients</span></div>
    <div><i><svg class="ico"><use href="#i-tech"/></svg></i><b>Advanced</b><span>Technology</span></div>
  </div>
</section>

<section class="lc-wrap">
  <div class="lc-bar">
    <label class="lc-search"><svg class="ico"><use href="#i-pin"/></svg><input type="search" id="lcSearch" placeholder="Search by city, area or PIN code" aria-label="Search locations" autocomplete="off"></label>
    <button type="button" class="lc-reset" id="lcReset" aria-label="Reset filters" title="Reset filters">&#8635;</button>
    <div class="lc-pills" role="tablist" aria-label="Filter by state">
      ${states.map((c, i) => `<button type="button" role="tab" class="lc-pill${i === 0 ? " is-active" : ""}" data-filter="${esc(c)}" aria-selected="${i === 0}">${c} (${c === "All" ? clinics.length : clinics.filter(x => x.state === c).length})</button>`).join("\n      ")}
    </div>
    <div class="lc-view" role="group" aria-label="View"><button type="button" class="is-active" data-view="list">List View</button><button type="button" data-view="map">Map View</button></div>
  </div>

  <div class="lc-main" id="lcMain">
    <div class="lc-list">
      <p class="lc-count" id="lcCount" aria-live="polite"></p>
      <div class="lc-cards" id="lcCards">
      ${clinics.map(locCard).join("\n      ")}
      </div>
      <p class="lc-empty" id="lcEmpty" hidden>No locations match your search. Try another city, area or PIN code.</p>
      <div class="lc-more"><button type="button" class="btn btn-light" id="lcMore">View All ${clinics.length} Locations <span>&rarr;</span></button></div>
    </div>
    <div class="lc-side">
      <div class="lc-map-card">
        <div class="lc-map-title"><h2>Our Locations</h2><p>${clinics.length} clinics across Tamil Nadu, Puducherry and Bengaluru.</p></div>
        <div id="lcMap" class="lc-map" role="region" aria-label="Map of Renew Plus clinics"></div>
        <div class="lc-soon"><svg class="ico"><use href="#i-sparkle"/></svg><div><b>Expanding for You</b><span>More locations coming soon!</span></div></div>
      </div>
      <div class="lc-help">
        <div class="lc-help-text"><p class="eyebrow">NEED HELP CHOOSING?</p><h3>Talk to our team</h3><p>We&rsquo;ll help you find the nearest clinic and choose the right location for you.</p></div>
        <a class="btn btn-primary" href="index.html#contact">Book Consultation <span>&rarr;</span></a>
      </div>
    </div>
  </div>
  <p class="cl-contact">Call <a href="tel:+919080086365">+91 90800 86365</a> or <a href="tel:+919150606660">+91 91506 06660</a>, or write to <a href="mailto:support@renewhairandskincare.com">support@renewhairandskincare.com</a>.</p>
</section>
<script>window.RENEW_LOCATIONS = ${mapData};</script>`,
  scripts: `<script src="js/vendor/leaflet.js"></script>\n<script src="js/clinics.js"></script>\n`
});

/* ---------- gallery ---------- */
const cats = ["All", ...new Set(gallery.map(g => g.cat))];
page({
  file: "gallery.html", title: "Gallery", active: "gallery",
  desc: "Real results and clinical examples from Renew Plus – hair transplant, PRP, GFC, skin and laser treatments.",
  body: `${banner("RESULTS &amp; CLINICAL EXAMPLES", "Our <em>gallery</em>", "Real results and the advanced technology behind them. Choose a category to filter.", `<a href="index.html">Home</a><span>/</span>Gallery`, "assets/results/result-hair.jpg")}
<section class="section pg-sec">
  <div class="inner">
    <div class="gl-filters" role="tablist" aria-label="Filter gallery by treatment">
      ${cats.map((c, i) => `<button type="button" role="tab" class="gl-btn${i === 0 ? " is-active" : ""}" data-filter="${esc(c)}" aria-selected="${i === 0}">${c}</button>`).join("\n      ")}
    </div>
    <p class="gl-count" id="glCount" aria-live="polite"></p>
    <div class="gl-grid" id="glGrid">
      ${gallery.map(g => `<figure class="gl-item" data-cat="${esc(g.cat)}"><button type="button" class="gl-open" aria-label="View ${esc(g.title)}"><img src="${g.img}" alt="${esc(g.title)}" loading="lazy"></button><figcaption><strong>${g.title}</strong><span>${g.cat} &middot; ${g.note}</span></figcaption></figure>`).join("\n      ")}
    </div>
  </div>
</section>
<dialog class="lightbox" id="lightbox" aria-label="Image viewer">
  <button type="button" class="lb-close" aria-label="Close">&times;</button>
  <button type="button" class="lb-nav lb-prev" aria-label="Previous">&lsaquo;</button>
  <figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
  <button type="button" class="lb-nav lb-next" aria-label="Next">&rsaquo;</button>
</dialog>
${ctaBand("Want results like these?", "Book a consultation to see what is possible for you.")}`,
  scripts: `<script src="js/gallery.js"></script>\n`
});

/* ---------- blogs ---------- */
const blogCats = [
  { name: "Hair Care", slug: "hair-care", theme: "blue", lead: "Hair loss, regrowth and restoration: expert answers before you start treatment." },
  { name: "Skin Care", slug: "skin-care", theme: "blue", lead: "Acne, pigmentation and skin rejuvenation: what works and what to expect." }
];
const blogPost = (p, i) => `<article class="bp reveal">
        <figure class="bp-media">
          <span class="bp-deco bp-deco-a"></span><span class="bp-deco bp-deco-b"></span>
          <a class="bp-img" href="${p.url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" loading="lazy"><span class="tr-tag">${p.cat}</span></a>
        </figure>
        <div class="bp-copy">
          <div class="bp-banner">
            <span class="bp-kicker">${p.cat}</span>
            <h3 class="bp-title"><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a></h3>
          </div>
          <p>${p.desc}</p>
          <a class="btn btn-primary bp-btn" href="${p.url}" target="_blank" rel="noopener">Read article <span>&rarr;</span></a>
        </div>
      </article>`;
page({
  file: "blogs.html", title: "Blogs", active: "blogs",
  desc: "Hair and skin care advice from the Renew Plus specialists.",
  scripts: `<script src="js/blogs.js"></script>\n`,
  body: `${banner("THE RENEW PLUS JOURNAL", "Hair &amp; skin care <em>blogs</em>", "Expert advice on hair loss, skin concerns and the treatments that help.", `<a href="index.html">Home</a><span>/</span>Blogs`, "assets/treatments/prp.jpg")}
<section class="section pg-sec bl-page">
  <div class="inner">
    <div class="gl-filters bl-filters" role="tablist" aria-label="Filter blogs by category">
      <button type="button" role="tab" class="gl-btn is-active" data-filter="All" aria-selected="true">All (${blogs.length})</button>
      ${blogCats.map(c => `<button type="button" role="tab" class="gl-btn" data-filter="${c.name}" data-slug="${c.slug}" aria-selected="false">${c.name} (${blogs.filter(p => p.cat === c.name).length})</button>`).join("\n      ")}
    </div>
    ${blogCats.map(c => `<section class="bl-cat" id="${c.slug}" data-cat="${c.name}" data-theme="${c.theme}">
      <header class="bl-cat-head reveal">
        <p class="eyebrow">CATEGORY</p>
        <h2 class="h-md">${c.name}</h2>
        <p class="section-lead">${c.lead}</p>
        <span class="bl-count">${blogs.filter(p => p.cat === c.name).length} articles</span>
      </header>
      <div class="bp-list">
      ${blogs.filter(p => p.cat === c.name).map(blogPost).join("\n      ")}
      </div>
    </section>`).join("\n    ")}
  </div>
</section>
${ctaBand()}`
});

/* ---------- sync header/footer into the existing pages ---------- */
function sync(file, active) {
  const p = path.join(root, file);
  let h = fs.readFileSync(p, "utf8");
  h = h.replace(/<nav class="main-nav"[^>]*>[\s\S]*?<\/nav>/, navHtml(active, active === "home" ? "#top" : "index.html"));
  h = h.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footer);
  if (!h.includes("css/nav.css") && !h.includes("pages.css")) h = h.replace('<link rel="stylesheet" href="css/style.css">', '<link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/pages.css">');
  if (active === "about") {
    const sec = `<!-- awards:start -->
  <section class="section ab-awards" id="awards">
    <div class="inner">
      <div class="aw-head reveal"><div><p class="eyebrow">RECOGNITION</p><h2 class="h-md">Awards &amp; Achievements</h2></div>
        <a class="btn btn-primary" href="awards.html">View All Awards <span>&rarr;</span></a></div>
      <div class="aw-grid aw-grid--4">${awards.slice(0, 4).map(awardCard).join("\n")}</div>
    </div>
  </section>
  <!-- awards:end -->`;
    h = /<!-- awards:start -->/.test(h)
      ? h.replace(/<!-- awards:start -->[\s\S]*?<!-- awards:end -->/, sec)
      : h.replace("<!-- Partner CTA -->", sec + "\n\n  <!-- Partner CTA -->");
  }
  if (!h.includes("effects.css")) h = h.replace("</head>", '  <link rel="stylesheet" href="css/effects.css">\n</head>');
  if (!h.includes("js/nav.js")) h = h.replace('<script src="js/script.js"></script>', '<script src="js/script.js"></script>\n<script src="js/nav.js"></script>');
  fs.writeFileSync(p, h);
}
sync("index.html", "home");
sync("about.html", "about");
console.log("Built", hair.length + skin.length, "treatment pages + listings, awards, gallery, blogs.");
