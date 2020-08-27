import { CustomEvent, Bot } from "../../lib";

export default class Ready extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "ready",
      __filename,
    });
  }

  run(client: Bot): void {
    return client.logger.log(`Logged in as ${client.user.tag} with ${client.guilds.cache.size} guilds`);
  }
}
