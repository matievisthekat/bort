const Command = require('../../structures/base/Command')
const { xpForLevel, xpUntilNextLevel } = require('../../structures/util/util')
const ProgressBar = require('../../structures/util/ProgressBar')

module.exports = class Level extends Command {
  constructor () {
    super({
      name: 'level',
      aliases: ['xp'],
      category: 'Core',
      description: 'View the level of a user or yourself',
      usage: '<user>',
      examples: ['@MatievisTheKat', '', '492708936290402305'],
      cooldown: '4s',
      requiresArgs: false,
      guildOnly: true,
      currency: true
    })
  }

  async run (msg, args, flags) {
    const target = await msg.client.resolve(
      'user',
      args.join(' ') || msg.author.toString()
    )
    if (!target) return msg.client.errors.invalidTarget(msg, msg.channel)

    const currentLevel = msg.author.currency.level
    const currentXp = msg.author.currency.xp

    const levelXp = xpForLevel(currentLevel)
    const xpToGo = xpUntilNextLevel(currentLevel, currentXp)

    const percent = Math.floor((xpToGo * 100) / levelXp)

    const progress = new ProgressBar(percent)

    const embed = new msg.client.Embed()
      .setAuthor(target.tag, target.displayAvatarURL())
      .addField(
        'Currency Rank',
        `**Level:** ${currentLevel}\n**Experience:** ${currentXp}\n**Progress:** (${percent}%)\n${progress.bar}`
      )
      .setFooter(`Requested by ${msg.author.tag}`)

    return msg.channel.send(embed)
  }
}
