import { Router, Request, Response, NextFunction } from 'express';
import SignupDto from './Signup.dto';
import LoginDto from './Login.dto';
import validationMiddleware from '../../middleware/validation.middleware';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import User from './User';
import HTTP401Exception from '../../exceptions/HTTP401Exception';
// tslint:disable-next-line import-name
import jwt from 'jsonwebtoken';
class UserController {
  public router: Router = Router();
  path: string = '/auth';

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post(
      '/auth/login',
      validationMiddleware(LoginDto),
      this.login.bind(this),
    );
    this.router.post(
      '/auth/signup',
      validationMiddleware(SignupDto),
      this.singup.bind(this),
    );
  }

  private async login(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { email, password }: LoginDto = request.body;
    const user = await User.findOne({ email });
    // user with the provided credentials does not exist
    if (!user) {
      return this.unAuthenticated(next);
    }
    // validate password
    const isMatch = await User.comparePassword(password, user.password);
    // invalid password
    if (!isMatch) {
      return this.unAuthenticated(next);
    }
    // Generate jsonwebtoken
    const token = await jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY as string,
    );
    // return token alogn side the user
    return response.json({ token, user: user.toJSON() });
  }

  private async singup(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { email, password, name }: SignupDto = request.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return next(new UserWithThatEmailAlreadyExistsException(email));
    }
    const user = await User.create({ email, password, name });
    response.json(user.toJSON());
  }

  // pass un authenticated error to NextFunction
  private unAuthenticated(next: NextFunction) {
    return next(new HTTP401Exception());
  }
}

export default UserController;
