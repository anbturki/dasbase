import { Server } from './server';
import validateEnv from './utils/validateEnv';
validateEnv();

const server = new Server();

server.listen();
