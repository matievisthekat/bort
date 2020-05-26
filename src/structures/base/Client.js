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
  ErrorManager = require("../managers/Error"),
  CommandManager = require("../managers/Command"),
  EventManager = require("../managers/Event"),
  BlacklistManager = require("../managers/Blacklist"),
  CurrencyManager = require("../managers/Currency"),
  WebManager = require("../../web/structures/Manager"),
  Logger = require("../util/Logger"),
  Translator = require("./Translator");

const MessageProps = require("../../structures/base/Message"),
  UserProps = require("../../structures/base/User.js"),
  GuildProps = require("../../structures/base/Guild");

module.exports = class Bort extends Client {
  constructor(options = {}) {
    super(options);

    // Dunno why these structures don't work without doing this
    this.props = {
      Message: MessageProps,
      User: UserProps,
      Guild: GuildProps
    };

    // Initialize the custom API manager
    this.web = new WebManager();

    // Assign properties
    this.token = options.token;
    this.uri = options.uri;
    this.commandDir = options.commandDir;
    this.eventDir = options.eventDir;
    this.prefix = options.prefix;
    this.loadMusic = options.loadMusic;
    this.translateAPIKey = options.translateAPIKey;

    // Initialize the snipeMessages collection to hold deleted messages for ~3 seconds
    this.snipeMessages = new Collection();

    // Require constants and utilities
    this.colours = require("../../constants/colours");
    this.emoji = require("../../constants/emoji");
    this.models = require("../../constants/models");
    this.embed = require("./Embed");
    this.util = require("../util/util");
    this.config = require("../../config");

    // Initialize helper classes
    this.logger = new Logger();
    this.translator = new Translator(this, this.translateAPIKey);
    this.errors = new ErrorManager(this);
    this.currency = new CurrencyManager(this);
    this.blacklist = new BlacklistManager(this);
    this.cmd = new CommandManager(this);
    this.evnt = new EventManager(this);

    // Initialize DBL client
    this.dbl = new dblClient(
      process.env.TOP_GG_API_TOKEN,
      {
        webhookPort: this.config.dblWebhookPort,
        webhookAuth: process.env.TOP_GG_WEBHOOK_AUTH,
        webhookPath: `/api/${this.config.apiVersion}/webhooks/vote`
      },
      this
    );

    // GET request for available langauges
    this.web.app.get(`/api/${this.config.apiVersion}/langauges`, (req, res) => {
      const langs = this.translator.langs;
      res.send({ langs }).status(200);
    });

    // GET request for all guilds the client is in
    this.web.app.get(`/api/${this.config.apiVersion}/guilds`, (req, res) =>
      res.send({ guilds: this.guilds.cache.array() }).status(200)
    );

    // Get request for mutual servers with a specific user
    this.web.app.get(
      `/api/${this.config.apiVersion}/guilds/mutual/:userID`,
      async (req, res) => {
        const userID = req.params.userID;
        let guilds = [];
        for (const guild of this.guilds.cache.array()) {
          const member = await guild.members.fetch(userID).catch(() => {});
          if (member) guilds.push(guild);
        }

        res.send({ guilds }).status(200);
      }
    );

    // GET request for a specific guild
    this.web.app.get(
      `/api/${this.config.apiVersion}/guilds/:guildID`,
      (req, res) => {
        const guildID = req.params.guildID;
        const guild = this.guilds.cache.get(guildID);

        res.send({ guild }).status(200);
      }
    );

    // GET request for roles from a guild
    this.web.app.get(
      `/api/${this.config.apiVersion}/guilds/:guildID/roles`,
      (req, res) => {
        const guildID = req.params.guildID;
        const guild = this.guilds.cache.get(guildID);
        if (!guild)
          return res.send({ roles: [], error: "No guild found with that ID" });

        res.send({ roles: guild.roles.cache.array() }).status(200);
      }
    );

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

  /**
   * Remove a set prefix from the database
   * @param {Model} [data] The model of data for the prefix
   */
  async unloadPrefix(data) {
    if (!data.guildID || !data.prefix || !data)
      throw new Error("Bort#unloadPrefix must have mongodb data");

    await data.delete();

    return true;
  }

  /**
   * Enter a custom prefix for a guild
   * @param {String} [guildID] The ID of the guild to load a prefix for
   * @param {String} [prefix] The prefix to set
   */
  async loadPrefix(guildID, prefix) {
    if (!guildID || !prefix)
      throw new Error(
        "Bort#loadPrefix must have a guildID and prefix paramaters"
      );

    const data =
      (await this.models.prefix.findOne({ guildID })) ||
      new this.models.prefix({
        guildID
      });

    data.prefix = prefix;
    await data.save();

    return {
      message: `Successfully loaded the prefix ${prefix} for ${guildID}`,
      status: 200
    };
  }

  /**
   * Resolve for a user, member, channel, role or guild
   * @param {String} [type] To resolve for a user, guild, channel, role or member
   * @param {String} [value] The value to search with
   * @param {Guild} [guild] The guild to search in
   */
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

  /**
   * Reload the client without logging in
   */
  reload() {
    this.logger.warn("Force full reload");

    this.init(false);

    return { message: "Successfully reloaded", status: 200 };
  }

  /**
   * Initialize the client
   * @param {Boolean} [login] Whether to login when initializing or not
   * @param {Boolean} [loadWeb] Whether to load the custom API or not
   */
  async init(login = false, loadWeb = true) {
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

  /**
   * Initialize a connection with the MongoDB database
   */
  async connect() {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.logger.log("Connected to database");

    return { message: "Successfully connected to MongoDB", status: 200 };
  }
};
