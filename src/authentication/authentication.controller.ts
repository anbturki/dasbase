import bcrypt, { hash } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import userModel from '../services/users/user.model';
import Controller from '../interfaces/controller.interface';
import User from '../services/users/user.interface';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import createUserDto from '../services/users/user.dto';
import validationMiddleware from '../middleware/validation.middleware';
import LogInDto from './login.dto';
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
  }

  private async registeration(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: createUserDto = request.body;
      const isUserExists = await userModel.findOne({ email: userData.email });
      if (isUserExists) {
        next(new UserWithThatEmailAlreadyExistsException(userData.email));
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      response.send({ hashedPassword });
      const user = await userModel.create({
        ...userData,
        password: hashedPassword,
      });
      response.send(user);
    } catch (error) {
      response.send(error);
    }
  }

  private async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const loginData: LogInDto = request.body;
    const user = await userModel.findOne({ email: loginData.email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatch) {
        response.send(user);
      }
    }
  }
}
