const Event = require('../../structures/base/Event')

module.exports = class extends Event {
  constructor () {
    super('channelDelete')
  }

  async run (client, channel) {
    const chanData = await client.models.AnnouncementChannel.findOne({
      channelID: channel.id
    })
    if (chanData) {
      const followers = await client.models.AnnouncementWebhook.find(
        (doc) => doc.followedChannelID === channel.id
      )

      for (const follower of followers) {
        const webhook = await client.fetchWebhook(follower.id, follower.token)

        await webhook.delete().catch(() => {})
        await follower.delete()
      }

      await chanData.delete()
    }
  }
}
