const Command = require('../../structures/base/Command')

module.exports = class Rich extends Command {
  constructor () {
    super({
      name: 'rich',
      aliases: ['richest', 'coinleaderboard', 'clb'],
      category: 'Currency',
      description: 'View the richest users',
      requiresArgs: false

    })
  }

  async run (msg, args, flags) {
    const docs = await msg.client.models.Money.find()
    const lb = docs.sort((a, b) => b.wallet - a.wallet)

    const embed = new msg.client.Embed()
      .setAuthor('Richest Users', msg.guild.iconURL())
      .setDescription(
        lb
          .filter((d) => msg.guild.members.cache.get(d.userID))
          .slice(0, 10)
          .map(
            (d, i) =>
              `**${i + 1}**: <@${d.userID}> - *${d.wallet.toLocaleString()}*`
          )
      )
      .setFooter(`Requested by ${msg.author.tag}`)

    msg.channel.send(embed)
  }
}
