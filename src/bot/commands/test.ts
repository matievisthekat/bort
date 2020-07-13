import { Command } from "../../lib/structures/base/Command";

export default class Test extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "A test command",
      botPerms: ["SEND_MESSAGES"],
      userPerms: ["SEND_MESSAGES"],
      __filename
    });
  }
}
