import { Route } from "../structures/Route";
import { Bot } from "../../lib";
import { Router } from "express";

export default class extends Route {
  constructor (client: Bot) {
    super(client, {
      path: "/"
    });
  }

  public load(router: Router): Router {
    return router;
  }
}