const Command = require('../../structures/base/Command')

module.exports = class Setup extends Command {
  constructor () {
    super({
      name: 'setup',
      category: 'Announcements',
      description: 'Setup an announcement channel',
      cooldown: '5s',
      requiresArgs: false,
      requiredPerms: ['MANAGE_CHANNELS'],
      requiredClientPerms: ['MANAGE_WEBHOOKS', 'MANAGE_CHANNELS']
    })
  }

  async run (msg, args, flags) {
    const col = await msg.channel.createMessageCollector(
      (m) => m.author.id === msg.author.id,
      { time: 5 * 60 * 1000 }
    )

    let count = 0
    let complete = false
    let chan

    const embed = new msg.client.Embed()
      .setDescription('What channel would you like setup?')
      .setFooter('This times out in 5 minutes | Type \'cancel\' to quit')

    const m = await msg.channel.send(embed)

    const data = new msg.client.models.AnnouncementChannel({
      guildID: msg.guild.id,
      subCount: 0,
      subs: []
    })
    const guildData =
      (await msg.client.models.AnnouncementChannels.findOne({
        guildID: msg.guild.id
      })) ||
      new msg.client.models.AnnouncementChannels({
        guildID: msg.guild.id,
        channels: []
      })

    let yes; let no

    col.on('collect', async (message) => {
      if (/cancel|cancle/gi.test(message.content)) return col.stop()

      switch (count) {
        case 0:
          chan = message.mentions.channels.first()
          if (!chan) {
            return message.channel
              .send(msg.error('That is not a valid channel mention'))
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => { }))
          }

          if (guildData.channels.includes(chan.id)) {
            return message.channel
              .send(
                msg.error(
                  'That channel is already set up in this server! Pick another one'
                )
              )
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => { }))
          }

          data.channelID = chan.id
          data.name = `${msg.guild.name} #${chan.name}`
          guildData.channels.push(chan.id)

          message.channel.send(
            embed.setDescription(
              `Would you like all messages sent in ${chan} to be automatically announced? (yes/no)\nIf no, you can use the \`${msg.client.prefix}announce\` command in that channel`
            )
          )
          count++
          break
        case 1:
          yes = /yes/i.test(message.content)
          no = /no/i.test(message.content)
          if (!yes && !no) {
            return message.channel
              .send(
                msg.error(
                  'That is not a valid answer! Please send either "yes" or "no"'
                )
              )
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => { }))
          }

          data.autoAnnounce = !!yes

          complete = true
          col.stop()
          break
        default:
          col.stop()
      }
    })

    col.on('end', async (collected) => {
      if (!complete) return m.edit(msg.error('Timed out'))
      else {
        await data.save()
        await guildData.save()

        await chan.setTopic(
          `Followers: ${data.subCount} | Use \`${await msg.prefix(
            false
          )}follow ${data.channelID}\` to follow this channel!`
        )

        msg.channel.send(
          msg.success(
            `${chan} is now follow-able by using \`${await msg.prefix(
              false
            )}follow ${chan.id}\``
          )
        )
      }
    })
  }
}
