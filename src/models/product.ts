import Client from '../database';

export interface ProductInfo {
  name: string;
  price: number;
}

export interface Product extends ProductInfo {
  id: number;
}

export class ProductStore {
  async getAll(): Promise<Product[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM products';
      const { rows } = await connection.query(sql);
      connection.release();
      return rows;
    } catch (err) {
      throw new Error(`Can not get products.`);
    }
  }

  async create(product: ProductInfo): Promise<Product> {
    const { name, price } = product;
    try {
      const sql =
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [name, price]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not add product.`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not find product.`);
    }
  }

  async update(id: number, productData: ProductInfo): Promise<Product> {
    const { name: newName, price } = productData;

    try {
      const sql =
        'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [newName, price, id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not update product.`);
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not delete product.`);
    }
  }
}
