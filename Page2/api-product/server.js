require("dotenv").config();

const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const pool = require("./db");
const openApiSpec = require("./openapi");
const productsRouter = require("./routes/products");

const app = express();
const port = Number(process.env.PORT) || 3000;
const pageRoot = path.join(__dirname, "public");
const referenceRoot = path.resolve(__dirname, "..", "Project-AI");

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: "Product API Documentation"
}));
app.get("/shared/styles.css", (request, response) => {
  response.sendFile(path.join(referenceRoot, "styles.css"));
});
app.use("/shared/assets", express.static(path.join(referenceRoot, "assets")));
app.use("/reference", express.static(referenceRoot));
app.use("/api-product", express.static(pageRoot));
app.use(express.static(pageRoot));

app.use((error, request, response, next) => {
  console.error("API atau server gagal memproses permintaan:", error);
  if (response.headersSent) return next(error);
  response.status(500).json({
    error: { message: "Terjadi kesalahan pada server. Periksa konfigurasi dan log server." }
  });
});

async function startServer() {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () => {
      console.log(`Halaman API aktif di http://localhost:${port}`);
      console.log(`API produk tersedia di http://localhost:${port}/api/products`);
      console.log(`Dokumentasi Swagger tersedia di http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Tidak dapat terhubung ke MySQL. Periksa service dan konfigurasi .env:", error);
    await pool.end();
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
