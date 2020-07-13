import { EventEmitter } from "events";
import { Collection } from "discord.js";
import { Command } from "../base/Command";
import { Bort } from "../Client";
import { findNested } from "../util/findNested";

export class CommandManager extends EventEmitter {
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, Command> = new Collection();

  constructor(private client: Bort, private dir: string) {
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
    const files = findNested(this.dir);
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

    const cmd = new required.default(this.client);
    if (!cmd.opts.name) return false;

    this.commands.set(cmd.opts.name, cmd);

    if (cmd.opts.aliases && Array.isArray(cmd.opts.aliases))
      cmd.opts.aliases.map((a: string) => this.aliases.set(a, cmd));

    return cmd;
  }
}
