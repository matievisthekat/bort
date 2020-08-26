import { Bot, util, HTTPMethod } from "../../lib";
import { Router, Request, Response as ExpressResponse } from "express";

export interface RouteOptions {
  path: string;
  description: string;
  subPaths: Array<SubPath>;
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
  public error: any;
  public message: any;
  public data: any;

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
  run(req: Request, res: ExpressResponse): any;
}
