CREATE TABLE order_details (
  order_id   INTEGER NOT NULL REFERENCES orders (id),
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity   INTEGER NOT NULL
);