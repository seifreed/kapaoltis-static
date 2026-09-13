(() => {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length) return;

  let overlay = null;
  let current = [];
  let index = 0;

  const ensureOverlay = () => {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="lightbox__backdrop" data-lightbox-close></div>
      <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Galeria de fotos">
        <button class="lightbox__close" type="button" aria-label="Tancar" data-lightbox-close>&times;</button>
        <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Anterior" data-lightbox-prev>‹</button>
        <figure class="lightbox__figure">
          <img class="lightbox__img" alt="">
          <figcaption class="lightbox__caption"></figcaption>
        </figure>
        <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Següent" data-lightbox-next>›</button>
        <p class="lightbox__counter" aria-live="polite"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target.closest("[data-lightbox-close]")) close();
      if (event.target.closest("[data-lightbox-prev]")) show(index - 1);
      if (event.target.closest("[data-lightbox-next]")) show(index + 1);
    });

    return overlay;
  };

  const show = (nextIndex) => {
    if (!current.length) return;
    index = (nextIndex + current.length) % current.length;
    const item = current[index];
    const root = ensureOverlay();
    const img = root.querySelector(".lightbox__img");
    const caption = root.querySelector(".lightbox__caption");
    const counter = root.querySelector(".lightbox__counter");
    img.src = item.src;
    img.alt = item.alt || "";
    caption.textContent = item.alt || "";
    counter.textContent = `${index + 1} / ${current.length}`;
    root.hidden = false;
    document.body.classList.add("is-lightbox-open");
    root.querySelector(".lightbox__close").focus();
  };

  const close = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("is-lightbox-open");
  };

  document.addEventListener("keydown", (event) => {
    if (!overlay || overlay.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });

  galleries.forEach((gallery) => {
    const items = [...gallery.querySelectorAll("[data-gallery-src]")].map((el) => ({
      src: el.getAttribute("data-gallery-src"),
      alt: el.getAttribute("data-gallery-alt") || el.querySelector("img")?.alt || "",
      trigger: el,
    }));

    items.forEach((item, i) => {
      item.trigger.addEventListener("click", () => {
        current = items;
        show(i);
      });
    });
  });
})();
