import { CustomEvent, Bort } from "../../lib";

export default class Ready extends CustomEvent {
  constructor(client: Bort) {
    super(client, {
      name: "ready",
      __filename
    });
  }

  run(client: Bort) {
    return client.logger.log(
      `Logged in as ${client.user.tag} with ${client.guilds.cache.size} guilds`
    );
  }
}
