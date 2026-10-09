/* ---------- Partner / franchise enquiry popup ---------- */
(function partnerModal() {
  // Set this to your form endpoint (e.g. Formspree, Getform, or your own API) to receive enquiries.
  const PARTNER_ENDPOINT = "";

  const modal = document.getElementById("partnerModal");
  const form = document.getElementById("partnerForm");
  const success = document.getElementById("partnerSuccess");
  const errorBox = document.getElementById("partnerError");
  if (!modal || !form) return;

  function openModal() {
    form.hidden = false;
    success.hidden = true;
    errorBox.hidden = true;
    form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => form.elements.name.focus(), 60);
  }
  function closeModal() {
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
    document.documentElement.style.overflow = "";
  }

  document.querySelectorAll("[data-partner]").forEach(btn => btn.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(".main-nav")?.classList.remove("open");
    openModal();
  }));
  modal.querySelectorAll("[data-close-partner]").forEach(btn => btn.addEventListener("click", closeModal));
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", () => { document.documentElement.style.overflow = ""; });

  function validate() {
    let ok = true;
    form.querySelectorAll("[required]").forEach(input => {
      const valid = input.type === "checkbox" ? input.checked : input.checkValidity() && input.value.trim() !== "";
      input.closest(".bk-field, .bk-check")?.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
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
      if (PARTNER_ENDPOINT) {
        const res = await fetch(PARTNER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ type: "franchise-enquiry", ...data })
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        console.info("Franchise enquiry (no endpoint configured):", data);
      }
      document.getElementById("partnerName").textContent = data.name ? ", " + data.name.trim().split(/\s+/)[0] : "";
      form.hidden = true;
      success.hidden = false;
      form.reset();
    } catch (err) {
      errorBox.textContent = "Sorry, we could not send your enquiry. Please try again or call +91 90800 86365.";
      errorBox.hidden = false;
    } finally {
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });
})();

/* ---------- Roadmap: manual arrows + auto-loop with logo rider ---------- */
(function roadmap() {
  const box = document.getElementById("rdScroll");
  if (!box) return;
  const path = document.getElementById("rdPath");
  const rider = box.querySelector(".rd-rider");
  const cols = [...box.querySelectorAll(".rd-col")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
<<<<<<< HEAD
  let pausedUntil = 0, hovering = false;
  const pause = ms => { pausedUntil = performance.now() + ms; };

=======
  let pausedUntil = 0, stopped = false;
  const pause = ms => { pausedUntil = performance.now() + ms; };

  /* pause / resume: a toggle button plus "roadmap:pause", "roadmap:resume" and "roadmap:toggle" events
     (dispatch them on #rdScroll or document); "roadmap:paused" / "roadmap:resumed" are fired when the state changes */
  const toggle = document.querySelector("[data-rd-toggle]");
  function setStopped(on) {
    if (on === stopped) return;
    stopped = on;
    box.classList.toggle("is-stopped", on);
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(on));
      toggle.setAttribute("aria-label", on ? "Resume roadmap animation" : "Pause roadmap animation");
      toggle.title = on ? "Resume" : "Pause";
    }
    box.dispatchEvent(new CustomEvent(on ? "roadmap:paused" : "roadmap:resumed", { bubbles: true }));
  }
  const onEvt = (name, fn) => { box.addEventListener(name, fn); document.addEventListener(name, fn); };
  onEvt("roadmap:pause", () => setStopped(true));
  onEvt("roadmap:resume", () => setStopped(false));
  onEvt("roadmap:toggle", () => setStopped(!stopped));
  toggle?.addEventListener("click", () => setStopped(!stopped));

>>>>>>> master
  document.querySelectorAll("[data-rd]").forEach(btn => btn.addEventListener("click", () => {
    pause(7000);
    box.scrollBy({ left: +btn.dataset.rd * Math.max(400, box.clientWidth * .7), behavior: "smooth" });
  }));
<<<<<<< HEAD
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach(ev => box.addEventListener(ev, () => pause(7000), { passive: true }));
  box.addEventListener("mouseenter", () => { hovering = true; });
  box.addEventListener("mouseleave", () => { hovering = false; pause(1200); });
=======
  ["keydown"].forEach(ev => box.addEventListener(ev, () => pause(7000), { passive: true }));
>>>>>>> master

  if (reduce || !path || !rider || !cols.length || getComputedStyle(rider).display === "none") return;

  // path length at each stop (x = column centre)
  const total = path.getTotalLength();
  const stopLen = cols.map(col => {
    const target = col.offsetLeft + col.offsetWidth / 2;
    let lo = 0, hi = total;
    for (let n = 0; n < 24; n++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < target) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  });
  const MOVE = 650, DWELL = 400;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const trackW = path.ownerSVGElement.clientWidth || total;

  let idx = -1, phase = "move", from = 0, to = stopLen[0], elapsed = 0, last = performance.now(), visible = false;

  function place(len) {
    const p = path.getPointAtLength(len);
<<<<<<< HEAD
    rider.style.transform = "translate(" + (p.x - 22) + "px," + (p.y - 22) + "px)";
    if (performance.now() > pausedUntil && !hovering) {
=======
    rider.style.transform = "translate(" + (p.x - 24) + "px," + (p.y - 24) + "px)";
    if (performance.now() > pausedUntil && !stopped) {
>>>>>>> master
      box.scrollLeft = Math.max(0, Math.min(p.x - box.clientWidth / 2, box.scrollWidth - box.clientWidth));
    }
  }
  function setActive(i) { cols.forEach((c, n) => c.classList.toggle("is-active", n === i)); }
  function restart() {
    setActive(-1);
    setTimeout(() => {
      box.scrollLeft = 0; idx = -1; phase = "move"; from = 0; to = stopLen[0]; elapsed = 0; place(0);
    }, 300);
    phase = "reset";
  }

  function tick(now) {
    const dt = Math.min(now - last, 80); last = now;
<<<<<<< HEAD
    if (visible && !hovering && now > pausedUntil && phase !== "reset") {
=======
    if (visible && !stopped && now > pausedUntil && phase !== "reset") {
>>>>>>> master
      elapsed += dt;
      if (phase === "move") {
        const t = Math.min(elapsed / MOVE, 1);
        place(from + (to - from) * ease(t));
        if (t >= 1) { idx++; phase = "dwell"; elapsed = 0; setActive(idx); }
      } else if (phase === "dwell" && elapsed >= DWELL) {
        setActive(-1);
        if (idx >= cols.length - 1) restart();
        else { from = stopLen[idx]; to = stopLen[idx + 1]; phase = "move"; elapsed = 0; }
      }
    }
    requestAnimationFrame(tick);
  }

  place(0);
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
<<<<<<< HEAD
  }), { threshold: .25 }).observe(box);
=======
  }), { threshold: 0 }).observe(box);
>>>>>>> master
  requestAnimationFrame(tick);
})();
