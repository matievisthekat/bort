import { Client, ClientOptions } from "discord.js";
import { CommandManager, EventManager, Logger, types, Database } from "../";

export class Bot extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;
  public logger: Logger;
  public db: Database;
  public readonly prefix: string;
  public readonly devs: Array<string>;
  public readonly config: types.IConfig;

  constructor(baseOpts: ClientOptions, opts: types.IBotOpts) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;
    this.config = opts.config;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
    this.db = new Database(opts.database, opts.database.onStartUp);
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
    await this.db.load();

    return await super.login(this.token);
  }
}
