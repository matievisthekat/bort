import { Bot, util } from "../../lib";
import { Router } from "express";

export interface RouteOptions {
  path: string;
}

export interface Response {
  statusCode: util.HTTPStatusCode;
  status: string;
  error?: any;
  message?: string;
  data?: any;
}


export class Route {
  public client: Bot;
  public router: Router;
  public path: string;

  constructor (client: Bot, opts: RouteOptions) {
    this.client = client;
    this.path = opts.path;
    this.router = Router();
  }

  public load(router: Router): Router {
    router.get("/", (req, res) => res.json({ message: "Hello World" }));
    return router;
  }
}