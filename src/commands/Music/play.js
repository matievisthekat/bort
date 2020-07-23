const Command = require('../../structures/base/Command')
const { Track } = require('erela.js')

module.exports = class Play extends Command {
  constructor () {
    super({
      name: 'play',
      aliases: ['p'],
      category: 'Music',
      description: 'Play music',
      usage: '<url | search>',
      examples: [
        'rick roll',
        'https://youtube.com/watch?v=OJMNad978aj',
        'test --playlist'
      ],
      flags: ['list', 'playlist'],
      cooldown: '4s',
      guildOnlyCooldown: true,
      requiresArgs: false,
      voiceChannelOnly: true
    })
  }

  async run (msg, args, flags) {
    if (args[0]) {
      let failed = false

      const player =
        (await msg.client.music.players.get(msg.guild.id)) ||
        (await msg.client.music.players.spawn({
          voiceChannel: msg.member.voice.channel,
          textChannel: msg.channel,
          guild: msg.guild
        }))

      if (flags.playlist) {
        const pl = await msg.client.models.Playlist.findOne({
          userID: msg.author.id,
          name: args.join(' ')
        })
        if (!pl) {
          return msg.channel.send(
            msg.warning('You do not own a playlist with that name!')
          )
        }

        const tracks = pl.tracks
        for (const track of tracks) {
          await player.queue.add(
            new Track(
              {
                track: track.track,
                info: {
                  identifier: track.identifier,
                  isSeekable: track.isSeekable,
                  author: track.author,
                  length: track.duration,
                  isStream: track.isStream,
                  title: track.title,
                  uri: track.uri
                }
              },
              msg.author
            )
          )
        }

        if (!player.playing) await player.play()
        msg.channel.send(msg.success(`Started playing **${pl.name}**`))
      } else {
        const res = await msg.client.music
          .search(args.join(' '), msg.author)
          .catch((_) => (failed = true))
        if (!res || !res.tracks || !res.tracks[0] || failed) {
          return await msg.client.errors.custom(
            msg,
            msg.channel,
            'No results where found! Try again'
          )
        }

        if (flags.list) {
          const tracks = res.tracks.slice(0, 9)

          const embed = new msg.client.Embed()
            .setDescription(
              tracks.map((t, i) => `**[${i + 1}]** ${t.title}`).join('\n')
            )
            .setFooter("Type 'cancel' to cancel | Times out in 30 seconds")

          msg.channel.send(embed)

          const col = await msg.channel.createMessageCollector(
            (m) => m.author.id === msg.author.id,
            { limit: 30000 }
          )

          col.on('collect', async (m) => {
            if (/cancel|cancle/gi.test(m.content)) return await col.stop()
            if (!/^[0-9]$/.test(m.content)) {
              return msg.channel.send(
                msg.warning('Please enter a valid number')
              )
            }

            const index = parseInt(m.content) - 1
            const track = tracks[index]
            if (!track) {
              return await msg.client.errors.custom(
                msg,
                msg.channel,
                'Invalid track selection. try again'
              )
            }

            await col.stop()

            await player.queue.add(track)
            if (!player.playing) await player.play()

            sendStart(msg, player, track)
          })

          col.on('end', async (collected) => {
            if (!collected.first(2)) { return msg.channel.send(msg.warning('Selection timed out')) }
          })
        } else {
          const track = res.tracks[0]

          await player.queue.add(track)
          if (!player.playing) await player.play()

          sendStart(msg, player, track)
        }
      }
    } else {
      const player = await msg.client.music.players.get(msg.guild.id)
      if (!player) {
        return msg.channel.send(
          msg.warning('There is nothing playing on the server!')
        )
      }
      if (!player.playing) await player.pause(false)
      else { return msg.channel.send(msg.warning('The player is already playing!')) }

      msg.channel.send(msg.success('Resumed music!'))
    }
  }
}

async function sendStart (msg, player, track) {
  if (player.queue[0].identifier === track.identifier) {
    return msg.channel.send(
      msg.success(
        `Started **${track.title}** for ${msg.client.util
          .moment(track.duration)
          .format('mm:ss')}`
      )
    )
  } else {
    return msg.channel.send(
      msg.success(
        `Added **${track.title}** for ${msg.client.util
          .moment(track.duration)
          .format('mm:ss')} to the queue`
      )
    )
  }
}
