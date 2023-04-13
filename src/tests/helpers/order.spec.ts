/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { OrderInfo, OrderStore } from '../../models/order';
import { ProductInfo } from '../../models/product';
import { UserInfo } from '../../models/user';
import app from '../../server';

const request = supertest(app);

describe('Order Handler', () => {
  let token: string;

  beforeAll(async () => {
    const userData: UserInfo = {
      username: 'Dinh Tran',
      firstname: 'Dinh',
      lastname: 'Tran',
      password: 'dinhtran123',
    };

    const productData: ProductInfo = {
      name: 'Vest',
      price: 888,
    };

    const { body: userBody } = await request.post('/user/create').send(userData);
    token = userBody;

    spyOn(OrderStore.prototype, 'create').and.returnValue(
      Promise.resolve({
        id: 1,
        products: [
          {
            product_id: 5,
            quantity: 5,
          },
        ],
        user_id: 3,
        status: true,
      })
    );

    spyOn(OrderStore.prototype, 'update').and.returnValue(
      Promise.resolve({
        id: 2,
        products: [
          {
            product_id: 5,
            quantity: 5,
          },
        ],
        user_id: 3,
        status: false,
      })
    );
  });

  it('should create order endpoint', async (done) => {
    const res = await request
      .post('/order/create')
      .set('Authorization', 'Bearer ' + token)
      .send({
        id: 1,
        products: [
          {
            product_id: 5,
            quantity: 5,
          },
        ],
        user_id: 3,
        status: true,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      products: [
        {
          product_id: 5,
          quantity: 5,
        },
      ],
      user_id: 3,
      status: true,
    });
    done();
  });

  it('should not create order endpoint because missing param', async (done) => {
    const res = await request
      .post('/order/create')
      .set('Authorization', 'Bearer ' + token)
      .send({
        id: 1,
        user_id: 3,
        status: true,
      });

    expect(res.status).toBe(400);
    done();
  });

  it('gets the index endpoint', async (done) => {
    request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('should gets the read endpoint', async (done) => {
    request
      .get(`/order/1`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('should gets the delete endpoint', async (done) => {
    request
      .delete(`/order/2`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
