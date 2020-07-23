const Command = require('../../structures/base/Command')

module.exports = class Afk extends Command {
  constructor () {
    super({
      name: 'afk',
      aliases: ['afl'],
      category: 'Utility',
      description: 'Set yourself as AFK',
      usage: '<reason>',
      examples: ['my grandma is over'],
      flags: ['nonick'],
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const reason = args.join(' ') || 'AFK'
    const afk = new msg.client.models.Afk({
      userID: msg.author.id,
      reason: reason.replace(/@/gi, '@\u200b'),
      startTime: Date.now()
    })

    if (!flags.nonick) {
      msg.member
        .setNickname(`[AFK] ${msg.member.displayName || msg.author.username}`)
        .catch(() => {})
    }

    msg.channel.send(
      msg.success(
        `I have set your AFK: **${reason.replace(/@/gi, '@\u200b')}**`
      )
    )

    afk.save().catch((err) => {
      msg.client.logger.error(err, true)
      msg.client.errors.saveFailr(msg, msg, err)
    })
  }
}
