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
      const on = b.dataset.filter === state;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
    count.textContent = `Showing ${n} ${n === 1 ? "centre" : "centres"}` + (state === "All" ? "" : ` in ${state}`);
  }
  buttons.forEach(b => b.addEventListener("click", () => filter(b.dataset.filter)));

  filter("All");
  // deep link from the home page, e.g. clinics.html#madurai
  const hash = location.hash.slice(1);
  if (hash) document.getElementById(hash)?.scrollIntoView({ block: "center" });
})();
