import { Command, Bot, types, Arg } from "../../../lib/";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "test",
      category: "Developer",
      description: "A test command",
      botPerms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
      userPerms: ["SEND_MESSAGES"],
      args: [new Arg("test", "A test"), new Arg("another test", "another test arg", true)],
      cooldown: "10s",
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
   * @returns {Promise<types.ICommandOptsDone>} The success status object
   * @public
   */
  public async run(msg: Message, { command, args, flags }: types.ICommandOptsRun): Promise<types.ICommandOptsDone> {
    await msg.channel.send("Test Worked!");

    return { done: true };
  }
}
