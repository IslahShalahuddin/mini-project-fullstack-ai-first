const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Product API",
    version: "1.0.0",
    description: "Dokumentasi endpoint produk yang saat ini tersedia pada backend."
  },
  servers: [
    {
      url: "/",
      description: "Server yang sedang digunakan"
    }
  ],
  tags: [
    {
      name: "Products",
      description: "Membaca produk dari database MySQL"
    }
  ],
  paths: {
    "/api/products": {
      post: {
        tags: ["Products"],
        summary: "Membuat produk baru",
        operationId: "createProduct",
        description: "Menyimpan produk baru ke tabel products. ID dibuat otomatis oleh MySQL.",
        requestBody: {
          required: true,
          description: "Data produk yang akan disimpan. images, sizes, dan colors boleh dihilangkan dan akan menjadi array kosong; stock default 0 dan image_url default null.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProduct" },
              examples: {
                "Body valid": {
                  summary: "Body valid",
                  value: {
                    name: "Contoh produk baru",
                    description: "Deskripsi produk contoh untuk menguji endpoint POST.",
                    price: 25.5,
                    image_url: "/shared/assets/bison-coffee1.png",
                    images: ["/shared/assets/bison-coffee1.png"],
                    stock: 7,
                    sizes: ["S/M"],
                    colors: ["Coffee"]
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Produk berhasil dibuat.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: { $ref: "#/components/schemas/Product" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Request body tidak valid.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                example: {
                  error: {
                    message: "Data produk tidak valid.",
                    details: ["name wajib berupa teks dengan panjang 1 sampai 200 karakter."]
                  }
                }
              }
            }
          },
          "500": {
            description: "Server gagal menyimpan atau membaca produk dari database.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      get: {
        tags: ["Products"],
        summary: "Mengambil seluruh produk",
        operationId: "getProducts",
        responses: {
          "200": {
            description: "Daftar produk berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" }
                    }
                  }
                },
                example: {
                  data: [
                    {
                      id: 1,
                      name: "Ultimate Bison Boot Sock - Imperfect Packaging",
                      description: "Kaus kaki boot tinggi dengan bantalan penuh.",
                      price: "44.00",
                      image_url: "/shared/assets/bison-coffee1.png",
                      images: ["/shared/assets/bison-coffee1.png"],
                      stock: 12,
                      sizes: ["S/M", "M/L"],
                      colors: ["Coffee", "Wild Green"]
                    }
                  ]
                }
              }
            }
          },
          "500": {
            description: "Server gagal mengambil data dari database.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Mengambil detail produk berdasarkan ID",
        operationId: "getProductById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID produk berupa bilangan bulat positif.",
            schema: { type: "integer", minimum: 1 },
            example: 1
          }
        ],
        responses: {
          "200": {
            description: "Detail produk berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: { $ref: "#/components/schemas/Product" }
                  }
                }
              }
            }
          },
          "400": {
            description: "ID tidak berupa bilangan bulat positif.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  error: { message: "ID produk harus berupa bilangan bulat positif." }
                }
              }
            }
          },
          "404": {
            description: "Produk dengan ID tersebut tidak ditemukan.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  error: { message: "Produk tidak ditemukan." }
                }
              }
            }
          },
          "500": {
            description: "Server gagal mengambil data dari database.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      CreateProduct: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description", "price"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 200, example: "Contoh produk baru" },
          description: { type: "string", minLength: 1, example: "Deskripsi produk baru." },
          price: { type: "number", minimum: 0, maximum: 99999999.99, example: 25.5 },
          image_url: {
            type: "string",
            nullable: true,
            maxLength: 500,
            example: "/shared/assets/bison-coffee1.png"
          },
          images: {
            type: "array",
            items: { type: "string" },
            default: [],
            example: ["/shared/assets/bison-coffee1.png"]
          },
          stock: { type: "integer", minimum: 0, maximum: 4294967295, default: 0, example: 7 },
          sizes: {
            type: "array",
            items: { type: "string" },
            default: [],
            example: ["S/M"]
          },
          colors: {
            type: "array",
            items: { type: "string" },
            default: [],
            example: ["Coffee"]
          }
        }
      },
      Product: {
        type: "object",
        required: [
          "id",
          "name",
          "description",
          "price",
          "image_url",
          "images",
          "stock",
          "sizes",
          "colors"
        ],
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ultimate Bison Boot Sock - Imperfect Packaging" },
          description: { type: "string", example: "Kaus kaki boot tinggi dengan bantalan penuh." },
          price: {
            oneOf: [
              { type: "number", format: "double" },
              { type: "string" }
            ],
            description: "Harga produk; MySQL DECIMAL dapat diserialisasi sebagai string.",
            example: "44.00"
          },
          image_url: {
            type: "string",
            nullable: true,
            example: "/shared/assets/bison-coffee1.png"
          },
          images: {
            type: "array",
            items: { type: "string" },
            example: ["/shared/assets/bison-coffee1.png"]
          },
          stock: { type: "integer", minimum: 0, example: 12 },
          sizes: {
            type: "array",
            items: { type: "string" },
            example: ["S/M", "M/L"]
          },
          colors: {
            type: "array",
            items: { type: "string" },
            example: ["Coffee", "Wild Green"]
          }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["message"],
            properties: {
              message: { type: "string" }
            }
          }
        }
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["message", "details"],
            properties: {
              message: { type: "string" },
              details: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = openApiSpec;
