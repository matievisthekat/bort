const Command = require('../../structures/base/Command')

module.exports = class Balance extends Command {
  constructor () {
    super({
      name: 'balance',
      aliases: ['bal', 'wallet', 'coins'],
      category: 'Currency',
      description: "View the amount of coins in your or someone else's wallet",
      usage: '<user>',
      examples: ['', '@MatievisTheKat', 'matievis', '492708936290402305'],
      requiresArgs: false,
      currency: true
    })
  }

  async run (msg, args, flags) {
    const target = await msg.client.resolve(
      'user',
      args.join(' ') || msg.author.toString(),
      msg.guild
    )
    if (!target) return msg.client.errors.invalidTarget(msg, msg.channel)

    let content = `**Wallet:** ${(
      target.currency.wallet ?? 0
    ).toLocaleString()}`
    if (
      target.id === msg.author.id ||
      msg.client.config.creators.ids.includes(msg.author.id)
    ) {
      content += `\n**Bank:** ${(target.currency.bank ?? 0).toLocaleString()}/${
        target.currency.bankLimit || 200
      } ${target.currency.bank === target.currency.bankLimit ? '[FULL]' : ''}`
    }

    const embed = new msg.client.Embed()
      .setAuthor(`${target.username}'s balance`)
      .setDescription(content)
      .setFooter(`Requested by ${msg.author.tag}`)

    msg.channel.send(embed)
  }
}
