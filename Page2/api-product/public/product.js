(() => {
  const loadingState = document.querySelector("#loading-state");
  const errorState = document.querySelector("#error-state");
  const errorTitle = document.querySelector("#error-title");
  const errorMessage = document.querySelector("#error-message");
  const productSection = document.querySelector("#product");
  const mainImage = document.querySelector("#main-image");
  const thumbnailRow = document.querySelector("#thumbnail-row");
  const imageCount = document.querySelector("#image-count");
  const imageMessage = document.querySelector("#image-message");
  const quantityOutput = document.querySelector("#quantity");
  const decreaseButton = document.querySelector("#decrease-quantity");
  const increaseButton = document.querySelector("#increase-quantity");
  const addToCartButton = document.querySelector("#add-to-cart");
  const purchaseMessage = document.querySelector("#purchase-message");
  const sizeGroup = document.querySelector("#size-group");
  const colorGroup = document.querySelector("#color-group");
  const sizeOptions = document.querySelector("#product-sizes");
  const colorOptions = document.querySelector("#product-colors");

  let product;
  let stock = 0;
  let quantity = 0;
  let images = [];

  function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  }

  function imageUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.href;
    } catch {
      return null;
    }
  }

  function updateSelectionLabels() {
    const selectedSize = sizeOptions.querySelector('input[name="size"]:checked');
    const selectedColor = colorOptions.querySelector('input[name="color"]:checked');
    document.querySelector("#selected-size").textContent = selectedSize?.value || "";
    document.querySelector("#selected-color").textContent = selectedColor?.value || "";
  }

  function updatePurchaseSummary() {
    quantityOutput.textContent = String(quantity);
    decreaseButton.disabled = quantity <= 1;
    increaseButton.disabled = quantity >= stock;
    addToCartButton.disabled = stock === 0;
    document.querySelector("#product-subtotal").textContent = formatPrice(
      Number(product.price) * quantity
    );
  }

  function createOption(value, name, index) {
    const label = document.createElement("label");
    label.className = name === "color" ? "swatch-choice" : "size-choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = index === 0;
    input.addEventListener("change", updateSelectionLabels);

    const text = document.createElement("span");
    text.textContent = value;

    if (name === "color") {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.backgroundColor = getColorValue(value);
      label.append(input, swatch, text);
    } else {
      label.append(input, text);
    }

    return label;
  }

  function getColorValue(color) {
    const normalized = color.toLowerCase();
    if (normalized.includes("coffee") || normalized.includes("brown")) return "#765544";
    if (normalized.includes("green")) return "#68755c";
    if (normalized.includes("sand") || normalized.includes("beige")) return "#d1c1a4";
    if (normalized.includes("navy") || normalized.includes("blue")) return "#273d5a";
    if (normalized.includes("white")) return "#fff";
    return "#a8afa4";
  }

  function renderOptions(container, group, values, name) {
    container.replaceChildren();
    const options = Array.isArray(values)
      ? values.filter((value) => typeof value === "string" && value.trim())
      : [];
    group.hidden = options.length === 0;
    options.forEach((value, index) => {
      container.append(createOption(value, name, index));
    });
  }

  function showImage(index) {
    const image = images[index];
    if (!image) return;

    mainImage.src = image.url;
    mainImage.alt = image.alt;
    mainImage.hidden = false;
    imageCount.hidden = false;
    imageCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

    thumbnailRow.querySelectorAll(".thumbnail").forEach((thumbnail, thumbnailIndex) => {
      const active = thumbnailIndex === index;
      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
  }

  function renderGallery(data) {
    const imageUrls = Array.isArray(data.images) ? [...data.images] : [];
    if (imageUrls.length === 0 && data.image_url) imageUrls.push(data.image_url);

    images = imageUrls
      .map((url, index) => {
        const safeUrl = imageUrl(url);
        return safeUrl ? { url: safeUrl, alt: `${data.name}, foto ${index + 1}` } : null;
      })
      .filter(Boolean);

    thumbnailRow.replaceChildren();
    if (images.length === 0) {
      mainImage.hidden = true;
      imageCount.hidden = true;
      imageMessage.textContent = "Foto produk belum tersedia.";
      return;
    }

    imageMessage.textContent = "Pilih foto untuk melihat detail produk.";
    images.forEach((image, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `thumbnail${index === 0 ? " is-active" : ""}`;
      button.setAttribute("aria-label", `Tampilkan foto produk ${index + 1}`);
      button.setAttribute("aria-pressed", String(index === 0));
      button.addEventListener("click", () => showImage(index));

      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = image.url;
      thumbnailImage.alt = "";
      thumbnailImage.addEventListener("error", () => {
        button.classList.add("image-unavailable");
        button.disabled = true;
      }, { once: true });

      button.append(thumbnailImage);
      thumbnailRow.append(button);
    });

    showImage(0);
  }

  function renderProduct(data) {
    if (!data || typeof data.name !== "string" || !Number.isFinite(Number(data.price))) {
      throw new Error("Format data produk dari API tidak sesuai.");
    }

    product = data;
    stock = Number.isSafeInteger(Number(data.stock)) ? Math.max(0, Number(data.stock)) : 0;
    quantity = stock > 0 ? 1 : 0;

    document.title = `${data.name} — Detail Produk`;
    document.querySelector("#breadcrumb-name").textContent = data.name;
    document.querySelector("#product-title").textContent = data.name;
    document.querySelector("#product-price").textContent = formatPrice(Number(data.price));
    document.querySelector("#product-description").textContent =
      data.description || "Belum ada deskripsi untuk produk ini.";
    document.querySelector("#product-id").textContent = `#${data.id}`;
    renderOptions(sizeOptions, sizeGroup, data.sizes, "size");
    renderOptions(colorOptions, colorGroup, data.colors, "color");
    updateSelectionLabels();
    renderGallery(data);

    const stockMessage = document.querySelector("#stock-message");
    const stockIndicator = document.querySelector("#stock-indicator");
    stockMessage.textContent = stock > 0
      ? `${stock} tersedia · jumlah dibatasi sesuai stok`
      : "Stok sedang habis";
    stockIndicator.classList.toggle("is-out-of-stock", stock === 0);
    purchaseMessage.textContent = "Demo frontend — tidak ada transaksi atau keranjang yang dikirim.";

    updatePurchaseSummary();
    productSection.hidden = false;
    errorState.hidden = true;
  }

  function showError(message, notFound = false) {
    errorTitle.textContent = notFound ? "Produk tidak ditemukan" : "Produk tidak dapat dimuat";
    errorMessage.textContent = message;
    errorState.hidden = false;
    document.querySelector("#breadcrumb-name").textContent = "Produk tidak tersedia";
  }

  async function loadProduct() {
    loadingState.hidden = false;
    errorState.hidden = true;
    productSection.hidden = true;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "1";

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}`);
      const result = await response.json();
      if (!response.ok) {
        const notFound = response.status === 404;
        throw Object.assign(
          new Error(result.error?.message || `Permintaan gagal (${response.status}).`),
          { notFound }
        );
      }
      renderProduct(result.data);
    } catch (error) {
      showError(
        error.message === "Failed to fetch"
          ? "API tidak dapat diakses. Pastikan server Node.js dan MySQL sedang berjalan."
          : error.message,
        error.notFound
      );
    } finally {
      loadingState.hidden = true;
    }
  }

  decreaseButton.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updatePurchaseSummary();
  });

  increaseButton.addEventListener("click", () => {
    quantity = Math.min(stock, quantity + 1);
    updatePurchaseSummary();
  });

  addToCartButton.addEventListener("click", () => {
    const selectedSize = sizeOptions.querySelector('input[name="size"]:checked')?.value;
    const selectedColor = colorOptions.querySelector('input[name="color"]:checked')?.value;
    const variant = [selectedColor, selectedSize].filter(Boolean).join(" · ");
    purchaseMessage.textContent =
      `${quantity} × ${product.name}${variant ? ` (${variant})` : ""} dipilih. Demo saja — belum ada API keranjang.`;
  });

  document.querySelector("#retry-load").addEventListener("click", loadProduct);
  mainImage.addEventListener("error", () => {
    mainImage.hidden = true;
    imageCount.hidden = true;
    imageMessage.textContent = "Foto produk gagal dimuat. Silakan pilih foto lainnya.";
    const activeThumbnail = thumbnailRow.querySelector(".thumbnail.is-active");
    if (activeThumbnail) activeThumbnail.classList.add("image-unavailable");
  });

  loadProduct();
})();
