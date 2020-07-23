const Event = require('../../structures/base/Event')

module.exports = class extends Event {
  constructor () {
    super('guildCreate')
  }

  async run (client, guild) {
    if (!guild.available) return

    const blacklist = await client.models.Blacklist.findOne({
      guildID: guild.id
    })
    if (blacklist) return await guild.leave()

    client.logger.log(`Joined ${guild.name}`)
    const joinLog = client.channels.cache.get(client.config.channels.join)
    if (joinLog) {
      joinLog.send(
        new client.Embed()
          .setAuthor(guild.name, guild.iconURL())
          .setColor(client.colours.green)
      )
    }
  }
}
