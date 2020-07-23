const Command = require('../../structures/base/Command')

module.exports = class Invite extends Command {
  constructor () {
    super({
      name: 'invite',
      aliases: ['invitemember'],
      category: 'Clans',
      description: 'Invite a member to yuor clan!',
      usage: '{user}',
      examples: ['@MatievisTheKat', '394215336846688266'],
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
    //     msg.warning("You cannot invite yourself to your own clan!")
    //   );

    if (clan.memberIDs.includes(target.id)) {
      return msg.channel.send(
        msg.warning('That user is already in your clan!')
      )
    }

    let declined = false

    const col = await msg.channel.createMessageCollector(
      (m) => m.author.id === target.id,
      { max: 1, time: msg.client.util.ms('30m') }
    )

    const invite = await msg.channel.send(
      `${target} are you willing to join **${msg.author.username}'s** clan (${clan.name})?\n**Type \`accept\` to join their clan**`
    )

    col.on('collect', async (m) => {
      if (/accept/gi.test(m.content)) {
        clan.memberIDs.push(target.id)
        await clan.save()

        if (invite.deletable) await invite.delete().catch(() => {})

        msg.channel.send(
          msg.success(
            `**${target.username}** accepted your invitation ${msg.author}!`
          )
        )
      } else {
        declined = true
        if (invite.deletable) await invite.delete().catch(() => {})
        col.stop()
      }
    })

    col.on('end', async (collected) => {
      if (declined) {
        msg.channel.send(
          `**${target.username}** declined your invitation ${msg.author}!`
        )
      } else if (!declined && !collected.first()) {
        if (invite.deletable) await invite.delete().catch(() => {})
        msg.channel.send(
          msg.warning(
            `The invitation timed out with no response from **${target.tag}**`
          )
        )
      }
    })
  }
}
