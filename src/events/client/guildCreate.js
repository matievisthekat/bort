const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("guildCreate");
  }

  async run(client, guild) {
    if (!guild.available) return;

    const blacklist = await client.models.blacklist.findOne({
      guildID: guild.id
    });
    if (blacklist) return await guild.leave();

    client.logger.log(`Joined ${guild.name}`);
    const joinLog = client.channels.cache.get(client.config.joinLogChannelID);
    if (joinLog)
      joinLog.send(
        new client.embed()
          .setAuthor(guild.name, guild.iconURL())
          .setColor(client.colours.green)
      );
  }
};
