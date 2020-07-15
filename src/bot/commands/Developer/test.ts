import { Command, Bot, types } from "../../../lib/";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "test",
      description: "A test command",
      botPerms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
      userPerms: ["SEND_MESSAGES"],
      cooldown: "10s",
      __filename
    });
  }

  public async run(msg: Message, { command, args, flags }: types.ICommandRun) {
    await msg.channel.send("Test Worked!");

    return { done: true };
  }
}
