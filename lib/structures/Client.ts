import { Client, ClientOptions, Guild, Role, User, GuildMember, UserResolvable } from "discord.js";
import { CommandManager, EventManager, Logger, Database, BotOptions, TargetType, TargetResult } from "../";
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

  constructor (baseOpts: ClientOptions, opts: BotOptions) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;

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

  /**
   * Resolve for a role, user, channel or member
   * @param {TargetType} type The type to resolve for
   * @param {String} value The value to search for
   * @param {Guild} guild The guild to search in (when needed)
   */
  public async resolve(type: TargetType, value: string, guild?: Guild): Promise<TargetResult> {
    if (!value) return null;

    value = value.toLowerCase();
    switch (type) {
      case "user":
        let user: void | User = this.users.cache.find(
          u =>
            u.username.toLowerCase().includes(value) ||
            u.id === value.replace(/[\\<>@!]/g, "") ||
            u.id === value
        );

        if (!user) user = await this.users.fetch(value).catch(() => { });
        return user || null;
      case "member":
        let member: void | GuildMember = guild.members.cache.find(
          m =>
            m.user.username.toLowerCase().includes(value) ||
            m.user.id === value.replace(/[\\<>@!]/g, "") ||
            m.displayName.toLowerCase().includes(value) ||
            m.user.id === value
        );

        if (!member) member = await guild.members.fetch(value).catch(() => { });
        return member || null;
      case "category":
        const category = guild.channels.cache
          .filter(chan => chan.type === "category")
          .find(
            chan =>
              chan.name.toLowerCase().includes(value) ||
              chan.id === value.replace(/[\\<>#]/g, "") ||
              chan.id === value
          );
        return category || null;
      case "textChannel":
        const textChannel = guild.channels.cache
          .filter(chan => chan.type === "text")
          .find(
            chan =>
              chan.name.toLowerCase().includes(value) ||
              chan.id === value.replace(/[\\<>#]/g, "") ||
              chan.id === value
          );
        return textChannel || null;
      case "voiceChannel":
        const voiceChannel = guild.channels.cache
          .filter(chan => chan.type === "voice")
          .find(
            chan =>
              chan.name.toLowerCase().includes(value) ||
              chan.id === value
          );
        return voiceChannel || null;
      case "role":
        let role: void | Role = guild.roles.cache.find(
          r =>
            r.name.toLowerCase().includes(value) ||
            r.id === value.replace(/[\\<>@&]/g, "") ||
            r.id === value
        );

        if (!role) role = await guild.roles.fetch(value).catch(() => { });
        return role || null;
      default:
        return null;
    }
  }
}
