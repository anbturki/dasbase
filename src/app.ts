import { Server } from './server';
import validateEnv from './utils/validateEnv';
import PostController from './services/posts/post.controller';
import AuthenticationController from './authentication/authentication.controller';
validateEnv();

const server = new Server([
  new AuthenticationController(),
  new PostController(),
]);

server.app.get('/', (req, res) => {
  res.send({ name: 'test' });
});

server
  .on('beforeListen', (arg) => {
    console.log('before server runs.');
  })
  .listen();
