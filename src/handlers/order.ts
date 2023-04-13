import { Application, Request, Response } from 'express';
import { verifyToken } from './../utils/helpers';
import { Order, OrderProduct, OrderStore } from '../models/order';

const OrderStoreInstance = new OrderStore();

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders: Order[] = await OrderStoreInstance.getOrder();
    res.json(orders);
  } catch (err) {
    console.log(err)
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;

    if (!products || !status || !user_id) {
      res.status(400);
      res.send(
        'Please provide a valid input for param :products, :status, :user_id'
      );
      return false;
    }

    const order: Order = await OrderStoreInstance.create({
      products,
      status,
      user_id,
    });

    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
    console.log(e);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }

    const order: Order = await OrderStoreInstance.read(id);
    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;

    if (!products || !status || !user_id || !id) {
      res.status(400);
      res.send(
        'Please provide a valid input for param :products, :status, :user_id, :id'
      );
      return false;
    }

    const order: Order = await OrderStoreInstance.update(id, {
      products,
      status,
      user_id,
    });

    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }

    await OrderStoreInstance.deleteOrder(id);

    res.send(`Order successfully deleted.`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

export default function orderRoutes(app: Application) {
  app.get('/orders', verifyToken, getAllOrders);
  app.post('/order/create', verifyToken, create);
  app.get('/order/:id', verifyToken, show);
  app.put('/order/:id', verifyToken, update);
  app.delete('/order/:id', verifyToken, deleteOrder);
}
