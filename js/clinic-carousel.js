/* Homepage clinics carousel: endless loop (cards cloned before/after), arrow buttons, autoplay (pauses on hover/focus/offscreen). */
(function clinicCarousel() {
  const root = document.querySelector(".clinic-carousel");
  if (!root) return;
  const track = root.querySelector(".clinic-track");
  const prev = root.querySelector(".cc-prev");
  const next = root.querySelector(".cc-next");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = [...track.querySelectorAll(".clinic-card")];
  if (!cards.length) return;

  // [clones][originals][clones] so scrolling can wrap in either direction
  const clone = c => { const k = c.cloneNode(true); k.setAttribute("aria-hidden", "true"); k.querySelectorAll("a").forEach(a => a.tabIndex = -1); return k; };
  cards.forEach(c => track.insertBefore(clone(c), cards[0]));
  cards.forEach(c => track.appendChild(clone(c)));

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = () => cards[0].getBoundingClientRect().width + gap();
  const setW = () => step() * cards.length;
  const behavior = () => (reduce ? "auto" : "smooth");
  const place = () => { track.style.scrollSnapType = "none"; track.scrollLeft = setW(); track.style.scrollSnapType = ""; };

  // keep the viewport inside the middle set; jumping by exactly one set is invisible
  let fixing = false;
  const wrap = () => {
    if (fixing) return;
    const w = setW(), x = track.scrollLeft;
    if (x < w * .5 || x >= w * 1.5) {
      fixing = true;
      track.style.scrollSnapType = "none";
      track.scrollLeft = x < w * .5 ? x + w : x - w;
      track.style.scrollSnapType = "";
      fixing = false;
    }
  };
  let timer;
  track.addEventListener("scroll", () => { clearTimeout(timer); timer = setTimeout(wrap, 120); }, { passive: true });
  window.addEventListener("resize", place);
  place();

  const go = dir => { wrap(); track.scrollBy({ left: dir * step(), behavior: behavior() }); };
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  if (reduce) return;
  let paused = false, visible = false;
  root.addEventListener("mouseenter", () => { paused = true; });
  root.addEventListener("mouseleave", () => { paused = false; });
  root.addEventListener("focusin", () => { paused = true; });
  root.addEventListener("focusout", () => { paused = false; });
  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }), { threshold: .3 }).observe(root);
  setInterval(() => { if (!paused && visible && !document.hidden) go(1); }, 3500);
})();
