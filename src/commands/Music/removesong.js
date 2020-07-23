const Command = require('../../structures/base/Command')

module.exports = class RemoveSong extends Command {
  constructor () {
    super({
      name: 'removesong',
      category: 'Music',
      description: 'Remove a song from a playlist',
      usage: '{playlist_name} {song_name}',
      examples: ['test going down - tyler joseph'],
      cooldown: '10s'
    })
  }

  async run (msg, args, flags) {
    const pl = await msg.client.models.Playlist.findOne({
      userID: msg.author.id,
      name: args[0]
    })
    if (!pl) {
      return msg.channel.send(
        msg.warning('You do not own a playlist with that name!')
      )
    }

    const name = args.slice(1).join(' ')
    const track = pl.tracks.find((t) => t.title.toLowerCase() === name.toLowerCase())
    if (!track) {
      return msg.channel.send(
        msg.warning('No track was found with that name in that playlist!')
      )
    }

    pl.tracks.splice(pl.tracks.indexOf(track), 1)
    await pl.save()

    msg.channel.send(
      msg.success(`Removed **${track.title}** from **${pl.name}**`)
    )
  }
}
