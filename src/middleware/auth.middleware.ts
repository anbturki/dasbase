import RequestWithUser from '../interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import userModel from '../services/users/user.model';
import HTTP401Exception from '../exceptions/HTTP401Exception';

export default async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = <string>process.env.SECRET_KEY;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        return next(new HTTP401Exception());
      }
    } catch (error) {
      return next(new HTTP401Exception());
    }
  } else {
    next(new HTTP401Exception('Authentication token missing.'));
  }
}
