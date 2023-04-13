import { Application, Request, Response } from 'express';
import { verifyToken, getTokenByUser } from '../utils/helpers';
import { User, UserStore } from '../models/user';

const userStore = new UserStore();

const getAll = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userStore.getAll();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const firstname = req.body.firstname as unknown as string;
    const lastname = req.body.lastname as unknown as string;
    const username = req.body.username as unknown as string;
    const password = req.body.password as unknown as string;

    if (!firstname || !lastname || !username || !password) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :firstName, :lastName, :userName, :password'
      );
      return false;
    }
    const user: User = await userStore.create({
      firstname,
      lastname,
      username,
      password,
    });

    res.json(getTokenByUser(user));
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      return res.status(400).send('Missing required parameter :id.');
    }
    const user: User = await userStore.show(id);
    
    res.json(user);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const firstname = req.body.firstname as unknown as string;
    const lastname = req.body.lastname as unknown as string;
    const password = req.body.password as unknown as string;
    if (!firstname || !lastname || !id || ! password) {
      res.status(400);
      res.send(
        'Please provide a valid input for param eg. :firstName, :lastName, :id'
      );
      return false;
    }
    const user: User = await userStore.update(id, {
      firstname,
      lastname,
      password
    });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send('Please provide a valid input for :id.');
      return false;
    }
    await userStore.delete(id);
    res.send(`User is delete successfully.`);
  } catch (err) {
    res.status(400).json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = (req.body.username as unknown as string) || 'DinhTran';
    const password = (req.body.password as unknown as string) || 'dinhtran123';
    if (!username || !password) {
      res.status(400);
      res.send(
        'Please provide a valid input for param eg. :username, :password'
      );
      return false;
    }
    const user: User | null = await userStore.authenticate(username, password);
    if (!user) {
      return res.status(401).send(`Invalid username or password`);
    }
    res.json(getTokenByUser(user));
  } catch (err) {
    res.status(400).json(err);
  }
};

export default function userRoutes(app: Application) {
  app.get('/users', getAll);
  app.post('/user/create', create);
  app.get('/user/:id', show);
  app.put('/user/:id', verifyToken, update);
  app.delete('/user/:id', verifyToken, deleteUser);
  app.post('/user/authenticate', authenticate);
}
