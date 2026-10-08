/* Heading effects: per-letter "twist" entrance + hover wave, and a gradient painted across each heading.
   Letters are split into spans (headings keep an aria-label with the original text). */
(function headingFx() {
  const SELECTOR = [
    ".hero h1", ".h-lg", ".h-md", ".next-step h2",
    ".pg-hero h1", ".pg-cta h2", ".ab-hero h1", ".ab-partner h2", ".bk-main h2", ".bp-title"
  ].join(",");
  const headings = [...document.querySelectorAll(SELECTOR)];
  if (!headings.length) return;

  function split(h) {
    if (h.classList.contains("fx")) return;
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    let idx = 0;
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const word = document.createElement("span");
            word.className = "word";
            word.setAttribute("aria-hidden", "true");
            [...part].forEach(chr => {
              const c = document.createElement("span");
              c.className = "ch";
              c.textContent = chr;
              c.style.setProperty("--i", idx);
              c.style.setProperty("--r", idx % 2 ? "-6deg" : "6deg");
              idx++;
              word.appendChild(c);
            });
            frag.appendChild(word);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          walk(n);
        }
      });
    })(h);
    h.classList.add("fx");
  }

  // Paint one continuous gradient across the heading (or each hero line) by offsetting every letter's background.
  function paint(h) {
    h.querySelectorAll(".ch").forEach(c => {
      const box = c.closest(".line") || h;
      c.style.setProperty("--gw", box.offsetWidth + "px");
      // offsetLeft is relative to the nearest positioned ancestor: when that is the line/heading itself the offset is already box-relative
      c.style.setProperty("--gx", -(c.offsetParent === box ? c.offsetLeft : c.offsetLeft - box.offsetLeft) + "px");
    });
  }

  headings.forEach(split);
  const paintAll = () => headings.forEach(paint);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(paintAll);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(paintAll, 120); });

  // Headings inside the hero slider animate when their slide becomes active (CSS); the rest when scrolled into view.
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      paint(e.target);
      e.target.classList.add("fx-in");
      io.unobserve(e.target);
    });
  }, { threshold: .4 });
  headings.forEach(h => { if (!h.closest(".hero-slide")) io.observe(h); });

  // pause the glint animation on headings that are off-screen
  const idle = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("fx-off", !e.isIntersecting)));
  headings.forEach(h => idle.observe(h));
})();
