import {
  Client,
  ClientOptions,
  Guild,
  Role,
  User,
  GuildMember,
  UserResolvable,
  Constructable,
  Message,
  GuildChannel,
} from "discord.js";
import { CommandManager, EventManager, Logger, Database, BotOptions, Embed } from "../";
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
  public readonly Embed: Constructable<Embed> = Embed;

  constructor(baseOpts: ClientOptions, opts: BotOptions) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
    this.db = new Database(opts.database);
    this._api = new APIClient(this, opts.api);
    this.logger = new Logger();
  }

  /**
   * @returns The result of logging in
   * @public
   */
  public async load() {
    let success = true;
    let error = null;

    try {
      this.cmd.load();
      this.evnt.load();
      this._api.load();

      await this.db.load();
      await super.login(this.token);
    } catch (err) {
      success = false;
      error = err;
    }

    return [success, error];
  }

  /**
   * @param {String} value The value to search for
   * @returns {Promise<User|GuildMember|void>}
   * @public
   */
  public async getUserOrMember(value: string, guild?: Guild): Promise<User | GuildMember | void> {
    value = value.toLowerCase();
    const regex = /[\\<>@!]/g;

    const res = guild
      ? guild.members.cache.find(
          (m) =>
            m.user.id === value.replace(regex, "") ||
            m.displayName.toLowerCase().includes(value) ||
            m.user.username.toLowerCase().includes(value)
        )
      : this.users.cache.find((u) => u.id === value.replace(regex, "") || u.username.toLowerCase().includes(value));

    return res || (guild ? await guild.members.fetch(value).catch(() => {}) : this.users.fetch(value).catch(() => {}));
  }

  /**
   * @param {String} value The value to search for
   * @param {Guild} guild The guild to search in
   * @returns {Promise<Role|void>}
   * @public
   */
  public async getRole(value: string, guild: Guild): Promise<Role | void> {
    value = value.toLowerCase();
    const regex = /[\\<>&]/g;

    const res = guild.roles.cache.find(
      (r) => r.id === value.replace(regex, "") || r.name.toLowerCase().includes(value)
    );

    return res || (await guild.roles.fetch(value).catch(() => {}));
  }

  /**
   * @param {"category" | "text" | "voice" | "news" | "store"} type The channel type to search for
   * @param {String} value The value to search for
   * @param {Guild} guild The guild to search in
   * @returns {GuildChannel|void}
   * @public
   */
  public getChannel(
    type: "category" | "text" | "voice" | "news" | "store",
    value: string,
    guild: Guild
  ): GuildChannel | void {
    value = value.toLowerCase();
    const regex = /[\\<>#]/g;

    const res = guild.channels.cache
      .filter((c) => c.type === type)
      .find((c) => c.id === value.replace(regex, "") || c.name.toLowerCase().includes(value));

    return res;
  }

  public async handleProcessError(err: Error | any): Promise<Message | void> {
    this.logger.error(err.stack);

    const token = process.env["webhooks.error.token"];
    const id = process.env["webhooks.error.id"];
    const webhook = await this.fetchWebhook(id, token).catch((err) => this.logger.error(err.stack));
    if (!webhook)
      return this.logger.warn(`No error webhook was found using these credentials: TOKEN="${token}", ID="${id}"`);

    const embed = new this.Embed().red.setAuthor(err.name).setDescription(`\`\`\`\n${err.stack}\`\`\``).setTimestamp();
    return await webhook.send(embed);
  }
}
