import { App } from './App';
import UserController from './modules/user/UserController';

const app = new App([new UserController()]);

app.listen();
