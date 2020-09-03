/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
import { Route } from "../structures/Route";
// @ts-ignore
import { Bot } from "../../lib";
import { Router } from "express";

export default class extends Route {
  constructor(client: Bot) {
    super(client, {
      path: "",
    });
  }

  public load(router: Router): Router {
    return router;
  }
}
