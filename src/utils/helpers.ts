import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.TOKEN_KEY as Secret;

export const getTokenByUser = (user: User) => {
    console.log(jwt.sign({ user }, SECRET))
  return jwt.sign({ user }, SECRET);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: 'Access denied, invalid token' });
    return false;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};
