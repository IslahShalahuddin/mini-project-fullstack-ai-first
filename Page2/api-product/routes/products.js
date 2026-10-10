const express = require("express");
const pool = require("../db");

const router = express.Router();
const productFields = "id, name, description, price, image_url, images, stock, sizes, colors";

router.post("/", async (request, response, next) => {
  const { name, description, price, image_url, images, stock, sizes, colors } = request.body ?? {};
  const errors = [];

  if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 200) {
    errors.push("name wajib berupa teks dengan panjang 1 sampai 200 karakter.");
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push("description wajib berupa teks yang tidak kosong.");
  }

  const numericPrice = typeof price === "number" ? price : Number(price);
  if (price === undefined || price === null || price === "" ||
      !Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 99999999.99) {
    errors.push("price wajib berupa angka antara 0 dan 99999999.99.");
  }

  if (image_url !== undefined && image_url !== null &&
      (typeof image_url !== "string" || image_url.length > 500)) {
    errors.push("image_url harus berupa teks maksimal 500 karakter atau null.");
  }
  if (images !== undefined && (!Array.isArray(images) ||
      images.some((image) => typeof image !== "string"))) {
    errors.push("images harus berupa array yang berisi teks.");
  }

  const numericStock = stock === undefined ? 0 : stock;
  if (!Number.isSafeInteger(numericStock) || numericStock < 0 || numericStock > 4294967295) {
    errors.push("stock harus berupa bilangan bulat antara 0 dan 4294967295.");
  }
  if (sizes !== undefined && (!Array.isArray(sizes) ||
      sizes.some((size) => typeof size !== "string"))) {
    errors.push("sizes harus berupa array yang berisi teks.");
  }
  if (colors !== undefined && (!Array.isArray(colors) ||
      colors.some((color) => typeof color !== "string"))) {
    errors.push("colors harus berupa array yang berisi teks.");
  }

  if (errors.length > 0) {
    return response.status(400).json({
      error: {
        message: "Data produk tidak valid.",
        details: errors
      }
    });
  }

  const product = {
    name: name.trim(),
    description: description.trim(),
    price: numericPrice,
    image_url: image_url ?? null,
    images: images ?? [],
    stock: numericStock,
    sizes: sizes ?? [],
    colors: colors ?? []
  };

  try {
    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, image_url, images, stock, sizes, colors)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.description,
        product.price,
        product.image_url,
        JSON.stringify(product.images),
        product.stock,
        JSON.stringify(product.sizes),
        JSON.stringify(product.colors)
      ]
    );

    const [createdProducts] = await pool.execute(
      `SELECT ${productFields} FROM products WHERE id = ?`,
      [result.insertId]
    );
    return response.status(201).json({ data: createdProducts[0] });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (request, response, next) => {
  try {
    const [products] = await pool.execute(
      `SELECT ${productFields} FROM products ORDER BY id`
    );
    response.json({ data: products });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({
      error: { message: "ID produk harus berupa bilangan bulat positif." }
    });
  }

  try {
    const [products] = await pool.execute(
      `SELECT ${productFields} FROM products WHERE id = ?`,
      [id]
    );
    if (products.length === 0) {
      return response.status(404).json({
        error: { message: "Produk tidak ditemukan." }
      });
    }
    response.json({ data: products[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
