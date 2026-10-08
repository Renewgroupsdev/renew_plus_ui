/* Blog listing: filter the category sections (All / Hair Care / Skin Care). */
(function () {
  const buttons = [...document.querySelectorAll(".bl-filters .gl-btn")];
  const sections = [...document.querySelectorAll(".bl-cat")];
  if (!buttons.length) return;

  function filter(cat) {
    sections.forEach(s => { s.hidden = !(cat === "All" || s.dataset.cat === cat); });
    buttons.forEach(b => {
      const on = b.dataset.filter === cat;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  buttons.forEach(b => b.addEventListener("click", () => {
    filter(b.dataset.filter);
    history.replaceState(null, "", b.dataset.slug ? "#" + b.dataset.slug : location.pathname);
  }));

  // deep link: blogs.html#hair-care or #skin-care opens that category
  const hash = location.hash.slice(1);
  const match = buttons.find(b => b.dataset.slug === hash);
  filter(match ? match.dataset.filter : "All");
})();
