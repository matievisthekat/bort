import { Command, Arg, Bort } from "../../../lib/";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bort) {
    super(client, {
      name: "test",
      description: "A test command",
      botPerms: ["SEND_MESSAGES"],
      userPerms: ["SEND_MESSAGES"],
      args: [new Arg("hello", true), new Arg("test")],
      __filename
    });
  }

  public async run(msg: Message, [command, args, flags]) {
    await msg.channel.send("Test Worked!");
  }
}
