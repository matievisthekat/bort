module.exports = class Command {
  constructor ({
    name = undefined,
    aliases = undefined,
    category = 'Miscellaneous',
    description = 'No description found',
    usage = '',
    examples = undefined,
    flags = undefined,
    cooldown = '3s',
    guildOnlyCooldown = false,
    requiresArgs = true,
    requiredPerms = undefined,
    requiredClientPerms = undefined,
    guildOnly = true,
    creatorOnly = false,
    voiceChannelOnly = false,
    currency = false,
    disabled = false
  }) {
    this.disabled = disabled

    this.help = {
      name: name,
      aliases: aliases,
      category: category,
      description: description,
      usage: usage,
      examples: examples,
      flags: flags
    }

    this.config = {
      cooldown: cooldown,
      guildOnlyCooldown: guildOnlyCooldown,
      requiresArgs: requiresArgs,
      requiredPerms: requiredPerms,
      requiredClientPerms: requiredClientPerms,
      guildOnly: guildOnly,
      creatorOnly: creatorOnly,
      voiceChannelOnly: voiceChannelOnly,
      currency: currency
    }
  }

  async run (msg, args, flags) {
    msg.client.logger.warn('Command not implemented')
  }
}
