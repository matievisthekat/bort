import { Bot, util } from "../../lib";
import { Router } from "express";

export interface RouteOptions {
  path: string;
}

export interface IResponse {
  status: util.HTTPStatusCode;
  error?: any;
  message?: any;
  data?: any;
}

export class Response {
  public status: util.HTTPStatusCode;
  public statusText: string;
  public error: any = null;
  public message: any = null;
  public data: any = null;

  constructor(info: IResponse) {
    this.status = info.status;
    this.statusText = util.Util.httpCodes[this.status];
    this.error = info.error;
    this.message = info.message;
    this.data = info.data;
  }
}

export class Route {
  public client: Bot;
  public router: Router;
  public path: string;

  constructor(client: Bot, opts: RouteOptions) {
    this.client = client;
    this.path = opts.path;
    this.router = Router();
  }

  public load(router: Router): Router {
    router.get("/", (req, res) => res.json({ message: "Hello World" }));
    return router;
  }
}
