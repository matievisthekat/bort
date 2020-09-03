import { Bot, util, HTTPMethod, HTTPStatusCode } from "../../lib";
import { Router, Request, Response as ExpressResponse } from "express";

export interface RouteOptions {
  path: string;
  description: string;
  subPaths: Array<SubPath>;
}

export interface ReponseInterface {
  status: HTTPStatusCode;
  error?: unknown;
  message?: unknown;
  data?: unknown;
}

export class Response {
  public status: HTTPStatusCode;
  public statusText: string;
  public error: unknown;
  public message: unknown;
  public data: unknown;

  constructor(info: ReponseInterface) {
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
  public subPaths: Array<SubPath>;

  constructor(client: Bot, opts: RouteOptions) {
    this.client = client;
    this.path = opts.path;
    this.router = Router();
    this.subPaths = opts.subPaths;

    for (const path of opts.subPaths) {
      this.router[path.method](path.route, path.run);
    }
  }
}

export interface SubPath {
  route: string;
  method: HTTPMethod;
  description: string;
  run(req: Request, res: ExpressResponse): unknown;
}
