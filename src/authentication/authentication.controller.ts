import bcrypt, { hash } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import userModel from '../services/users/user.model';
import Controller from '../interfaces/controller.interface';
import User from '../services/users/user.interface';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import createUserDto from '../services/users/user.dto';
import validationMiddleware from '../middleware/validation.middleware';
import LogInDto from './login.dto';
import HTTP401Exception from '../exceptions/HTTP401Exception';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from 'interfaces/dataStoredInToken.interface';
import jwt from 'jsonwebtoken';
export default class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = userModel;
  constructor() {
    this.initalizeRoutes();
  }

  private initalizeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(createUserDto),
      this.registeration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.login
    );
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private registeration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userData: createUserDto = request.body;
      const isUserExists = await this.user.findOne({ email: userData.email });
      if (isUserExists) {
        return next(
          new UserWithThatEmailAlreadyExistsException(userData.email)
        );
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      const tokenData = this.createToken(user);
      console.log(user);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(user);
    } catch (error) {
      response.send(error);
    }
  };

  private login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const loginData: LogInDto = request.body;
    const user = await userModel.findOne({ email: loginData.email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatch) {
        const tokenData = this.createToken(user);
        user.password = undefined;
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new HTTP401Exception());
      }
    } else {
      next(new HTTP401Exception());
    }
  };

  private logout = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-Age:0']);
    response.sendStatus(200);
  };

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
