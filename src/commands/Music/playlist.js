const Command = require('../../structures/base/Command')

module.exports = class Playlist extends Command {
  constructor () {
    super({
      name: 'playlist',
      aliases: ['pl'],
      category: 'Music',
      description:
        'Create or delete a playlist. Playlist names can only have 1 word, no spaces',
      usage: '{create | delete | view} {playlist_name}',
      examples: ['cool-playlist'],
      cooldown: '10s'
    })
  }

  async run (msg, args, flags) {
    const option = args[0].toLowerCase()
    const name = args[1]
    const foundPL = await msg.client.models.Playlist.findOne({
      userID: msg.author.id,
      name
    })
    if (!name) { return msg.channel.send(msg.warning('You need to supply a valid name!')) }

    let playlist, embeds

    switch (option) {
      case 'create':
        if (['create', 'delete'].includes(name.toLowerCase())) {
          return msg.channel.send(
            msg.warning('You cannot create a playlist with that name!')
          )
        }

        if (foundPL) {
          return msg.channel.send(
            msg.warning('You already own a playlist with that name!')
          )
        }

        playlist = new msg.client.models.Playlist({
          userID: msg.author.id,
          name,
          tracks: []
        })
        await playlist.save()

        msg.channel.send(
          msg.success(
            `I have created a playlist (${
            playlist.name
            }). Use \`${await msg.prefix(false)}${this.help.name} view ${
            playlist.name
            }\` to view info for it`
          )
        )
        break

      case 'delete':
        if (!foundPL) {
          return msg.channel.send(
            msg.warning(`You do not own a playlist with the name **${name}**!`)
          )
        }

        await foundPL.delete()

        msg.channel.send(msg.success(`I have deleted **${name}**`))
        break

      case 'view':
        playlist = await msg.client.models.Playlist.findOne({
          userID: msg.author.id,
          name
        })
        if (!playlist) {
          return msg.channel.send(
            msg.warning(`You do not own a playlist with the name **${name}**!`)
          )
        }

        embeds = []

        for (let i = -1; i < playlist.tracks.length; i += 10) {
          const tracks = playlist.tracks
            .slice(i + 1, i + 11)
            .map((t) => t.title)
            .join('\n - ')

          const embed = new msg.client.Embed()
            .setAuthor(playlist.name)
            .setDescription(
              `Add a song: \`${await msg.prefix(false)}addsong ${
              playlist.name
              } {query | url}\`\nRemove a song: \`${await msg.prefix(
                false
              )}removesong ${playlist.name} {song_name}\`\nTracks:\n - ${
              tracks || 'None'
              }`
            )

          embeds.push(embed)
        }

        if (embeds.length < 2) return msg.channel.send(embeds[0])
        else msg.client.util.paginate(msg, embeds)
        break

      default:
        msg.client.errors.invalidArgs(msg, msg.channel, 'playlist')
        break
    }
  }
}
