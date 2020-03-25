import express, { Application, Router } from 'express';
import 'dotenv/config';
import { createServer, Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error.middleware';
import controllerInterface from './interfaces/controller.interface';
export class Server {
  public app!: Application;
  private httpServer!: HTTPServer;
  private readonly DEFAULT_PORT: number =
    <number>(<unknown>process.env.PORT) || 4444;

  constructor(controllers: controllerInterface[]) {
    this.intialize();
    this.controllersHandler(controllers);
    this.initializeErrorHandling();
  }

  private intialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.initializeMiddlewares();
    this.connectToDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private connectToDatabase() {
    const { MONGO_PATH } = process.env;
    mongoose
      .connect(`${MONGO_PATH}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("mongodb's connection established.");
      })
      .catch(console.error);
  }

  private controllersHandler(controllers: controllerInterface[]): void {
    controllers.forEach((controller: controllerInterface) => {
      this.app.use(controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public listen(callback?: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT);
    console.log(
      `Application up and running on http://localhost:${this.DEFAULT_PORT}`
    );
    if (callback) {
      callback(this.DEFAULT_PORT);
    }
  }
}
