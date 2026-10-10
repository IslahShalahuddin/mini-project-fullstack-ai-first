(() => {
  const colorInputs = [...document.querySelectorAll('input[name="color"]')];
  const sizeInputs = [...document.querySelectorAll('input[name="size"]')];
  const quantityOutput = document.querySelector("#quantity");
  const subtotalOutput = document.querySelector("#subtotal");
  const priceElement = document.querySelector("#product-price");
  const purchaseMessage = document.querySelector("#purchase-message");
  const decreaseButton = document.querySelector('[data-quantity="-1"]');
  const quantity = { value: 1 };
  let unitPrice = Number(document.body.dataset.unitPrice);

  const formatPrice = (value) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);

  const selectedValue = (inputs) => inputs.find((input) => input.checked)?.value ?? "";

  function updateSummary() {
    const color = selectedValue(colorInputs);
    const size = selectedValue(sizeInputs);
    const colorLabel = document.querySelector("#selected-color");
    const sizeLabel = document.querySelector("#selected-size");

    if (colorLabel) colorLabel.textContent = color || "Choose a color";
    if (sizeLabel) sizeLabel.textContent = size || "Choose a size";
    if (quantityOutput) quantityOutput.textContent = String(quantity.value);
    if (subtotalOutput && Number.isFinite(unitPrice)) {
      subtotalOutput.textContent = formatPrice(unitPrice * quantity.value);
    }
    if (decreaseButton) decreaseButton.disabled = quantity.value <= 1;
    if (document.body.dataset.page === "bison") {
      const galleryCaption = document.querySelector("#gallery-caption");
      if (galleryCaption) {
        galleryCaption.textContent = color === "Wild Green"
          ? "Wild Green selected · photos currently show the Coffee color."
          : "Product photos show Coffee color · thoughtful fibers, a little more adventure.";
      }
    }
  }

  function showPhoto(index) {
    const thumbnails = [...document.querySelectorAll(".thumbnail")];
    const selected = thumbnails[index];
    const image = document.querySelector("#main-image");
    if (!selected || !image) return;
    image.src = selected.dataset.image;
    image.alt = selected.dataset.alt || "";
    if (selected.dataset.fallback) image.dataset.fallback = selected.dataset.fallback;
    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      const active = thumbnailIndex === index;
      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
    const count = document.querySelector("#image-count");
    if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(thumbnails.length).padStart(2, "0")}`;
  }

  function updateUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("variant");
    const color = selectedValue(colorInputs);
    const size = selectedValue(sizeInputs);
    if (color) url.searchParams.set("color", color);
    else url.searchParams.delete("color");
    if (size) url.searchParams.set("size", size);
    else url.searchParams.delete("size");
    window.history.replaceState({}, "", url);
  }

  function initializeVariantFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const variantId = params.get("variant");
    const initialColor = variantId === "40799980519496" ? "Coffee" : params.get("color");
    const initialSize = variantId === "40799980519496" ? "S/M" : params.get("size");
    const color = colorInputs.find((input) => input.value === initialColor);
    const size = sizeInputs.find((input) => input.value === initialSize);
    if (color) color.checked = true;
    if (size) size.checked = true;
  }

  document.addEventListener("click", (event) => {
    const thumbnail = event.target.closest(".thumbnail");
    if (!thumbnail) return;
    const thumbnails = [...document.querySelectorAll(".thumbnail")];
    showPhoto(thumbnails.indexOf(thumbnail));
  });

  [...colorInputs, ...sizeInputs].forEach((input) => {
    input.addEventListener("change", () => {
      updateSummary();
      updateUrl();
      if (purchaseMessage) purchaseMessage.textContent = "Selection updated. Demo only — no order has been submitted.";
    });
  });

  document.querySelectorAll("[data-quantity]").forEach((button) => {
    button.addEventListener("click", () => {
      const change = Number(button.dataset.quantity);
      quantity.value = Math.max(1, quantity.value + change);
      updateSummary();
      if (purchaseMessage) purchaseMessage.textContent = "Quantity updated. Demo only — no order has been submitted.";
    });
  });

  document.querySelectorAll("[data-purchase]").forEach((button) => {
    button.addEventListener("click", () => {
      if (purchaseMessage) {
        const action = button.dataset.purchase === "cart" ? "Add to cart" : "Buy it now";
        purchaseMessage.textContent = `${action} is a visual demo only. No cart or checkout is connected, so no order was submitted.`;
      }
    });
  });

  document.addEventListener("error", (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target;
    const fallback = image.dataset.fallback || image.closest(".thumbnail")?.dataset.fallback;
    if (fallback && image.src !== new URL(fallback, window.location.href).href) {
      image.src = fallback;
      return;
    }
    image.closest(".thumbnail")?.classList.add("image-unavailable");
  }, true);

  window.initializeProductPage = (data) => {
    unitPrice = Number(data.price);
    if (priceElement) priceElement.textContent = formatPrice(unitPrice);
    updateSummary();
    initializeVariantFromUrl();
    updateSummary();
  };

  if (document.body.dataset.page === "bison") {
    window.initializeProductPage({ price: 44 });
  }
})();
