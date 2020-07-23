const Command = require('../../structures/base/Command')

module.exports = class Remove extends Command {
  constructor () {
    super({
      name: 'remove',
      category: 'Announcements',
      description: 'Remove an announcement channel',
      usage: '{channel}',
      examples: ['#news', '89634723649871243'],
      cooldown: '5s',
      requiredPerms: ['MANAGE_CHANNELS'],
      requiredClientPerms: ['MANAGE_CHANNELS']
    })
  }

  async run (msg, args, flags) {
    const chan =
      msg.mentions.channels.first() || msg.client.channels.cache.get(args[0])
    if (!chan) {
      return msg.channel.send(
        msg.warning(
          'I could not find that channel. Please make sure you mention it or give the channel ID'
        )
      )
    }

    const data = await msg.client.models.AnnouncementChannel.findOne({
      channelID: chan.id
    })
    if (!data) {
      return msg.channel.send(
        msg.warning('That channel is not set up as an announcement channel')
      )
    }

    const m = await msg.channel.send(
      msg.loading('Removing webhooks and data...')
    )

    const webhookDatas = await msg.client.models.AnnouncementWebhook.find(
      (doc) => doc && doc.followedChannelID === data.channelID
    )
    for (const whData of webhookDatas) {
      const wh = await msg.client
        .fetchWebhook(whData.id, whData.token)
        .catch(() => {})
      if (wh) await wh.delete()
      await whData.delete()
    }

    await data.delete()
    await chan.setTopic('').catch(() => {})

    m.edit(msg.success(`${chan} is no longer an announcement channel`))
  }
}
