import { Route } from "../structures/Route";
import { Bot, Command } from "../../lib";
import { Router } from "express";
import { Collection } from "discord.js";

export default class extends Route {
  constructor (client: Bot) {
    super(client, {
      path: "/commands"
    });
  }

  public load(router: Router): Router {
    router.get("/", (req, res) => {
      const commands = new Collection<string, Command>();
      this.client.cmd.commands.array().forEach((cmd) => commands.set(cmd.opts.name, cmd));
      commands.forEach(cmd => delete cmd.client);

      res.json(commands.array());
    });
    return router;
  }
}