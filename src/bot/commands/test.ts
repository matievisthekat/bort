import { Command, Arg } from "../../lib/structures/base/Command";
import { Message } from "discord.js";

export default class Test extends Command {
  constructor(client) {
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
    console.log(this);
    await msg.channel.send("Test Worked!");
  }
}
