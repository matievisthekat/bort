import { EventEmitter } from "events";
import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { Bot, Util } from "../../lib";

export interface APIOptions {
  port?: number;
  auth: string;
  development?: boolean;
  routes: string;
}

export class APIManager extends EventEmitter {
  private client: Bot;
  private routes: string;
  public port: number;
  public auth: string;
  public development: boolean;
  public app: Express;

  constructor (client: Bot, opts: APIOptions) {
    super();

    this.client = client;
    this.development = opts.development ?? false;
    this.port = opts.port ?? 3000;
    this.auth = opts.auth;
    this.routes = opts.routes;

    const app = express();
    this.app = app;

    app.use(morgan(this.development ? "dev" : "common"));
    app.use(cors());
  };

  /**
   * @returns {APIManager} This manager
   * @public
   */
  public load(): APIManager {
    this.app.listen(this.port, () => this.emit("ready", this.app));
    this.loadRoutes();
    return this;
  }

  private loadRoutes() {
    const files = Util.findNested(this.routes);
    for (const file of files) {
      const route = require(file);
      if (!route || !route.default || typeof route.default !== "function" || !route.path) continue;

      this.app.use(route.path, route.default);
    }
  }
}