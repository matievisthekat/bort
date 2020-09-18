/* eslint-disable indent */
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
import { CommandManager, EventManager, Logger, Database, BotOptions, Embed, Song, Util } from "../";
import { APIClient } from "../../api";
import YouTube from "simple-youtube-api";
import ms from "ms";
import ytdl from "ytdl-core";

export class Bot extends Client {
  public readonly evnt: EventManager;
  public readonly cmd: CommandManager;
  public readonly logger = new Logger();
  public readonly db: Database;
  public readonly _api: APIClient;
  public readonly Util = Util;
  public readonly prefix: string;
  public readonly devs: UserResolvable[];
  public readonly Embed: Constructable<Embed> = Embed;
  public readonly yt: YouTube;

  constructor(baseOpts: ClientOptions, opts: BotOptions) {
    super(baseOpts);

    this.token = opts.token;
    this.prefix = opts.prefix;
    this.devs = opts.devs;

    this.evnt = new EventManager(this, opts.eventDir);
    this.cmd = new CommandManager(this, opts.commandDir);
    this.db = new Database(opts.database);
    this._api = new APIClient(this, opts.api);
    this.yt = new YouTube(opts.yt.key);
  }

  /**
   * @returns The result of logging in
   * @public
   */
  public async load(): Promise<unknown[]> {
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

    return res || (guild ? guild.members.fetch(value).catch(() => null) : this.users.fetch(value).catch(() => null));
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

    return res || guild.roles.fetch(value).catch(() => null);
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

  public async songSearch(query: string, limit = 10): Promise<Song[]> {
    const results = await this.yt.searchVideos(query, limit);
    if (results.length < 1) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const info = await ytdl.getBasicInfo(res.url);

      results[i] = new Song({
        title: res.title,
        description: res.description,
        publishedAt: res.publishedAt,
        channel: res.channel.name,
        duration: parseInt(info.videoDetails.lengthSeconds) * 1000,
        url: res.url,
      });
    }

    return results;
  }

  public async selectSong(msg: Message, songs: Song[]): Promise<Song | null> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res) => {
      if (songs.length === 1) return songs[0];
      let song: Song = null;

      const collector = msg.channel.createMessageCollector((m) => m.author.id === msg.author.id, {
        time: ms("1m"),
      });

      await msg.send(
        "success",
        new this.Embed()
          .setDescription(songs.map((s, i) => `[\`${i + 1}\`] - ${s.title}`).join("\n"))
          .setFooter("Please select a song | Type 'cancel' to cancel | You have 1 minute")
      );

      collector.on("collect", async (m) => {
        if (/(cancel|cancle)/gi.test(m.content)) return collector.stop("Cancelled by author");
        const index = parseInt(m.content);
        song = songs[index];
        if (!index || !song) return await msg.send("warn", "Please supply a valid index selection");

        collector.stop("Song selected");
      });

      collector.on("end", async (collected, reason) => {
        if (!song) return await msg.send("warn", `Song selection has ended: \`${reason ?? "Timed out"}\``);
        else res(song);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async handleProcessError(err: Error | any): Promise<Message | void> {
    console.error(err);
    this.logger.error("Unhandled error. There should be additional logging above");

    const token = process.env["webhooks.error.token"];
    const id = process.env["webhooks.error.id"];
    const webhook = await this.fetchWebhook(id, token).catch((caught) => this.logger.error(caught.stack));
    if (!webhook)
      return this.logger.warn(`No error webhook was found using these credentials: TOKEN="${token}", ID="${id}"`);

    const embed = new this.Embed().red.setAuthor(err.name).setDescription(`\`\`\`\n${err.stack}\`\`\``).setTimestamp();
    return webhook.send(embed);
  }
}
