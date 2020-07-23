const Command = require('../../structures/base/Command')

module.exports = class Remove extends Command {
  constructor () {
    super({
      name: 'remove',
      aliases: ['removemember'],
      category: 'Clans',
      description: 'Remove a member from your clan',
      usage: '{user}',
      examples: ['@MatievisTheKat', '700377722576437370'],
      cooldown: '10s'
    })
  }

  async run (msg, args, flags) {
    const clan = await msg.client.models.Clan.findOne({
      leaderID: msg.author.id
    })
    if (!clan) { return msg.channel.send(msg.warning("You aren't in any clan yet")) }

    const target = await msg.client.resolve('user', args.join(' '))
    if (!target) return msg.client.errors.invalidTarget(msg, msg.channel)

    // if (target.id === msg.author.id)
    //   return msg.channel.send(
    //     msg.warning("You cannot remove yourself from your own clan!")
    //   );

    if (!clan.memberIDs.includes(target.id)) { return msg.channel.send(msg.warning('That user is not in your clan!')) }

    clan.memberIDs.splice(
      clan.memberIDs.indexOf(target.id),
      1
    )
    await clan.save()

    msg.channel.send(
      msg.success(`**${target.username}** has been removed from your clan`)
    )
  }
}
