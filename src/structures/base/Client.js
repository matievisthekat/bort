const {
  Client,
  Collection,
  Guild,
  GuildMember,
  User,
  Channel,
  Role
} = require('discord.js')
const DblClient = require('dblapi.js')
const AYB = require('ayb-api')
const mongoose = require('mongoose')
const ErrorManager = require('../managers/Error')
const CommandManager = require('../managers/Command')
const EventManager = require('../managers/Event')
const BlacklistManager = require('../managers/Blacklist')
const CurrencyManager = require('../managers/Currency')
const APIManager = require('../managers/API')
const Logger = require('../util/Logger')
const Translator = require('./Translator')

const MessageProps = require('../../structures/base/Message')
const UserProps = require('../../structures/base/User.js')
const GuildProps = require('../../structures/base/Guild')

module.exports = class Bort extends Client {
  constructor (options = {}) {
    super(options)

    // Dunno why these structures don't work without doing this
    this.props = {
      Message: MessageProps,
      User: UserProps,
      Guild: GuildProps
    }

    // Assign properties
    this.token = options.token
    this.uri = options.uri
    this.commandDir = options.commandDir
    this.eventDir = options.eventDir
    this.prefix = options.prefix
    this.loadMusic = options.loadMusic
    this.translateAPIKey = options.translateAPIKey

    // Initialize the snipeMessages collection to hold deleted messages for ~3 seconds
    this.snipeMessages = new Collection()

    // Require constants and utilities
    this.colours = require('../../constants/colours')
    this.emoji = require('../../constants/emoji')
    this.models = require('../../constants/models')
    this.Embed = require('./Embed')
    this.util = require('../util/util')
    this.config = require('../../config')

    // Initialize helper classes
    this.web = new APIManager(this, this.config.api.port)
    this.logger = new Logger()
    this.translator = new Translator(this, this.translateAPIKey)
    this.errors = new ErrorManager(this)
    this.currency = new CurrencyManager(this)
    this.blacklist = new BlacklistManager(this)
    this.cmd = new CommandManager(this)
    this.evnt = new EventManager(this)

    // Initialize DBL client
    this.dbl = new DblClient(process.env.TOP_GG_API_TOKEN, this)
    this.ayb = new AYB(this)
  }

  /**
   * Remove a set prefix from the database
   * @param {Model} data The model of data for the prefix
   */
  async unloadPrefix (data) {
    if (!data.guildID || !data.prefix || !data) { throw new Error('Bort#unloadPrefix must have mongodb data') }

    await data.delete()

    return true
  }

  /**
   * Enter a custom prefix for a guild
   * @param {String} guildID The ID of the guild to load a prefix for
   * @param {String} prefix The prefix to set
   */
  async loadPrefix (guildID, prefix) {
    if (!guildID || !prefix) {
      throw new Error(
        'Bort#loadPrefix must have a guildID and prefix paramaters'
      )
    }

    const data =
      (await this.models.Prefix.findOne({ guildID })) ||
      new this.models.Prefix({
        guildID
      })

    data.prefix = prefix
    await data.save()

    return {
      message: `Successfully loaded the prefix ${prefix} for ${guildID}`,
      status: 200
    }
  }

  /**
   * Resolve for a user, member, channel, role or guild
   * @param {String} type To resolve for a user, guild, channel, role or member
   * @param {String} value The value to search with
   * @param {Guild} guild The guild to search in
   */
  async resolve (type, value, guild) {
    if (!value) return null
    value = value.toLowerCase()

    let fetchedChannel, fetchedMember, fetchedRole, fetchedUser

    switch (type.toLowerCase()) {
      case 'member':
        if (!(guild instanceof Guild)) { throw new Error('Must pass the guild parameter') }
        if (value instanceof GuildMember) return value
        fetchedMember = guild.members.cache.find(
          (m) =>
            m.user.username.toLowerCase().includes(value) ||
            m.user.tag.toLowerCase().includes(value) ||
            m.id === value.replace(/[\\<>@!]/g, '')
        )
        return fetchedMember
          ? (await guild.members.fetch(fetchedMember.id)) || null
          : null
      case 'user':
        if (value instanceof User) return value
        fetchedUser = this.users.cache.find(
          (u) =>
            u.username.toLowerCase().includes(value) ||
            u.tag.toLowerCase().includes(value) ||
            u.id === value.replace(/[\\<>@!]/g, '')
        )
        try {
          if (!fetchedUser) fetchedUser = await this.users.fetch(value)
        } catch { }

        return fetchedUser || null
      case 'channel':
        if (!(guild instanceof Guild)) { throw new Error('Must pass the guild parameter') }
        if (value instanceof Channel) return value
        fetchedChannel = guild.channels.cache.find(
          (c) =>
            c.name.toLowerCase().includes(value) ||
            c.id === value.replace(/[\\<>#]/g, '')
        )
        return fetchedChannel || null
      case 'role':
        if (!(guild instanceof Guild)) { throw new Error('Must pass the guild parameter') }
        if (value instanceof Role) return value
        fetchedRole = guild.roles.cache.find(
          (r) =>
            r.name.toLowerCase().includes(value) ||
            r.id === value.replace(/[\\<>@&]/g, '')
        )
        return fetchedRole || null
      default:
        return null
    }
  }

  /**
   * Reload the client without logging in
   */
  reload () {
    this.logger.warn('Force full reload')

    this.init(false)

    return { message: 'Successfully reloaded', status: 200 }
  }

  /**
   * Initialize the client
   * @param {Boolean} login Whether to login when initializing or not
   * @param {Boolean} loadWeb Whether to load the custom API or not
   */
  async init (login = false, loadWeb = true) {
    this.cmd.load()
    this.evnt.load()
    await this.translator.load().then((res) => this.logger.log(res.message))
    await this.connect()

    if (loadWeb) this.web.init()
    if (login) await this.login(this.token)

    try {
      this.voteLogWebhook = await this.fetchWebhook(
        process.env.VOTE_LOGS_WEBHOOK_ID,
        process.env.VOTE_LOGS_WEBHOOK_TOKEN
      )
    } catch (err) {
      this.logger.error(`Failed to fetch vote log webhook: ${err}`)
    }

    return { message: 'Successfully initialized', status: 200 }
  }

  /**
   * Initialize a connection with the MongoDB database
   */
  async connect () {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.logger.log('Connected to database')

    return { message: 'Successfully connected to MongoDB', status: 200 }
  }

  /**
   * Announce a message
   * @param {Model} data The data for that announcement channel
   * @param {String|MessageEmbed} message The message to send
   */
  async announce (data, message) {
    for (const whData of data.subs) {
      const wh = await this.fetchWebhook(
        whData.id,
        whData.token
      ).catch(() => { })
      if (!wh) continue

      await wh.send(message)
    }
  }
}
