const Event = require('../../structures/base/Event')

module.exports = class extends Event {
  constructor () {
    super('channelUpdate')
  }

  async run (client, oldC, newC) {
    if (oldC.name !== newC.name) {
      const chanDatas = await client.models.AnnouncementChannel.find(
        (doc) => doc && doc.channelID === newC.id
      )
      for (const data of chanDatas) {
        const guild = client.guilds.cache.get(data.guildID)
        if (!guild) {
          await data.delete()
          continue
        }

        data.name = `${guild.name} #${newC.name}`
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
  }
}
