/* Gallery: category filter buttons + lightbox viewer. */
(function () {
  const buttons = [...document.querySelectorAll(".gl-btn")];
  const items = [...document.querySelectorAll(".gl-item")];
  const count = document.getElementById("glCount");
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lbImg");
  const cap = document.getElementById("lbCap");
  let visible = items, current = 0;

  function filter(cat) {
    visible = [];
    items.forEach(it => {
      const show = cat === "All" || it.dataset.cat === cat;
      it.hidden = !show;
      it.classList.remove("pop");
      if (show) { visible.push(it); void it.offsetWidth; it.classList.add("pop"); }
    });
    buttons.forEach(b => {
      const on = b.dataset.filter === cat;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
    count.textContent = `Showing ${visible.length} ${visible.length === 1 ? "image" : "images"}` + (cat === "All" ? "" : ` in ${cat}`);
  }
  buttons.forEach(b => b.addEventListener("click", () => filter(b.dataset.filter)));

  function show(i) {
    current = (i + visible.length) % visible.length;
    const it = visible[current];
    img.src = it.querySelector("img").src;
    img.alt = it.querySelector("img").alt;
    cap.textContent = it.querySelector("strong").textContent;
  }
  items.forEach(it => it.querySelector(".gl-open").addEventListener("click", () => {
    show(visible.indexOf(it));
    box.showModal();
  }));
  box.querySelector(".lb-close").addEventListener("click", () => box.close());
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", e => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  filter("All");
})();
