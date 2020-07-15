import { CustomEvent, Bot } from "../../lib";
import { Message } from "discord.js";

export default class Ready extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "message",
      __filename
    });
  }

  /**
   * run
   * @param {Bot} client The client that received this message
   * @param {Message} msg The message that was sent
   * @returns A promise
   * @public
   */
  public async run(client: Bot, msg: Message): Promise<any> {
    // If the message wasn't in a guild, wasn't send by a human or doesn't start with the prefix then return
    if (
      !msg.guild ||
      msg.webhookID ||
      msg.author.bot ||
      !msg.content.startsWith(client.prefix)
    )
      return false;

    // Get the args and command strings from the message content
    const [rawCommand, ...rawArgs] = msg.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/gi);

    // Define flags, filter args and get the command
    const flags = {};
    const flagArgs = rawArgs.filter((a) => a.startsWith("--"));
    const args = rawArgs.filter((a) => !a.startsWith("--"));
    const command = client.cmd.get(rawCommand);
    flagArgs.map((flag) => (flags[flag.slice(2)] = true));

    if (command) {
      // If the author is not a developer and the command is locked to devOnly send an error
      if (command.opts.devOnly && !client.devs.includes(msg.author.id)) {
        return await msg.warn("That command is locked to developers only!");
      }

      // Get the required permissions for the command. Defaulting to SEND_MESSAGES
      const botPerms = command.opts.botPerms ?? ["SEND_MESSAGES"];
      const userPerms = command.opts.userPerms ?? ["SEND_MESSAGES"];

      // If botPerms doesn't include SEND_MESSAGES push it into the array
      if (!botPerms.includes("SEND_MESSAGES")) {
        botPerms.push("SEND_MESSAGES");
      }

      // Check for permissions in the current guild and channel
      if (
        !msg.guild.me.hasPermission(botPerms) ||
        !msg.guild.me.permissionsIn(msg.channel).has(botPerms)
      ) {
        // If the bot is missing the SEND_MESSAGES permission
        const missingSend = botPerms.includes("SEND_MESSAGES");

        // Send an error message to the current channel or the author's DM channel
        return await msg.warn(
          `I am missing one or more of the following permissions (\`${botPerms}\`) to execute that command ${
            missingSend ? `in **${msg.guild.name}**` : ""
          }`,
          // If the bot is missing SEND_MESSAGES permission it sends a message to the author's DM channel (creating on if it doesn't exist)
          missingSend
            ? msg.author.dmChannel ?? (await msg.author.createDM())
            : msg.channel
        );

        // Check user perms in the current guild and channel
      } else if (
        !msg.member.hasPermission(userPerms) ||
        !msg.member.permissionsIn(msg.channel).has(userPerms)
      ) {
        // Send an error message
        return await msg.warn(
          `You are missing one or more of the following permissions (\`${userPerms}\`) to execute that command`
        );
      }

      // Run the command once all checks are complete
      await command.run(msg, [command, args, flags]);
    }
  }
}
