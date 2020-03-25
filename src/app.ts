import { Server } from './server';
import validateEnv from './utils/validateEnv';
import postController from './services/posts/post.controller';
validateEnv();

const server = new Server([new postController()]);

server.app.get('/', (req, res) => {
  res.send({ name: 'test' });
});

server.listen();
