/* Patient Journey (effect only): a marker travels the dashed line and lights each step as it arrives. */
(function railJourney() {
  const line = document.querySelector(".journey-line");
  if (!line) return;
  const steps = [...line.querySelectorAll(".journey-step")];
  const desktop = window.matchMedia("(min-width:641px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const train = document.createElement("span");
  train.className = "rail-train";
  train.setAttribute("aria-hidden", "true");
  const moods = ["mood-1", "mood-2", "mood-3"];   // concerned -> neutral -> gentle smile; step 04 shows the big smiley
  train.innerHTML = '<img src="assets/brand/' + moods[0] + '.svg" alt="" width="26" height="26">';
  const face = train.querySelector("img");
  moods.forEach(m => { new Image().src = "assets/brand/" + m + ".svg"; });
  const setMood = i => { const f = "assets/brand/" + moods[Math.min(i, moods.length - 1)] + ".svg"; if (!face.src.endsWith(f)) face.src = f; };
  line.appendChild(train);

  // happy finish: once the marker reaches the last step it fades out and a smiley takes its place
  const smile = document.createElement("span");
  smile.className = "rail-smile";
  smile.setAttribute("aria-hidden", "true");
  smile.innerHTML = '<img src="assets/brand/smile.svg" alt="" width="40" height="40">';
  smile.innerHTML += '<i class="rs-heart rs-h1">&#10084;</i><i class="rs-heart rs-h2">&#10084;</i><i class="rs-heart rs-h3">&#10084;</i>';
  line.appendChild(smile);

  // one-off burst of hearts around a step badge
  const burst = badge => {
    if (!badge || !desktop.matches) return;
    const colors = ["#ff3d6e", "#ff6b93", "#ff8aa8"];
    for (let n = 0; n < 8; n++) {
      const h = document.createElement("i");
      const a = (n / 8) * Math.PI * 2 + Math.random() * .4, d = 38 + Math.random() * 26;
      h.className = "burst-heart";
      h.textContent = "❤";
      h.style.cssText = "--bx:" + Math.cos(a) * d + "px;--by:" + (Math.sin(a) * d - 14) + "px;color:" + colors[n % 3] +
        ";font-size:" + (12 + Math.random() * 10) + "px;animation-delay:" + n * 25 + "ms";
      badge.appendChild(h);
      setTimeout(() => h.remove(), 1300);
    }
  };

  // station positions as % of the line (centres of the 4 equal columns)
  const stops = steps.map((_, i) => ((i + .5) / steps.length) * 100);
  line.style.setProperty("--end", stops[stops.length - 1] + "%");
  const setX = pct => {
    line.style.setProperty("--x", pct + "%");
    line.style.setProperty("--prog", Math.max(0, pct - stops[0]) + "%");
    let reached = 0;
    steps.forEach((s, i) => {
      const on = pct >= stops[i] - .4;
      if (on && !s.classList.contains("is-arrived") && !reduce) burst(s.querySelector("b"));
      s.classList.toggle("is-arrived", on);
      if (on) reached = i;
    });
    setMood(reached);
  };

  if (reduce) { setX(stops[stops.length - 1]); line.classList.add("is-done"); return; }

  const MOVE = 1100, DWELL = 750, END_HOLD = 1600;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let idx = 0, from = stops[0], to = stops[0], t0 = 0, phase = "dwell", visible = false, wait = DWELL;
  setX(stops[0]);

  let last = performance.now();
  (function tick(now) {
    const dt = Math.min(now - last, 80); last = now;
    if (visible && desktop.matches) {
      t0 += dt;
      if (phase === "dwell" && t0 >= wait) {
        if (idx >= stops.length - 1) { line.classList.remove("is-done"); idx = 0; setX(stops[0]); phase = "dwell"; wait = DWELL; }
        else { from = stops[idx]; to = stops[idx + 1]; phase = "move"; }
        t0 = 0;
      } else if (phase === "move") {
        const k = Math.min(t0 / MOVE, 1);
        setX(from + (to - from) * ease(k));
        if (k >= 1) { idx++; phase = "dwell"; t0 = 0; wait = idx >= stops.length - 1 ? END_HOLD : DWELL; if (idx >= stops.length - 1) line.classList.add("is-done"); }
      } else if (phase === "back") {
        const k = Math.min(t0 / 700, 1);
        setX(from + (to - from) * ease(k));
        if (k >= 1) { phase = "dwell"; t0 = 0; wait = DWELL; }
      }
    }
    requestAnimationFrame(tick);
  })(last);

  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }), { threshold: .3 }).observe(line);
})();
