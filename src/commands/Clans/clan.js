const Command = require('../../structures/base/Command')

module.exports = class Clan extends Command {
  constructor () {
    super({
      name: 'clan',
      category: 'Clans',
      description: 'View your current clan',
      guildOnlyCooldown: false,
      usage: '<clan_name>',
      examples: ['the kats'],
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const clan = !args[0]
      ? (await msg.client.models.Clan.findOne({
        leaderID: msg.author.id
      })) ||
        (await msg.client.models.Clan.findOne({
          name: args.join(' '),
          memberIDs: msg.author.id
        }))
      : await msg.client.models.Clan.findOne({
        name: args.join(' '),
        memberIDs: msg.author.id
      })
    if (!clan) { return msg.channel.send(msg.warning("You aren't in that/any clan yet")) }

    const embed = new msg.client.Embed()
      .setAuthor(`Clan: ${clan.name}`)
      .setThumbnail(clan.iconURL)
      .addField(
        'Information',
        `**Leader:** <@${clan.leaderID}>
        **Members:** ${
          clan.memberIDs.map((id) => `<@${id}>`).join('\n') || '[ None ]'
        }
        **Pets:** ${
          clan.pets.map((p) => `**${p.name}**`).join(', ') || '[ None ]'
        }`
      )
      .addField(
        'Base',
        `**Health:** ${clan.health}/${clan.maxHealth}\n**Wall Level:** ${clan.wallLevel}`
      )
      .addField('Bank', `**Amount:** ${clan.bank}`)

    return msg.channel.send(embed)
  }
}
