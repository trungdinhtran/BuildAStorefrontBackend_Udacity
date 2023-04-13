import Client from '../database';

export interface OrderProduct {
  product_id: number;
  quantity: number;
}

export interface OrderInfo {
  products: OrderProduct[];
  user_id: number;
  status: boolean;
}

export interface Order extends OrderInfo {
  id: number;
}

export class OrderStore {
  async getOrder(): Promise<Order[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const { rows } = await connection.query(sql);
      const orderProductsSql =
        'SELECT product_id, quantity FROM order_details WHERE id=($1)';
      const orders: Order[] = [];
      for (const order of rows) {
        const { rows: orderProductRows } = await connection.query(orderProductsSql, [order.id]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }
      connection.release();
      return orders;
    } catch (err) {
      throw new Error(`Could not get orders. ${err}`);
    }
  }

  async create(order: OrderInfo): Promise<Order> {
    const { products, status, user_id } = order;

    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [user_id, status]);
      const order: Order = rows[0];
      const orderProductsSql =
        'INSERT INTO order_details (id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const orderProducts: OrderProduct[] = [];
      for (const product of products) {
        const { product_id, quantity } = product;
        const { rows } = await connection.query(orderProductsSql, [order.id, product_id, quantity]);
        orderProducts.push(rows[0]);
      }

      connection.release();

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`);
    }
  }

  async read(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [id]);
      const order = rows[0];
      const orderProductsSql =
        'SELECT product_id, quantity FROM order_details WHERE id=($1)';
      const { rows: orderProductRows } = await connection.query(orderProductsSql, [id]);
      connection.release();
      return {
        ...order,
        products: orderProductRows,
      };
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`);
    }
  }

  async readByUserId(id: number): Promise<Order []> {
    try {
        const connection = await Client.connect();
        const sql = 'SELECT * FROM orders WHERE user_id=($1)';
        const { rows } = await connection.query(sql, [id]);
        const orderProductsSql =
          'SELECT product_id, quantity FROM order_details WHERE id=($1)';
        const orders: Order[] = [];
        for (const order of rows) {
          const { rows: orderProductRows } = await connection.query(orderProductsSql, [order.id]);
          orders.push({
            ...order,
            products: orderProductRows,
          });
        }
        connection.release();
        return orders;
      } catch (err) {
        throw new Error(`Could not get orders. ${err}`);
      }
  }

  async update(id: number, orderData: OrderInfo): Promise<Order> {
    const { products, status, user_id } = orderData;

    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [status, id]);
      const order = rows[0];
      const orderProductsSql =
        'UPDATE order_details SET product_id = $1, quantity = $2 WHERE id = $3 RETURNING product_id, quantity';
      const orderProducts: OrderInfo[] = [];

      for (const product of products) {
        const { rows } = await connection.query(orderProductsSql, [
          product.product_id,
          product.quantity,
          order.id,
        ]);
        orderProducts.push(rows[0]);
      }

      connection.release();
      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Could not update order for user ${user_id}. ${err}`);
    }
  }

  async deleteOrder(id: number): Promise<Order> {
    try {
      const connection = await Client.connect();
      const orderProductsSql = 'DELETE FROM order_details WHERE id=($1)';
      await connection.query(orderProductsSql, [id]);
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const { rows } = await connection.query(sql, [id]);
      const order = rows[0];
      connection.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`);
    }
  }
}
