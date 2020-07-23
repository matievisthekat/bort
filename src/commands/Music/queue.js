const Command = require('../../structures/base/Command')

module.exports = class Queue extends Command {
  constructor () {
    super({
      name: 'queue',
      aliases: ['q'],
      category: 'Music',
      description: 'View the queue',
      cooldown: '5s',
      guildOnlyCooldown: true,
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id)
    if (!player) {
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        'There is nothing playing on this server!'
      )
    }

    if (!player.queue[0]) {
      await msg.client.music.players.destroy(msg.guild.id)
      return msg.channel.send(
        msg.warning('There is nothing playing in this server!')
      )
    }

    const embeds = []

    for (let i = 1; i < player.queue.length; i += 10) {
      const queue = player.queue.slice(i, i + 10)
      const embed = new msg.client.Embed()
      embed.setDescription(
        `**Now Playing:** ${player.queue[0].title}\n\n${queue
          .map(
            (track) => `**[${player.queue.indexOf(track) + 1}]** ${track.title}`
          )
          .join('\n')}`
      )
      embeds.push(embed)
    }

    if (embeds.length < 2) return msg.channel.send(embeds[0])
    else msg.client.util.paginate(msg, embeds)
  }
}
