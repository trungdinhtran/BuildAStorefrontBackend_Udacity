import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import { UserInfo } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('User Handler', () => {
  const userData: UserInfo = {
    username: 'Dinh Tran',
    firstname: 'Tran',
    lastname: 'Dinh ',
    password: 'dinhtran123',
  };

  let token: string,
    userId = 1;

  it('should gets the create endpoint', async (done) => {
    const res = await request.post('/user/create').send(userData);

    const { body, status } = res;
    token = body;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    userId = user.id;

    expect(status).toBe(200);
    done();
  });

  it('should gets the index endpoint', async (done) => {
    const res = await request.get('/users').set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the read endpoint', async (done) => {
    const res = await request.get(`/user/${userId}`).set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the update endpoint', async (done) => {
    const newUserData: UserInfo = {
      ...userData,
      firstname: 'Dinh',
      lastname: 'Tran',
    };

    const res = await request
      .put(`/user/${userId}`)
      .send(newUserData)
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the auth endpoint', async (done) => {
    const res = await request
      .post('/user/authenticate')
      .send({
        username: userData.username,
        password: userData.password,
      })
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the auth endpoint with wrong password', async (done) => {
    const res = await request
      .post('/user/authenticate')
      .send({
        username: userData.username,
        password: 'testpassword',
      })
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(401);
    done();
  });

  it('should get the delete endpoint', async (done) => {
    try{
      const res = await request.delete(`/user/${userId}`).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200);
      done();
    }catch {

    }
  });
});
