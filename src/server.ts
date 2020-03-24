import express, { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
export class Server {
  private app!: Application;
  private httpServer!: HTTPServer;

  constructor() {
    this.intialize();
  }

  private intialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
  }
}
