import bcrypt, { hash } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
// import Controller from '../interfaces/controller.interface';
// import User from '../services/users/user.interface';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
// import createUserDto from '../services/users/user.dto';
import validationMiddleware from '../middleware/validation.middleware';
// import LogInDto from './login.dto';
import HTTP401Exception from '../exceptions/HTTP401Exception';
// import TokenData from '../interfaces/tokenData.interface';
// import DataStoredInToken from 'interfaces/dataStoredInToken.interface';
// import jwt from 'jsonwebtoken';
export default class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  constructor() {
    this.initalizeRoutes();
  }

  private initalizeRoutes(): void {
    this.router.post(`${this.path}/register`, this.registeration);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private registeration = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {};

  private login = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {};

  private logout = (request: Request, response: Response) => {};

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = <string>process.env.SECRET_KEY;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
  }
}
