import { Command, Arg, Bot, types } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "help",
      aliases: ["commands", "cmds"],
      description: "View all the commands for this bot",
      examples: ["ping", "Music"],
      args: [new Arg("command|category", "The command or category to search for")],
      cooldown: "3s",
      __filename
    });
  }

  /**
   * run
   * @param {Message} msg The message that fired this command
   * @param {object} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {Array<string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<types.ICommandDone>} The success status object
   * @public
   */
  public async run(msg: Message, { command, args, flags }: types.ICommandRun): Promise<types.ICommandDone> {
    return { done: true };
  }
}
