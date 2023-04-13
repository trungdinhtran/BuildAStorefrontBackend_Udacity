import { OrderInfo, Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';

const orderStore = new OrderStore();

describe('Order Model', () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();

  let order: OrderInfo, user_id: number, product_id: number;

  function createOrder(order: OrderInfo) {
    return orderStore.create(order);
  }

  function deleteOrder(id: number) {
    return orderStore.deleteOrder(id);
  }

  beforeAll(async () => {
    const user: User = await userStore.create({
      username: 'Dinh Tran',
      firstname: 'Dinh',
      lastname: 'Tran',
      password: 'dinhtran123',
    });
    user_id = user.id;

    const product: Product = await productStore.create({
      name: 'OrderSpec Product',
      price: 99,
    });

    product_id = product.id;

    order = {
      products: [
        {
          product_id,
          quantity: 5,
        },
      ],
      user_id,
      status: true,
    };
  });

  afterAll(async () => {
    await userStore.delete(user_id);
    await productStore.deleteProduct(product_id);
  });

  it('should add a order', async () => {
    const createdOrder: Order = await createOrder(order);
    expect(createdOrder).toEqual({
      id: createdOrder.id,
      ...order,
    });
    await deleteOrder(createdOrder.id);
  });

  it('should return a list of orders', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderList = await orderStore.getOrder();
    expect(orderList).toEqual([createdOrder]);
    await deleteOrder(createdOrder.id);
  });

  it('should update the order', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderData: OrderInfo = {
      products: [
        {
          product_id,
          quantity: 20,
        },
      ],
      user_id,
      status: false,
    };
    const { products, status } = await orderStore.update(createdOrder.id, orderData);
    expect(products).toEqual(orderData.products);
    expect(status).toEqual(orderData.status);
    await deleteOrder(createdOrder.id);
  });

  it('should remove the order item', async () => {
    const createdOrder: Order = await createOrder(order);
    await deleteOrder(createdOrder.id);
    const orderList = await orderStore.getOrder();
    expect(orderList).toEqual([]);
  });
});
