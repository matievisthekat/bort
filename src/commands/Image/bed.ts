
import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "bed",
      description: "Call someone the monster under your bed",
      category: "Image",
      examples: ["@MatievisTheKat#4975"],
      args: [new Arg("user", "The user to target", true)],
      botPerms: ["ATTACH_FILES"],
      cooldown: "",
      __filename
    });
  }

  /**
   * @param {Message} msg The message that fired this command
   * @param {object} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {Array<string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<CommandResult>} The success status object
   * @public
   */
  public async run(msg: Message, { command, args, flags }: CommandRunOptions): Promise<CommandResult> {
    const target = msg.mentions.users.first() || msg.client.users.cache.get(args[0]);
    if (!target) return await msg.warn("Please provide a valid target!");

    try {
      const res = await Util.getImg("bed", {
        avatar: msg.author.displayAvatarURL({ size: 128, format: "png" }),
        target: target.displayAvatarURL({ size: 128, format: "png" })
      }).catch(async (err) => {
        msg.client.logger.error(err);
        await msg.warn(`Unexpected error: ${err.message}`);
      });
      if (!res) return;

      await msg.channel.send("", {
        files: [
          {
            name: "Bed.png",
            attachment: res
          }
        ]
      });
      return { done: true };
    } catch (err) {
      msg.client.logger.error(err);
      await msg.warn(`Unexpected error: ${JSON.parse(err).message}`);
    }
  }
}
