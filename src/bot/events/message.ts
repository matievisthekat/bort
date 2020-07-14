import { CustomEvent } from "../../lib";
import { Bort } from "../../lib";
import { Message } from "discord.js";

export default class Ready extends CustomEvent {
  constructor(client: Bort) {
    super(client, {
      name: "message",
      __filename
    });
  }

  async run(client: Bort, msg: Message): Promise<any> {
    if (
      !msg.guild ||
      msg.webhookID ||
      msg.author.bot ||
      !msg.content.startsWith(client.prefix)
    )
      return false;

    const [rawCommand, ...rawArgs] = msg.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/gi);

    const flags = {};
    const flagArgs = rawArgs.filter((a) => a.startsWith("--"));
    const args = rawArgs.filter((a) => !a.startsWith("--"));
    const command = client.cmd.get(rawCommand);
    flagArgs.map((flag) => (flags[flag] = true));

    if (command) {
      if (command.opts.devOnly && !client.devs.includes(msg.author.id))
        return await msg.warn("That command is locked to developers only!");

      const botPerms = command.opts.botPerms ?? "SEND_MESSAGES";
      const userPerm = command.opts.userPerms ?? "SEND_MESSAGES";

      if (!msg.guild.me.hasPermission(botPerms))
        return await msg.warn(
          `I am missing one or more of the following permissions to execute that command: ${botPerms}`
        );

      await command.run(msg, [command, args, flags]);
      return true;
    }
  }
}
