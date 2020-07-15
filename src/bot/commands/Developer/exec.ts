import { Command, Arg, Bot, util, types } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "exec",
      aliases: ["execute"],
      description: "Execute a terminal command",
      examples: ["node -v"],
      args: [new Arg("command", "The command(s) to execute", true)],
      devOnly: true,
      __filename
    });
  }

  public async run(msg: Message, { command, args, flags }: types.ICommandRun) {
    const options = {
      split: {
        char: "\n",
        prepend: "```\n",
        append: "```"
      }
    };

    const res = await util.execute(args.join(" "));

    for (const output of Object.entries(res)) {
      if (output[1]) await msg.channel.send(`**${output[0].title()}**\n\`\`\`\n${output[1]}\`\`\``, options);
    }

    await msg.success("Command successfully run");

    return { done: true };
  }
}
