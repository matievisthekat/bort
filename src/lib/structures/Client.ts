import { Client } from "discord.js";
import CommandManager from "./managers/CommandManager";
import EventManager from "./managers/EventManager";
import Logger from "./Logger";
import { IBort } from "../types";

export class Bort extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;
  public logger: Logger;
  public readonly prefix: string;

  constructor(baseOpts: object, opts: IBort) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
    this.logger = new Logger();
  }

  /**
   * load
   * @returns The result of logging in
   * @public
   */
  public async load() {
    this.cmd.load();
    this.evnt.load();

    return await super.login(this.token);
  }
}
