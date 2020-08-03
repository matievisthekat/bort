
import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "colour",
      aliases: ["color"],
      description: "Get an image of a colour",
      category: "Image",
      examples: ["#fffff", "red"],
      args: [new Arg("colour", "The colour to get an image of", true)],
      botPerms: ["ATTACH_FILES"],
      cooldown: "15s",
      __filename
    });
  }

  /**
   * @param {Message} msg The message that fired this command
   * @param {object} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {Array<string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<CommandResult | Message>} The success status object
   * @public
   */
  public async run(msg: Message, { command, args, flags }: CommandRunOptions): Promise<CommandResult | Message> {
    const color = args.join(" ");
    if (color.length > 20) return await msg.warn("Maximum length exceded! Please keep your text to less than 20 characters");

    try {
      const res = await Util.getImg("color", { color }).catch(async (err) => {
        msg.client.logger.error(err);
        await msg.warn(`Unexpected error: ${JSON.parse(err).message}`);
      });
      if (!res) return;

      await msg.channel.send("", {
        files: [
          {
            name: "Colour.png",
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
