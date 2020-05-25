const {
    Client,
    Collection,
    Guild,
    GuildMember,
    User,
    Channel,
    Role
  } = require("discord.js"),
  dblClient = require("dblapi.js"),
  mongoose = require("mongoose"),
  Models = require("../../constants/models"),
  Emojis = require("../../constants/emoji"),
  Colours = require("../../constants/colours"),
  Embed = require("./Embed"),
  ErrorManager = require("../managers/Error"),
  CommandManager = require("../managers/Command"),
  EventManager = require("../managers/Event"),
  BlacklistManager = require("../managers/Blacklist"),
  CurrencyManager = require("../managers/Currency"),
  WebManager = require("../../web/structures/Manager"),
  Util = require("../util/util"),
  Logger = require("../util/Logger"),
  Translator = require("./Translator"),
  config = require("../../config");

const MessageProps = require("../../structures/base/Message"),
  UserProps = require("../../structures/base/User.js"),
  GuildProps = require("../../structures/base/Guild");

module.exports = class Bort extends Client {
  constructor(options = {}) {
    super(options);

    this.props = {
      Message: MessageProps,
      User: UserProps,
      Guild: GuildProps
    };

    this.web = new WebManager();

    this.token = options.token;
    this.uri = options.uri;
    this.commandDir = options.commandDir;
    this.eventDir = options.eventDir;
    this.prefix = options.prefix;
    this.loadMusic = options.loadMusic;
    this.translateAPIKey = options.translateAPIKey;

    this.snipeMessages = new Collection();
    this.guildPrefixes = new Collection();
    this.blacklists = new Set();

    this.colours = Colours;
    this.emoji = Emojis;
    this.models = Models;
    this.embed = Embed;
    this.util = Util;
    this.config = config;

    this.logger = new Logger();
    this.translator = new Translator(this, this.translateAPIKey);
    this.errors = new ErrorManager(this);
    this.currency = new CurrencyManager(this);

    this.voteLogWebhook = null;

    this.cmd = new CommandManager({
      directory: this.commandDir,
      client: this
    });

    this.evnt = new EventManager({
      directory: this.eventDir,
      client: this
    });

    this.dbl = new dblClient(
      process.env.TOP_GG_API_TOKEN,
      {
        webhookPort: this.config.dblWebhookPort,
        webhookAuth: process.env.TOP_GG_WEBHOOK_AUTH,
        webhookPath: `/api/${this.config.apiVersion}/webhooks/vote`
      },
      this
    );

    this.blacklist = new BlacklistManager({
      client: this,
      model: this.models.blacklist,
      channelID: "697123744816300064"
    });

    this.web.app.get(`/api/${this.config.apiVersion}/langauges`, (req, res) => {
      const langs = this.translator.langs;
      res.send({ langs }).status(200);
    });

    // this.web.app.post(
    //   `api/${this.config.apiVersion}/webhooks/vote`,
    //   (req, res) => {
    //     this.logger.info("Webhook POST request received");
    //     // if (req.headers["Authorization"] !== process.env.TOP_GG_WEBHOOK_AUTH)
    //     //   return res.sendStatus(403);

    //     if (this.voteLogWebhook) {
    //       const user = this.users.cache.get(req.body.user);
    //       this.voteLogWebhook.send(
    //         `${user || "Unknown"} ${
    //           user ? `**(${user.tag})**` : ""
    //         } has just voted for <@${req.body.bot}>`
    //       );
    //     }
    //   }
    // );
  }

  async unloadPrefix(data) {
    if (!data.guildID || !data.prefix || !data)
      throw new Error("Bort#unloadPrefix must have mongodb data");

    await data.delete();

    return true;
  }

  async loadPrefix(options = {}) {
    if (!options.guildID || !options.prefix)
      throw new Error(
        "Bort#loadPrefix must have a guildID and prefix paramaters"
      );

    const data =
      (await this.models.prefix.findOne({ guildID: options.guildID })) ||
      new this.models.prefix({
        guildID: options.guildID
      });

    data.prefix = options.prefix;
    await data.save();

    return {
      message: `Successfully loaded the prefix ${options.prefix} for ${options.guildID}`,
      status: 200
    };
  }

  async resolve(type, value, guild) {
    if (!value) return null;
    value = value.toLowerCase();
    switch (type.toLowerCase()) {
      case "member":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof GuildMember) return value;
        const fetchedMember = guild.members.cache.find(
          (m) =>
            m.user.username.toLowerCase().includes(value) ||
            m.user.tag.toLowerCase().includes(value) ||
            m.id === value.replace(/[\\<>@!]/g, "")
        );
        return fetchedMember
          ? (await guild.members.fetch(fetchedMember.id)) || null
          : null;
      case "user":
        if (value instanceof User) return value;
        let fetchedUser = this.users.cache.find(
          (u) =>
            u.username.toLowerCase().includes(value) ||
            u.tag.toLowerCase().includes(value) ||
            u.id === value.replace(/[\\<>@!]/g, "")
        );
        try {
          if (!fetchedUser) fetchedUser = await this.users.fetch(value);
        } catch {}

        return fetchedUser || null;
      case "channel":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof Channel) return value;
        const fetchedChannel = guild.channels.cache.find(
          (c) =>
            c.name.toLowerCase().includes(value) ||
            c.id === value.replace(/[\\<>#]/g, "")
        );
        return fetchedChannel || null;
      case "role":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof Role) return value;
        const fetchedRole = guild.roles.cache.find(
          (r) =>
            r.name.toLowerCase().includes(value) ||
            r.id === value.replace(/[\\<>@&]/g, "")
        );
        return fetchedRole || null;
      default:
        return null;
    }
  }

  reload() {
    this.logger.warn("Force full reload");

    this.init({ login: false });

    return { message: "Successfully reloaded", status: 200 };
  }

  async init({ login = false, loadWeb = true }) {
    this.cmd.load();
    this.evnt.load();
    await this.translator.load().then((res) => this.logger.log(res.message));
    await this.connect();

    if (loadWeb) this.web.init();
    if (login) await this.login(this.token);

    try {
      this.voteLogWebhook = await this.fetchWebhook(
        process.env.VOTE_LOGS_WEBHOOK_ID,
        process.env.VOTE_LOGS_WEBHOOK_TOKEN
      );
    } catch (err) {
      this.logger.error(`Failed to fetch vote log webhook: ${err}`);
    }

    return { message: "Successfully initialized", status: 200 };
  }

  async connect() {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.logger.log("Connected to database");

    return { message: "Successfully connected to MongoDB", status: 200 };
  }
};
