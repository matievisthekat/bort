import { Command, Arg, Bot } from "../../../lib/";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "test",
      description: "A test command",
      botPerms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
      userPerms: ["SEND_MESSAGES"],
      __filename
    });
  }

  public async run(msg: Message, [command, args, flags]) {
    await msg.channel.send("Test Worked!");
  }
}
