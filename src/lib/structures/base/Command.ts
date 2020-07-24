import { types, Bot } from "../../";
import { Collection } from "discord.js";
import { EventEmitter } from "events";

export class Arg {
  constructor(public name: string, public desc: string, public required?: boolean) {}

  // Gonna add more methods in here
}

export class Command extends EventEmitter {
  public cooldown: Collection<string, number> = new Collection();

  constructor(private client: Bot, public readonly opts: types.ICommandOpts) {
    super(...arguments);

    this.opts.usage = this.opts.args?.map((a) => `${a.required ? "{" : "<"}${a.name}${a.required ? "}" : ">"}`).join(" ");
  }

  /**
   * run
   * @param {Message} msg The message that triggered this command
   * @param {Command} command The command that was triggered
   * @param {Array<String>} args The arguments this command was run with
   * @param {Object} flags The flags this command was run with
   * @returns A promise
   */
  async run(msg, { command, args, flags }: types.ICommandOptsRun): Promise<any> {
    msg.client.logger.warn(`Command without a run method at ${this.opts.__filename}`);
  }

  /**
   * unload
   * @returns The success status of unloading the command
   * @public
   */
  unload() {
    const res = this.client.cmd.unloadCommand(this.opts.__filename);
    return res;
  }

  /**
   * reload
   * @returns The reloaded command or the sucess status of reloading the command
   * @public
   */
  reload() {
    const unloadRes = this.unload();
    if (!unloadRes) return unloadRes;

    const res = this.client.cmd.loadCommand(this.opts.__filename);
    return res;
  }
}
