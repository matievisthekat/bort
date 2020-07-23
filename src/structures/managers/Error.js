module.exports = class ErrorManager {
  constructor (client) {
    this.client = client
    this.prefix = this.client.config.msgPrefixes.error
  }

  /**
   * @param {Message} [message] The message where the error occured
   * @param {DMChannel|TextChannel} [channel] The channel to respond in
   * @param {String} [msg] The message to send
   */
  async custom (msg, channel, message) {
    return channel.send(await msg.translate(`${this.prefix} ${message}`))
  }

  /**
   * @param {Message} [msg] The mesasge where the error occured
   */
  async unknownErr (msg) {
    msg.channel.send(
      await msg.translate(
        `${this.prefix} There was an unexpected error. If this continues please contact ${msg.client.config.creators.tags[0]}`
      )
    )
  }

  async saveFail (msg) {
    msg.channel.send(
      await msg.translate(
        `${this.prefix} There was an error saving your data. This error has been automaticaly reported to the developers! Please try again.`
      )
    )
  }

  /**
   * Send an error to tell the user that the command may only be used in a guild
   * @param {Message} [message] The message where the error occured
   * @param {DMChannel|TextChannel} [channel] The channel to respond in
   */
  async guildOnly (message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} Due to the function of that command it may only be used in a server and **not** direct messages!`
      )
    )
  }

  /**
   * Send an error to tell the user that the command may only be used by a creator
   * @param {Message} [message] The message where the error occured
   * @param {DMChannel|TextChannel} [channel] The channel to respond in
   */
  async creatorOnly (message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} That command is only accessable by developers!`
      )
    )
  }

  /**
   *
   * @param {Message} [message] The message where the error occured
   * @param {DMChannel|TextChannel} [channel] The channel to respond in
   * @param {String} [startTime] The time the cooldown was set
   * @param {String} [cooldown] The cooldown of the command
   */
  async cooldown (message, channel, startTime, cooldown) {
    const ms = require('ms')
    const time = ms(ms(cooldown) - (Date.now() - startTime), { long: true })
    channel.send(
      await message.translate(
        `${this.prefix} The cooldown for that command has not expired. Please wait **${time}** before using it again!`
      )
    )
  }

  /**
   * Send an error to inform the user that they did not provide the required arguments
   * @param {Message} message The message where the error occured
   * @param {Guild} guild The guild to fetch the prefix from
   * @param {DMChannel|TextChannel} channel The channel to respond in
   * @param {String} commandName The name of the run command
   */
  async noArgs (message, guild, channel, commandName) {
    const prefix = await this.client.models.Prefix.findOne({
      guildID: guild ? guild.id : ''
    })
    channel.send(
      await message.translate(
        `${this.prefix} That command requires arguments! Correct usage \`${
        prefix ? prefix.prefix : this.client.prefix
        }${commandName} ${
        this.client.cmd.commands.get(commandName).help.usage
        }\``
      )
    )
  }

  async invalidArgs (message, guild, channel, commandName) {
    const prefix = await this.client.models.Prefix.findOne({
      guildID: guild ? guild.id : ''
    })
    channel.send(
      await message.translate(
        `${this.prefix} Invalid arguments! Correct usage \`${
        prefix ? prefix.prefix : this.client.prefix
        }${commandName} ${
        this.client.cmd.commands.get(commandName).help.usage
        }\``
      )
    )
  }

  async invalidTarget (message, channel) {
    channel.send(
      await message.translate(
        `${this.client.config.msgPrefixes.warning} I could not get a target for that command! Please try again!`
      )
    )
  }

  async noClientPerms (message, msg, permissions) {
    if (permissions.includes('SEND_MESSAGES')) {
      msg.author.send(
        await message.translate(
          `${this.prefix} I do not have the \`${
          permissions.length ? permissions.join(', ') : permissions
          }\` permission(s) to execute that command. Please make sure I have the right permissions in **${
          msg.guild.name
          }**!`
        )
      )
    } else {
      msg.channel.send(
        await message.translate(
          `${this.prefix} I do not have the \`${
          permissions.length ? permissions.join(', ') : permissions
          }\` permission(s) to execute that command. Please make sure I have the right permissions and that the target member's role is below my role!`
        )
      )
    }
  }

  async noPerms (message, channel, permission) {
    channel.send(
      await message.translate(
        `${this.prefix} You are lacking the \`${permission}\` permission(s) to use that command!`
      )
    )
  }

  async voiceChannelOnly (message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} That command may only be run while you are in a voice channel!`
      )
    )
  }
}
