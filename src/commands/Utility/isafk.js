const Command = require('../../structures/base/Command')

module.exports = class IsAfk extends Command {
  constructor () {
    super({
      name: 'isafk',
      aliases: ['afkcheck'],
      category: 'Utility',
      description: 'Check if someone is AFK',
      usage: '{member}',
      examples: ['MatievisTheKat', 'matie', '492708936290402305']
    })
  }

  async run (msg, args, flags) {
    const target = await msg.client.resolve('user', args.join(' '), msg.guild)
    if (!target) return msg.client.errors.invalidTarget(msg, msg.channel)

    const afk = await msg.client.models.Afk.findOne({
      userID: target.id
    })

    if (!afk) return msg.channel.send(msg.warning('That user is not AFK'))

    const time = this.msg.client.util.ms(Date.now() - afk.startTime, {
      long: true
    })
    msg.channel.send(
      msg.success(`That user has been AFK: **${afk.reason}** for ${time}`)
    )
  }
}
