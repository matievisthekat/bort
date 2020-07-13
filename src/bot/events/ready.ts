import { CustomEvent } from "../../lib/structures/base/Event";
import { Bort } from "../../lib";
import * as chalk from "chalk";

export default class Ready extends CustomEvent {
  constructor(client: Bort) {
    super(client, {
      name: "ready",
      __filename
    });
  }

  run(client: Bort) {
    return client.logger.info(
      `Logged in as ${chalk.cyan(client.user.tag)} with ${
        client.guilds.cache.size
      } guilds`
    );
  }
}
