(() => {
  const loadingState = document.querySelector("#loading-state");
  const errorState = document.querySelector("#error-state");
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

  let stock = 0;
  let quantity = 1;
  let images = [];

  function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Number(value));
  }

  function renderValues(container, values, emptyMessage) {
    container.replaceChildren();
    if (!Array.isArray(values) || values.length === 0) {
      const message = document.createElement("span");
      message.className = "option-unavailable";
      message.textContent = emptyMessage;
      container.append(message);
      return;
    }

    values.forEach((value) => {
      const item = document.createElement("span");
      item.className = "size-choice";
      item.textContent = value;
      container.append(item);
    });
  }

  function updateQuantityControls() {
    quantityOutput.textContent = String(quantity);
    decreaseButton.disabled = quantity <= 1;
    increaseButton.disabled = quantity >= stock;
  }

  function showImage(index) {
    const image = images[index];
    if (!image) return;

    mainImage.src = image.url;
    mainImage.alt = image.alt;
    imageCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

    [...thumbnailRow.querySelectorAll(".thumbnail")].forEach((thumbnail, thumbnailIndex) => {
      const active = thumbnailIndex === index;
      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
  }

  function renderGallery(product) {
    const imageUrls = Array.isArray(product.images) ? product.images : [];
    if (imageUrls.length === 0 && product.image_url) imageUrls.push(product.image_url);

    images = imageUrls.filter((url) => typeof url === "string" && url.trim()).map((url, index) => ({
      url,
      alt: `${product.name}, foto ${index + 1}`
    }));
    thumbnailRow.replaceChildren();

    if (images.length === 0) {
      mainImage.hidden = true;
      imageCount.hidden = true;
      imageMessage.textContent = "Foto produk belum tersedia.";
      return;
    }

    mainImage.hidden = false;
    imageCount.hidden = false;
    imageMessage.textContent = "Pilih thumbnail untuk melihat foto produk.";
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
      button.append(thumbnailImage);
      thumbnailRow.append(button);
    });
    showImage(0);

    mainImage.addEventListener("error", () => {
      mainImage.hidden = true;
      imageCount.hidden = true;
      imageMessage.textContent = "Foto produk gagal dimuat.";
    }, { once: true });
  }

  function renderProduct(product) {
    document.title = `${product.name} — Detail Produk`;
    document.querySelector("#breadcrumb-name").textContent = product.name;
    document.querySelector("#product-title").textContent = product.name;
    document.querySelector("#product-price").textContent = formatPrice(product.price);
    document.querySelector("#product-description").textContent = product.description;
    document.querySelector("#product-stock").textContent = String(product.stock);
    renderValues(document.querySelector("#product-sizes"), product.sizes, "Ukuran tidak tersedia");
    renderValues(document.querySelector("#product-colors"), product.colors, "Warna tidak tersedia");
    renderGallery(product);

    stock = Number(product.stock) || 0;
    quantity = stock > 0 ? 1 : 0;
    addToCartButton.disabled = stock === 0;
    purchaseMessage.textContent = stock > 0
      ? "Tombol keranjang adalah simulasi frontend; pesanan tidak dikirim."
      : "Stok produk kosong.";
    updateQuantityControls();
    productSection.hidden = false;
  }

  function showError(message) {
    errorState.textContent = message;
    errorState.hidden = false;
    document.querySelector("#breadcrumb-name").textContent = "Produk tidak tersedia";
  }

  decreaseButton.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updateQuantityControls();
  });

  increaseButton.addEventListener("click", () => {
    quantity = Math.min(stock, quantity + 1);
    updateQuantityControls();
  });

  addToCartButton.addEventListener("click", () => {
    purchaseMessage.textContent = `Simulasi berhasil: ${quantity} produk ditambahkan. Tidak ada transaksi atau keranjang nyata.`;
  });

  async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "1";
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || `Permintaan gagal (${response.status}).`);
      }
      renderProduct(result.data);
    } catch (error) {
      showError(error.message === "Failed to fetch"
        ? "API tidak dapat diakses. Pastikan server Node.js dan MySQL sedang berjalan."
        : error.message);
    } finally {
      loadingState.hidden = true;
    }
  }

  loadProduct();
})();
