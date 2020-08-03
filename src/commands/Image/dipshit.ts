
import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "dipshit",
      description: "Get an image correcting your Google search to 'dipshit'. *Did you mean: dipshit*",
      category: "Image",
      examples: ["Creator of TikTok"],
      args: [new Arg("text", "The text content for the image", true)],
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
    const text = args.join(" ");
    if (text.length > 33) return await msg.warn("Maximum length exceded! Please keep your text to less than 33 characters");

    try {
      const res = await Util.getImg("dipshit", { text }).catch(async (err) => {
        msg.client.logger.error(err);
        await msg.warn(`Unexpected error: ${err.message}`);
      });
      if (!res) return;

      await msg.channel.send("", {
        files: [
          {
            name: "Dipshit.png",
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
