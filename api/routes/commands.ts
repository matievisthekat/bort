import { Route } from "../structures/Route";
import { Bot } from "../../lib";
import { Router } from "express";

export default class extends Route {
  constructor (client: Bot) {
    super(client, {
      path: "/commands"
    });
  }

  public load(router: Router): Router {
    router.get("/", (req, res) => res.json({ message: "HI" }));
    return router;
  }
}