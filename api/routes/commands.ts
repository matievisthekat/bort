import { Route, Response } from "../structures/Route";
import { Bot, Command, Util } from "../../lib";
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
      const commands = this.commands;
      res.status(200).json({
        statusCode: 200,
        status: Util.httpCodes[200],
        data: commands.array()
      });
    });

    router.get("/search", (req, res) => {
      const query = req.query.q as string;
      if (!query) return res
        .status(400).json({
          statusCode: 400,
          status: Util.httpCodes[400],
          error: "You need to provide a query (q) to search with"
        });

      const [prop, value] = query.split(":");
      if (!prop || !value) return res
        .status(400).json({
          statusCode: 400,
          status: Util.httpCodes[400],
          error: "Incorrectly constructed query. Please follow the format: 'prop:query', for example: 'category:general', 'aliases:cmds', 'devOnly:false'. Refer to the documentation for more information"
        });

      const commands = this.commands.array().filter(cmd => cmd.opts[prop]?.toString().toLowerCase().includes(value.toLowerCase()));

      const statusCode = commands.length > 0 ? 200 : 404;
      const response: Response = {
        statusCode,
        status: Util.httpCodes[statusCode]
      };

      if (commands.length <= 0) response.message = "No commands were found";
      else response.data = commands;

      res.status(statusCode).json(response);
    });

    router.get("/:name", (req, res) => {
      const name = req.params.name;
      const commands = this.commands;
      const command = commands.get(name) || commands.find(cmd => cmd.opts.aliases?.includes(name));
      if (!command) return res
        .status(404)
        .json({
          statusCode: 404,
          status: Util.httpCodes[404],
          error: "No command with that name was found!"
        });

      res.status(200).json({
        statusCode: 200,
        status: Util.httpCodes[200],
        data: command
      });
    });

    return router;
  }

  get commands(): Collection<string, Command> {
    const commands = new Collection<string, Command>();
    this.client.cmd.commands.array().forEach((cmd: Command) => commands.set(cmd.opts.name, cmd));
    commands.forEach(cmd => {
      delete cmd.client;
      delete cmd.opts.__filename;
    });
    return commands;
  }
}