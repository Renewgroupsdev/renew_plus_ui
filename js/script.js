const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Page loader ---------- */
(function pageLoader() {
  const root = document.documentElement;
  const loader = document.getElementById("loader");
  if (!loader) return;
  root.classList.add("is-loading");       // holds the entrance animations until the loader has gone
  const started = performance.now();
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    const wait = Math.max(0, 700 - (performance.now() - started));   // show the loader for at least 0.7s
    setTimeout(() => {
      loader.classList.add("is-done");
      root.classList.remove("is-loading");
      setTimeout(() => loader.remove(), 700);
    }, wait);
  }
  if (document.readyState === "complete") finish(); else window.addEventListener("load", finish);
  setTimeout(finish, 6000);               // never block the page if an image is slow
  window.addEventListener("pageshow", e => { if (e.persisted) finish(); });
})();

/* ---------- Menu state (drawer behaviour lives in nav.js) ---------- */
const nav = document.querySelector(".main-nav");

/* ---------- Scroll reveal (cards stagger by position in their row) ---------- */
document.querySelectorAll(".reveal").forEach(el => {
  const idx = [...el.parentElement.children].indexOf(el);
  el.style.setProperty("--i", idx % 4);
});
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Trust strip counters ---------- */
const counters = document.querySelectorAll("[data-count]");
function formatCount(n) { return n.toLocaleString("en-US"); }
function runCounter(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = formatCount(target) + suffix; return; }
  const dur = 1600, start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = formatCount(Math.round(target * eased)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { runCounter(entry.target); counterObserver.unobserve(entry.target); }
  });
}, { threshold: .6 });
counters.forEach(el => counterObserver.observe(el));

/* ---------- Hero slider ---------- */
(function heroSlider() {
  const hero = document.querySelector(".hero");
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hc-dots button")];
  if (!hero || slides.length < 2) return;
  let index = 0, timer = null;
  const DELAY = 6500;

  function go(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === index;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
      s.toggleAttribute("inert", !on);
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }
  function stop() { clearInterval(timer); timer = null; }
  function play() {
    if (reduceMotion || document.hidden) return;
    stop();
    timer = setInterval(() => go(index + 1), DELAY);
  }
  function manual(n) { go(n); play(); }

  document.querySelector("[data-hero-prev]")?.addEventListener("click", () => manual(index - 1));
  document.querySelector("[data-hero-next]")?.addEventListener("click", () => manual(index + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => manual(i)));

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", play);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", play);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));

  // Swipe / drag the slide to change it (touch and mouse). Horizontal gestures only; vertical scrolling is untouched.
  const track = hero.querySelector(".hero-slides");
  let sx = 0, sy = 0, dragging = false, moved = false, pid = null;
  hero.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType === "mouse" && e.target.closest("button, input, select, textarea, .hero-controls")) return;
    sx = e.clientX; sy = e.clientY; dragging = true; moved = false; pid = e.pointerId;
  });
  window.addEventListener("pointermove", e => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) { moved = true; track.classList.add("is-dragging"); stop(); }
    if (moved) track.style.setProperty("--drag", dx * .35 + "px");
  });
  function endDrag(e) {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    const dx = e.clientX - sx;
    track.classList.remove("is-dragging");
    track.style.setProperty("--drag", "0px");
    if (moved) {
      if (Math.abs(dx) > 45) manual(index + (dx < 0 ? 1 : -1)); else play();
      // swallow the click that follows a drag so it does not open a link / zoom an image
      const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); };
      window.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", swallow, true), 0);
    }
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  hero.addEventListener("dragstart", e => e.preventDefault());

  // The zoom viewer pauses autoplay while it is open.
  document.addEventListener("zoom-open", stop);
  document.addEventListener("zoom-close", play);

  go(0);
  play();
})();

/* ---------- Testimonial slider (manual only — no autoplay) ---------- */
(function testimonialSlider() {
  const track = document.getElementById("tTrack");
  const prev = document.getElementById("tPrev");
  const next = document.getElementById("tNext");
  const dotsBox = document.getElementById("dots");
  if (!track) return;
  const cards = [...track.children];

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = () => cards[0].getBoundingClientRect().width + gap();
  const perView = () => Math.max(1, Math.round((track.clientWidth + gap()) / step()));
  const pages = () => Math.max(1, cards.length - perView() + 1);

  function buildDots() {
    dotsBox.innerHTML = "";
    for (let i = 0; i < pages(); i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      b.addEventListener("click", () => track.scrollTo({ left: i * step() }));
      dotsBox.appendChild(b);
    }
    update();
  }
  function update() {
    const max = track.scrollWidth - track.clientWidth;
    const i = Math.min(pages() - 1, Math.round(track.scrollLeft / step()));
    [...dotsBox.children].forEach((d, n) => d.classList.toggle("active", n === i));
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }
  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step() }); }
    if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step() }); }
  });
  window.addEventListener("resize", buildDots);
  buildDots();
})();

/* ---------- Booking popup ---------- */
(function bookingModal() {
  // Set this to your form endpoint (e.g. Formspree, Getform, or your own API) to receive submissions.
  const BOOKING_ENDPOINT = "";

  const modal = document.getElementById("bookingModal");
  const form = document.getElementById("bookingForm");
  const success = document.getElementById("bkSuccess");
  const errorBox = document.getElementById("bkError");
  const dateInput = document.getElementById("bkDate");
  if (!modal || !form) return;

  function openModal() {
    form.hidden = false;
    success.hidden = true;
    errorBox.hidden = true;
    form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = iso;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => form.elements.name.focus(), 60);
  }
  function closeModal() {
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
    document.documentElement.style.overflow = "";
  }

  document.querySelectorAll("[data-book]").forEach(btn => btn.addEventListener("click", e => {
    e.preventDefault();
    nav?.classList.remove("open");
    openModal();
  }));
  modal.querySelectorAll("[data-close-booking]").forEach(btn => btn.addEventListener("click", closeModal));
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", () => { document.documentElement.style.overflow = ""; });

  function validate() {
    let ok = true;
    form.querySelectorAll("[required]").forEach(input => {
      const valid = input.type === "checkbox" ? input.checked : input.checkValidity() && input.value.trim() !== "";
      const holder = input.closest(".bk-field, .bk-check");
      holder?.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    const email = form.elements.email;
    if (email.value && !email.checkValidity()) {
      email.closest(".bk-field").classList.add("invalid");
      ok = false;
    }
    return ok;
  }
  form.addEventListener("input", e => e.target.closest(".invalid")?.classList.remove("invalid"));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorBox.hidden = true;
    if (!validate()) {
      errorBox.textContent = "Please complete the highlighted fields.";
      errorBox.hidden = false;
      form.querySelector(".invalid input, .invalid select")?.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const submit = form.querySelector(".bk-submit");
    const label = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = "Sending...";
    try {
      if (BOOKING_ENDPOINT) {
        const res = await fetch(BOOKING_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        console.info("Booking request (no endpoint configured):", data);
      }
      document.getElementById("bkName").textContent = data.name ? ", " + data.name.trim().split(/\s+/)[0] : "";
      form.hidden = true;
      success.hidden = false;
      form.reset();
    } catch (err) {
      errorBox.textContent = "Sorry, we could not send your request. Please try again or call +91 90800 86365.";
      errorBox.hidden = false;
    } finally {
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });
})();

/* ---------- Footer year + smooth anchors ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.hasAttribute("data-book") || link.hasAttribute("data-partner")) return;
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

/* ---------- Results filter (Hair / Skin) ---------- */
(function resultFilter() {
  const grid = document.getElementById("resultGrid");
  if (!grid) return;
  const tabs = [...document.querySelectorAll(".result-filters [data-filter]")];
  const cards = [...grid.querySelectorAll(".result-card")];
  const moreTitle = document.getElementById("moreTitle");
  const moreCard = grid.querySelector(".result-more");
  const labels = { hair: "More hair transformations", skin: "More skin transformations" };

  function apply(cat) {
    tabs.forEach(t => {
      const on = t.dataset.filter === cat;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    let i = 0;
    cards.forEach(card => {
      const show = card.dataset.cat === cat;
      card.hidden = !show;
      card.classList.remove("pop");
      if (show) {
        card.classList.add("show");          // skip the scroll-reveal for cards revealed by the filter
        card.style.setProperty("--i", i++);
        void card.offsetWidth;               // restart the entrance animation
        card.classList.add("pop");
      }
    });
    if (moreTitle) moreTitle.textContent = labels[cat];
    if (moreCard) moreCard.dataset.cat = cat;
  }
  tabs.forEach(t => t.addEventListener("click", () => apply(t.dataset.filter)));
  apply("hair");
})();

/* ---------- Image zoom viewer (hero slides with several images) ---------- */
(function zoomViewer() {
  const box = document.getElementById("zoomBox");
  if (!box) return;
  const img = document.getElementById("zbImg");
  const cap = document.getElementById("zbCap");
  let group = [], current = 0;

  function show(i) {
    current = (i + group.length) % group.length;
    const shot = group[current];
    const src = shot.querySelector("img");
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = shot.querySelector("figcaption")?.textContent || src.alt;
    // do not blow small crops up far beyond their real size
    const natural = src.naturalWidth || 600;
    img.style.maxWidth = Math.min(window.innerWidth * .92, natural * 2.4) + "px";
    img.classList.remove("zb-in"); void img.offsetWidth; img.classList.add("zb-in");
    const many = group.length > 1;
    box.querySelector(".zb-prev").hidden = !many;
    box.querySelector(".zb-next").hidden = !many;
  }
  function open(shot) {
    group = [...shot.closest(".hero-slide").querySelectorAll(".shot")];
    show(group.indexOf(shot));
    box.showModal();
    document.dispatchEvent(new Event("zoom-open"));
  }
  document.querySelectorAll(".hero-slide .shot").forEach(shot => {
    shot.setAttribute("tabindex", "0");
    shot.setAttribute("role", "button");
    shot.setAttribute("aria-label", "Zoom image: " + (shot.querySelector("figcaption")?.textContent || shot.querySelector("img").alt));
    shot.addEventListener("click", () => open(shot));
    shot.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(shot); } });
  });
  box.querySelector(".zb-close").addEventListener("click", () => box.close());
  box.querySelector(".zb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".zb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", e => { if (!e.target.closest("img, figcaption, .zb-nav, .zb-close")) box.close(); });
  box.addEventListener("close", () => document.dispatchEvent(new Event("zoom-close")));
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  let tx = null;
  box.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50 && group.length > 1) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();

/* ---------- Back to top ---------- */
(function backToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<svg class="to-top-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/></svg><svg class="to-top-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(btn);
  const ring = btn.querySelector("circle");
  const C = 2 * Math.PI * 21;
  ring.style.strokeDasharray = C;
  let ticking = false;
  function update() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle("is-visible", y > 420);
    ring.style.strokeDashoffset = C * (1 - (max > 0 ? Math.min(y / max, 1) : 0));
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  update();
})();

/* ---------- Drifting leaf particles + hero mouse parallax ---------- */
(function leafParticles() {
  if (reduceMotion) return;
  document.querySelectorAll(".leaf-fx").forEach(box => {
    const hero = box.classList.contains("leaf-fx-hero");
    const base = +box.dataset.leaves || 10;
    const count = window.innerWidth <= 640 ? Math.ceil(base / 2) : base;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const setHeight = () => box.style.setProperty("--h", box.clientHeight + "px");
    setHeight();
    new ResizeObserver(setHeight).observe(box);
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("span");
      const t = hero ? rnd(6, 11) : rnd(8, 15);            // seconds for one fall: short = fast
      leaf.className = "leafp lf-" + "abc"[i % 3];
      leaf.style.cssText = [
        "--x:" + rnd(0, 96).toFixed(1) + "%",
        "--s:" + rnd(hero ? 10 : 12, hero ? 20 : 28).toFixed(1) + "px",
        "--t:" + t.toFixed(1) + "s",
        "--dl:-" + rnd(0, t).toFixed(1) + "s",              // negative delay: already mid-air on load
        "--sw:" + rnd(18, 50).toFixed(0) + "px",
        "--r0:" + rnd(-40, 40).toFixed(0) + "deg",
        "--o:" + rnd(.35, .8).toFixed(2)
      ].join(";");
      box.appendChild(leaf);
    }
    // keep the animation idle while the section is off-screen
    new IntersectionObserver(es => es.forEach(e => box.classList.toggle("is-paused", !e.isIntersecting))).observe(box);
  });

  const hero = document.querySelector(".hero");
  if (hero && !window.matchMedia("(hover: none)").matches) {
    let raf = 0;
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { hero.style.setProperty("--mx", x.toFixed(3)); hero.style.setProperty("--my", y.toFixed(3)); });
    });
    hero.addEventListener("mouseleave", () => { hero.style.setProperty("--mx", 0); hero.style.setProperty("--my", 0); });
  }
})();
