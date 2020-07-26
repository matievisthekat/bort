import { EventEmitter } from "events";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Bot } from "../lib";

export interface IAPIManager {
  port?: number;
  auth: string;
  development?: boolean;
}

export class APIManager extends EventEmitter {
  private client: Bot;
  public port: number;
  public auth: string;
  public development: boolean;
  public app;

  constructor (client: Bot, opts: IAPIManager) {
    super();

    this.client = client;
    this.development = opts.development ?? false;
    this.port = opts.port ?? 3000;
    this.auth = opts.auth;

    const app = express();
    this.app = app;

    app.use(morgan(this.development ? "dev" : "common"));
    app.use(cors());
  };

  /**
   * @returns {Promise<APIManager>} This manager
   * @public
   */
  public async load(): Promise<APIManager> {
    await this.app.listen(this.port, () => this.emit("ready", this.app));
    return this;
  }
}