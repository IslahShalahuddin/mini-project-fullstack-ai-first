CREATE DATABASE IF NOT EXISTS bison_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bison_store;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500) NULL,
  images JSON NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  sizes JSON NOT NULL,
  colors JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Nilai stok di bawah hanya data latihan, bukan inventori toko yang terverifikasi.
INSERT INTO products
  (id, name, description, price, image_url, images, stock, sizes, colors)
VALUES
  (
    1,
    'Ultimate Bison Boot Sock - Imperfect Packaging',
    'Kaus kaki boot tinggi dengan bantalan penuh, serat BisonShield, dan penguatan tumit serta ujung. Batch ini mungkin memiliki label kemasan Trail Socks.',
    44.00,
    '/shared/assets/bison-coffee1.png',
    JSON_ARRAY(
      '/shared/assets/bison-coffee1.png',
      '/shared/assets/bison-coffee2.png',
      '/shared/assets/bison-coffee3.png',
      '/shared/assets/bison-coffee4.png',
      '/shared/assets/bison-coffee5.png',
      '/shared/assets/bison-coffee6.png',
      '/shared/assets/bison-coffee7.png'
    ),
    12,
    JSON_ARRAY('S/M', 'M/L'),
    JSON_ARRAY('Coffee', 'Wild Green')
  ),
  (
    2,
    'Produk Contoh Kedua (Data Latihan)',
    'Record contoh untuk mencoba endpoint daftar dan detail. Ini bukan produk toko atau data katalog terverifikasi.',
    29.00,
    NULL,
    JSON_ARRAY(),
    5,
    JSON_ARRAY(),
    JSON_ARRAY()
  )
ON DUPLICATE KEY UPDATE id = id;
