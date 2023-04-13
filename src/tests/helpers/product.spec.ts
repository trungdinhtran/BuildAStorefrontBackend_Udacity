import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { ProductInfo } from '../../models/product';
import { UserInfo } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Product Handler', () => {
  const product: ProductInfo = {
    name: 'Basil Barramunda',
    price: 29,
  };

  let token: string, userId: number;

  beforeAll(async () => {
    const userData: UserInfo = {
      username: 'Dinh Tran',
      firstname: 'Dinh',
      lastname: 'Tran',
      password: 'dinhtran123',
    };

    const { body } = await request.post('/user/create').send(userData);
    token = body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(body, SECRET);
    userId = user.id;
  });

  afterAll(async () => {
    await request.delete(`/user/${userId}`).set('Authorization', 'bearer ' + token);
  });

  it('gets the create endpoint', async (done) => {
    const res = await request
      .post('/product/create')
      .send(product)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('can not create product because missing param', async (done) => {
    const res = await request
      .post('/product/create')
      .send({
        price: 29,
      })
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(400);
    done();
  });

  it('gets the index endpoint', async (done) => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
    done();
  });

  it('gets the read endpoint', async (done) => {
    const res = await request.get(`/product/2`);
    expect(res.status).toBe(200);
    done();
  });

  it('gets the update endpoint', async (done) => {
    const newProductData: ProductInfo = {
      ...product,
      name: 'Shoes',
      price: 234,
    };
    const res = await request
      .put(`/product/1`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('can not update product because missing param', async (done) => {
    const res = await request
      .put(`/product/1`)
      .send({
        price: 234,
      })
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(400);
    done();
  });

  it('gets the delete endpoint', async (done) => {
    const res = await request.delete(`/product/2`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
    done();
  });
});
