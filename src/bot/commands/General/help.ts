import { Command, Arg, Bot, types, Util } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor (client: Bot) {
    super(client, {
      name: "help",
      aliases: ["commands", "cmds"],
      category: "General",
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
   * @returns {Promise<types.ICommandOptsDone>} The success status object
   * @public
   */
  public async run(msg: Message, { command, args, flags }: types.ICommandOptsRun): Promise<types.ICommandOptsDone> {
    const commands = msg.client.cmd.commands;
    const embed = msg.embed();

    if (!args[0]) {
      const categories: Array<string> = [... new Set(commands.map(cmd => cmd.opts.category.toLowerCase()))];
      for (const category of categories) {
        const categoryCommands = commands.filter(cmd => cmd.opts.category.toLowerCase() === category);
        if (!categoryCommands) continue;

        embed.addField(`${msg.emoji(category)} ${Util.capitalise(category)}`, categoryCommands.map(c => `\`${c.opts.name}\``).join(", "));
      }

      await msg.channel.send(embed);
      return { done: true };
    } else {

    }
  }
}
