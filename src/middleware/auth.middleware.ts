import RequestWithUser from '../interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import HTTP401Exception from '../exceptions/HTTP401Exception';

export default async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction,
) {}
