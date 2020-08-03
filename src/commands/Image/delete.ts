
import { Command, Bot, CommandRunOptions, CommandResult, Util, Arg } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "delete",
      description: "Get the delete meme with somsone's avatar",
      category: "Image",
      examples: ["@MatievisTheKat#4975"],
      args: [new Arg("user", "The user to target", true)],
      botPerms: ["ATTACH_FILES"],
      cooldown: "5s",
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
    return await Util.imageCommand("delete", msg, args, 256, false, false, true, 0, true);
  }
}
