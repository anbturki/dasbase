import express, { Application, Router } from 'express';
import 'dotenv/config';
import { exitOnError } from './utils';
import { createServer, Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import ormOptions from './config/typeorm';
import {
  clientError,
  serverError,
  notFoundError,
} from './middleware/error.middleware';
import controllerInterface from './interfaces/controller.interface';
import { EventEmitter } from 'events';

// Exit when an error occurs
exitOnError();
export class Server extends EventEmitter {
  public app: Application;
  private httpServer: HTTPServer;
  private readonly DEFAULT_PORT: number =
    <number>(<unknown>process.env.PORT) || 4444;

  constructor(controllers: controllerInterface[]) {
    super();
    this.intialize();
    // this.controllersHandler(controllers);
    this.initializeErrorHandling();
  }

  /**
   * Create an Express instance.
   * Create http server.
   * Call the middlewares intializer
   * Connect to the database
   */
  private intialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.initializeMiddlewares();
    this.connectToDatabase();
  }

  /**
   * Initialize middlewares
   */
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  /**
   * Create typeorm connection
   */
  private connectToDatabase() {
    return createConnection(ormOptions)
      .then(async (connection) => {
        this.emit('onDatabaseConnect', connection);
      })
      .catch(console.error);
  }

  private controllersHandler(controllers: controllerInterface[]): void {
    (controllers || []).forEach((controller: controllerInterface) => {
      this.app.use(controller.router);
    });
  }

  /**
   * Initialize error handling middlewares
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundError);
    this.app.use(clientError);
    this.app.use(serverError);
  }

  /**
   * Start server instance.
   * @param callback
   */

  public listen(callback?: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT);
    console.log(
      `Application up and running on http://localhost:${this.DEFAULT_PORT}`,
    );
    if (callback) {
      callback(this.DEFAULT_PORT);
    }
  }
}
