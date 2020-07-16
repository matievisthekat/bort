import { Client } from "discord.js";
import { CommandManager } from "./managers/CommandManager";
import { EventManager } from "./managers/EventManager";
import { Logger } from "./Logger";
import { IBot, IConfig } from "../types";

export class Bot extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;
  public logger: Logger;
  public readonly prefix: string;
  public readonly devs: Array<string>;
  public readonly config: IConfig;

  constructor(baseOpts: object, opts: IBot) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;
    this.config = opts.config;

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
