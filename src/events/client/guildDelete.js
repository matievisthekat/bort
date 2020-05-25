const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("guildDelete");
  }

  async run(client, guild) {
    if (!guild.available) return;
    client.logger.log(`Left ${guild.name}`);

    const joinLog = client.channels.cache.get(client.config.joinLogChannelID);
    if (joinLog)
      joinLog.send(
        new client.embed()
          .setAuthor(guild.name, guild.iconURL())
          .setColor(client.colours.red)
      );
  }
};
