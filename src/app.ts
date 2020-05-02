import express, { Application, Router } from 'express';
import validateEnv from './utils/validateEnv';
validateEnv();
import { exitOnError } from './utils';
import { createServer, Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import {
  clientError,
  serverError,
  notFoundError,
} from './middleware/error.middleware';
import IController from './interfaces/IController';
import { EventEmitter } from 'events';

// Exit when an error occurs
exitOnError();
export class App extends EventEmitter {
  public app: Application;
  private httpServer: HTTPServer;
  private controllers: IController[];
  private readonly DEFAULT_PORT: number =
    ((process.env.PORT as unknown) as number) || 4444;

  constructor(controllers: IController[]) {
    super();
    this.controllers = controllers;
    this.intialize();
  }

  /**
   * Create an Express instance.
   * Create http server.
   * Call the middlewares intializer
   * Connect to the database
   */
  private async intialize() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.initializeMiddlewares();
    await this.connectToDatabase();
    this.controllersHandler();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middlewares
   */
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  /**
   * Create database connection using mongoose or typeorm
   */
  private connectToDatabase() {
    // database type
    if (process.env.DB_TYPE === 'typeorm') {
      return this.createTypeormConnection();
    } else if (process.env.DB_TYPE === 'mongoose') {
      return this.createMongooseConnection();
    }
  }

  private controllersHandler(): void {
    (this.controllers || []).forEach((controller: IController) => {
      this.app.use('/api', controller.router);
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
   * Connect to SQL databses using TYPEORM if DB_TYPE is typeorm.
   */
  private async createTypeormConnection() {
    const typeormImport = await import('typeorm');
    const typeorm = typeormImport.default;
    const typeormOptions = await import('./config/typeorm.config');
    await typeorm.createConnection(typeormOptions.default);
    console.log('type orm connected successfully.');
  }

  /**
   * Connect to mongodb using mongoose if DB_TYPE is mongoose.
   */
  private async createMongooseConnection() {
    const mngos = await import('mongoose');
    const mongoose = mngos.default;
    const mongooseOptions = await import('./config/mongoose.config');
    await mongoose.connect(
      process.env.MONGOOSE_URL as string,
      mongooseOptions.default,
    );
    console.log('mognoodb connected.');
  }

  /**
   * Start server instance.
   * @param callback
   */

  public listen(callback?: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () => {
      console.log(
        `Application up and running on http://localhost:${this.DEFAULT_PORT}`,
      );
      if (callback) {
        callback(this.DEFAULT_PORT);
      }
    });
  }
}
