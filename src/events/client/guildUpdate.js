const Event = require('../../structures/base/Event')

module.exports = class extends Event {
  constructor () {
    super('guildUpdate')
  }

  async run (client, oldG, newG) {
    const chanDatas = await client.models.AnnouncementChannel.find(
      (doc) => doc && doc.channelID === newG.id
    )

    if (oldG.name !== newG.name) {
      for (const data of chanDatas) {
        const chan = client.channels.cache.get(data.channelID)
        if (!chan) {
          await data.delete()
          continue
        }

        data.name = `${newG.name} #${chan.name}`
        await data.save()

        for (const whData of data.subs) {
          const wh = await client
            .fetchWebhook(whData.id, whData.token)
            .catch(() => {})
          if (!wh) continue
          wh.edit({ name: data.name })
        }
      }
    }

    if (oldG.iconURL() !== newG.iconURL()) {
      for (const data of chanDatas) {
        const chan = client.channels.cache.get(data.channelID)
        if (!chan) {
          await data.delete()
          continue
        }

        data.avatarURL = newG.iconURL({ format: 'png' })
        await data.save()

        for (const whData of data.subs) {
          const wh = await client
            .fetchWebhook(whData.id, whData.token)
            .catch(() => {})
          if (!wh) continue
          wh.edit({ avatar: data.avatarURL })
        }
      }
    }
  }
}
