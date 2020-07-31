import { EventEmitter } from "events";
import { Collection, Message } from "discord.js";
import { Util, Command, Bot, CommandRunOptions } from "../../";

export class CommandManager extends EventEmitter {
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, Command> = new Collection();

  constructor(private client: Bot, private dir: string) {
    super(...arguments);
  }

  /**
   * get
   * @param {String} name The name or alias of the command to get
   * @returns The found command or undefined
   * @public
   */
  public get(name: string): Command | undefined {
    return this.commands.get(name) ?? this.aliases.get(name);
  }

  /**
   * load
   * @retruns A collection of commands
   * @public
   */
  public load(): Collection<string, Command> {
    const files = Util.findNested(this.dir);
    for (const file of files) this.loadCommand(file);

    this.emit("ready", this.commands);
    return this.commands;
  }

  /**
   * unloadCommand
   * @param {String} path The file path of the command
   * @returns The success status of unloading the command
   * @public
   */
  public unloadCommand(path: string): boolean {
    const cmd = this.commands.find((c) => c.opts.__filename === path);
    if (!cmd) return false;

    delete require.cache[cmd.opts.__filename];
    this.commands.delete(cmd.opts.name);
    cmd.removeAllListeners();

    return true;
  }

  /**
   * loadCommand
   * @param {String} path The file poth of the command
   * @returns The loaded command or the sucess status of loading the command
   * @public
   */
  public loadCommand(path: string): Command | boolean {
    const required = require(path);
    if (!required || !required.default || typeof required.default !== "function") return false;

    const cmd = new required.default(this.client);
    if (!cmd.opts.name) return false;

    this.commands.set(cmd.opts.name, cmd);
    cmd.on("run", (msg: Message, { command, args, flags }: CommandRunOptions) => {
      command.cooldown.set(msg.author.id, Date.now());
    });

    if (cmd.opts.aliases && Array.isArray(cmd.opts.aliases)) cmd.opts.aliases.map((a: string) => this.aliases.set(a, cmd));

    return cmd;
  }
}
