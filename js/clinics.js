<<<<<<< HEAD
/* Renew Centres: filter by state. */
(function () {
  const buttons = [...document.querySelectorAll(".gl-btn")];
  const cards = [...document.querySelectorAll(".cl-card")];
  const count = document.getElementById("clCount");

  function filter(state) {
    let n = 0;
    cards.forEach(c => {
      const show = state === "All" || c.dataset.state === state;
      c.hidden = !show;
      if (show && !c.classList.contains("cl-card--soon")) n++;
    });
    buttons.forEach(b => {
=======
/* Locations: search, state filter, list/map view and an interactive map of all clinics. */
(function () {
  const cards = [...document.querySelectorAll(".lc-card")];
  const pills = [...document.querySelectorAll(".lc-pill")];
  const search = document.getElementById("lcSearch");
  const count = document.getElementById("lcCount");
  const empty = document.getElementById("lcEmpty");
  const more = document.getElementById("lcMore");
  const main = document.getElementById("lcMain");
  const reset = document.getElementById("lcReset");
  const viewBtns = [...document.querySelectorAll(".lc-view button")];
  const FIRST = 6;
  let state = "All", query = "", expanded = false;

  /* ---------- map ---------- */
  const places = window.RENEW_LOCATIONS || [];
  let map = null;
  const markers = {};
  if (window.L && document.getElementById("lcMap") && places.length) {
    map = L.map("lcMap", { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 17, attribution: "Tiles &copy; Esri" }).addTo(map);
    places.forEach(p => {
      const icon = L.divIcon({
        className: "lc-mk-wrap",
        html: '<span class="lc-mk' + (p.soon ? " is-soon" : "") + (p.left ? " is-left" : "") + '"><i></i><b>' + p.name + (p.soon ? "<small>Coming Soon</small>" : "") + "</b></span>",
        iconSize: [0, 0]
      });
      const m = L.marker([p.lat, p.lng], { icon, title: p.name, keyboard: !p.soon });
      if (!p.soon) m.on("click", () => focusCard(p.slug));
      markers[p.slug] = m;
    });
  }
  const fit = () => {
    if (!map) return;
    const on = Object.entries(markers).filter(([, m]) => map.hasLayer(m)).map(([, m]) => m.getLatLng());
    if (on.length === 1) map.setView(on[0], 11);
    else if (on.length) map.fitBounds(L.latLngBounds(on), { padding: [40, 40], maxZoom: 9 });
  };

  /* ---------- list ---------- */
  function update() {
    const q = query.trim().toLowerCase();
    const filtering = state !== "All" || q !== "";
    let shown = 0, matches = 0;
    cards.forEach((c, i) => {
      const ok = (state === "All" || c.dataset.state === state) && (!q || c.dataset.text.includes(q));
      if (ok) matches++;
      const vis = ok && (filtering || expanded || i < FIRST);
      c.hidden = !vis;
      if (vis) shown++;
      const m = markers[c.dataset.slug];
      if (m && map) { if (ok) m.addTo(map); else map.removeLayer(m); }
    });
    const soon = markers.thenkasi;
    if (soon && map) { if (state !== "Karnataka" && state !== "Puducherry" && !q) soon.addTo(map); else map.removeLayer(soon); }
    pills.forEach(b => {
>>>>>>> master
      const on = b.dataset.filter === state;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
<<<<<<< HEAD
    count.textContent = `Showing ${n} ${n === 1 ? "centre" : "centres"}` + (state === "All" ? "" : ` in ${state}`);
  }
  buttons.forEach(b => b.addEventListener("click", () => filter(b.dataset.filter)));

  filter("All");
  // deep link from the home page, e.g. clinics.html#madurai
  const hash = location.hash.slice(1);
  if (hash) document.getElementById(hash)?.scrollIntoView({ block: "center" });
=======
    count.textContent = matches ? "Showing " + matches + (matches === 1 ? " location" : " locations") + (state === "All" ? "" : " in " + state) : "";
    empty.hidden = matches !== 0;
    more.parentElement.hidden = filtering || expanded || cards.length <= FIRST;
    fit();
  }

  pills.forEach(b => b.addEventListener("click", () => { state = b.dataset.filter; update(); }));
  search.addEventListener("input", () => { query = search.value; update(); });
  more.addEventListener("click", () => { expanded = true; update(); });
  reset.addEventListener("click", () => { state = "All"; query = ""; search.value = ""; expanded = false; update(); });

  viewBtns.forEach(b => b.addEventListener("click", () => {
    const isMap = b.dataset.view === "map";
    main.classList.toggle("is-map", isMap);
    viewBtns.forEach(x => x.classList.toggle("is-active", x === b));
    if (map) setTimeout(() => { map.invalidateSize(); fit(); }, 60);
  }));

  function focusCard(slug) {
    const card = document.getElementById(slug);
    if (!card) return;
    if (card.hidden) { expanded = true; update(); }
    main.classList.remove("is-map");
    viewBtns.forEach(x => x.classList.toggle("is-active", x.dataset.view === "list"));
    card.scrollIntoView({ block: "center", behavior: "smooth" });
    cards.forEach(c => c.classList.toggle("is-hit", c === card));
    setTimeout(() => card.classList.remove("is-hit"), 2400);
  }

  document.querySelectorAll("[data-focus]").forEach(b => b.addEventListener("click", () => {
    const m = markers[b.dataset.focus];
    if (!m || !map) return;
    map.flyTo(m.getLatLng(), 12, { duration: .8 });
    Object.values(markers).forEach(x => x.getElement()?.classList.remove("is-active"));
    m.getElement()?.classList.add("is-active");
    if (window.matchMedia("(max-width:980px)").matches) document.getElementById("lcMap").scrollIntoView({ block: "center", behavior: "smooth" });
  }));

  update();
  // deep link from the home page, e.g. clinics.html#madurai
  const hash = location.hash.slice(1);
  if (hash && document.getElementById(hash)) setTimeout(() => focusCard(hash), 300);
>>>>>>> master
})();
