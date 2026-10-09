/* Dropdown menus: tap-to-open on mobile, Escape-to-close and keyboard support on desktop. */
(function () {
  /* Mobile drawer: burger on the left, slide-in menu, closes on outside click / Esc / link tap / navigation. */
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".main-nav");
  const wrap = document.querySelector(".nav-wrap");
  if (toggle && drawer && wrap) {
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    wrap.insertBefore(overlay, wrap.firstChild);
    const setOpen = open => {
      drawer.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) drawer.querySelectorAll(".has-sub.open").forEach(i => i.classList.remove("open"));
    };
    toggle.addEventListener("click", e => { e.stopPropagation(); setOpen(!drawer.classList.contains("open")); });
    overlay.addEventListener("click", () => setOpen(false));
    document.addEventListener("click", e => {
      if (drawer.classList.contains("open") && !e.target.closest(".main-nav, .menu-toggle")) setOpen(false);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
    // any real link inside the drawer closes it (same-page anchors and other pages); dropdown triggers keep it open
    drawer.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a) return;
      const isTrigger = a.parentElement.classList.contains("has-sub");
      if (isTrigger && !a.parentElement.classList.contains("open")) return;
      setOpen(false);
    }, true);   // capture phase: decide before the dropdown trigger handler marks the item open
    window.addEventListener("resize", () => { if (window.innerWidth > 640) setOpen(false); });
    window.addEventListener("pageshow", () => setOpen(false));   // coming back via the browser Back button
    window.addEventListener("pagehide", () => setOpen(false));
  }

  const mobile = () => window.matchMedia("(max-width:640px)").matches;
  const items = [...document.querySelectorAll(".main-nav .has-sub")];

  items.forEach(item => {
    const trigger = item.querySelector(":scope > a");
    trigger.addEventListener("click", e => {
      if (!mobile()) return;               // desktop: the link navigates, hover shows the menu
      if (!item.classList.contains("open")) {
        e.preventDefault();
        items.forEach(i => i.classList.remove("open"));
        item.classList.add("open");
      }                                    // second tap follows the link to the section page
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      items.forEach(i => i.classList.remove("open"));
      document.activeElement?.closest(".has-sub")?.querySelector(":scope > a")?.blur();
    }
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".has-sub")) items.forEach(i => i.classList.remove("open"));
  });
  document.querySelectorAll(".main-nav .sub a").forEach(a =>
    a.addEventListener("click", () => document.querySelector(".main-nav")?.classList.remove("open")));
})();
