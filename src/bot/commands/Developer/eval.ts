import { Command, Arg, Bot, types } from "../../../lib";
import { inspect } from "util";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "eval",
      aliases: ["evaluate", "ev"],
      description: "Evaluate some code",
      examples: ['msg.client.emit("ready");'],
      args: [new Arg("code", "The code to evaluate", true)],
      devOnly: true,
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
    const options = {
      split: {
        char: "\n",
        prepend: "```js\n",
        append: "```"
      }
    };

    const match = args[0].match(/:(depth)=(\w+)/gm);
    const depth = match ? match[0]?.split("=")[1] : null;

    let code = args.slice(match ? 1 : 0).join(" ");
    if (code.includes("await")) code = `(async () => {${code}})();`;

    const result = new Promise((resolve, rejec) => resolve(eval(code)));
    result
      .then(async (output: any) => {
        output = inspect(output, false, depth ? parseInt(depth) : 1);

        if (!flags.silent) await msg.channel.send("```js\n" + output + "```", options);
      })
      .catch(async (err: any) => {
        await msg.channel.send("```js\n" + err + "```", options);
      });

    return { done: true };
  }
}
