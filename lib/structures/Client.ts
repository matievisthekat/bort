import { Client, ClientOptions } from "discord.js";
import { CommandManager, EventManager, Logger, Database, IConfig, BotOptions } from "../";
import { UserResolvable } from "discord.js";
import { APIClient } from "../../api";
import { Util } from "./Util";

export class Bot extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;
  public logger: Logger;
  public db: Database;
  public _api: APIClient;
  public readonly Util = Util;
  public readonly prefix: string;
  public readonly devs: Array<UserResolvable>;
  public readonly config: IConfig;

  constructor (baseOpts: ClientOptions, opts: BotOptions) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;
    this.config = opts.config;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
    this.db = new Database(opts.database, opts.database.onStartUp);
    this._api = new APIClient(this, opts.api);
    this.logger = new Logger();
  }

  /**
   * @returns The result of logging in
   * @public
   */
  public async load() {
    this.cmd.load();
    this.evnt.load();
    this._api.load();
    await this.db.load();

    return await super.login(this.token);
  }
}
