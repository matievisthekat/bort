import { Route, Response } from "../structures/Route";
import { Bot, Util } from "../../lib";

export default class extends Route {
  constructor(client: Bot) {
    super(client, {
      path: "/categories",
      description: "Information and lists of the categories of commands for bort",
      subPaths: [
        {
          route: "/",
          description: "A list of command categories",
          method: "get",
          run: (req, res): unknown => {
            const commands = Util.getCleanCommands(this.client);
            const categories = [...new Set(commands.map((c) => c.opts.category))];
            const status = categories.length > 0 ? 200 : 404;

            if (status !== 200) {
              return res.status(status).json(
                new Response({
                  status,
                  error: "No categories were found",
                })
              );
            }

            res.status(status).json(
              new Response({
                status,
                message: "GET /categories/:name for the commands in a specific category",
                data: categories,
              })
            );
          },
        },
        {
          route: "/:name",
          description: "Get the commands in a specific category",
          method: "get",
          run: (req, res): unknown => {
            const commands = Util.getCleanCommands(this.client);
            const categoryCommands = commands.filter(
              (c) => c.opts.category.toLowerCase() === req.params.name.toLowerCase()
            );
            const status = categoryCommands.size > 0 ? 200 : 404;

            if (status !== 200) {
              return res.status(status).json(
                new Response({
                  status,
                  error: "No commands in that category were found",
                })
              );
            }

            res.status(status).json(
              new Response({
                status,
                message: "GET /commands/:name for more info on a specific command",
                data: categoryCommands.array(),
              })
            );
          },
        },
      ],
    });
  }
}
