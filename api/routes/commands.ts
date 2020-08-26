import { Route, Response } from "../structures/Route";
import { Bot, Util } from "../../lib";

export default class extends Route {
  constructor(client: Bot) {
    super(client, {
      path: "/commands",
      description: "Information and lists of commands for bort",
      subPaths: [
        {
          route: "/",
          description: "A list of commands with their current cooldowns for each user",
          method: "get",
          run: (req, res) => {
            const commands = Util.getCleanCommands(this.client);
            res.status(200).json(
              new Response({
                status: 200,
                message: "Get /commands/:name for more info of a specific command",
                data: commands.array(),
              })
            );
          },
        },
        {
          route: "/search",
          description: "Search for a command",
          method: "get",
          run: (req, res) => {
            const query = req.query.q as string;
            if (!query)
              return res.status(400).json(
                new Response({
                  status: 400,
                  error: "You need to provide a query (q) to search with",
                })
              );

            const [prop, value] = query.split(":");
            if (!prop || !value)
              return res.status(400).json(
                new Response({
                  status: 400,
                  error:
                    "Incorrectly constructed query. Please follow the format: 'prop:query', for example: 'category:general', 'aliases:cmds', 'devOnly:false'. Refer to the documentation for more information",
                })
              );

            const commands = Util.getCleanCommands(this.client)
              .array()
              .filter((cmd) => cmd.opts[prop]?.toString().toLowerCase().includes(value.toLowerCase()));

            const status = commands.length > 0 ? 200 : 404;

            if (status !== 200) {
              return res.status(status).json(
                new Response({
                  status,
                  error: "No commands were found",
                })
              );
            }

            res.status(status).json(
              new Response({
                status,
                message: "Get /commands/:name for more info of a specific command",
                data: commands,
              })
            );
          },
        },
        {
          route: "/:name",
          description: "Get information on a specific command",
          method: "get",
          run: (req, res) => {
            const name = req.params.name;
            const commands = Util.getCleanCommands(this.client);
            const command = commands.get(name) || commands.find((cmd) => cmd.opts.aliases?.includes(name));
            if (!command)
              return res.status(404).json(
                new Response({
                  status: 404,
                  error: "No command with that name was found!",
                })
              );

            res.status(200).json(
              new Response({
                status: 200,
                data: command,
              })
            );
          },
        },
      ],
    });
  }
}
