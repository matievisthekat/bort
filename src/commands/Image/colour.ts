
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
    return await Util.imageCommand("color", msg, args, 128, true, false, false, 20);
  }
}
