import { Route, Response } from "../structures/Route";
import { Bot } from "../../lib";

export default class extends Route {
  constructor(client: Bot) {
    super(client, {
      path: "/",
      description: "Root path. Get help here",
      subPaths: [
        {
          route: "/",
          description: "Get help and endpoints for this API",
          method: "get",
          run: (req, res): unknown => {
            const routes = client._api.routes;
            const data = {};

            for (const route of routes) {
              data[route.path] = {};
              for (const subPath of route.subPaths) {
                data[route.path][`${subPath.method.toUpperCase()} ${subPath.route}`] = subPath.description;
              }
            }

            return res.status(200).json(
              new Response({
                status: 200,
                message: "Help for the official bort API",
                data,
              })
            );
          },
        },
      ],
    });
  }
}
