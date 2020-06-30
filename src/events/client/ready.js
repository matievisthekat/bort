const Event = require("../../structures/base/Event");
const { ErelaClient } = require("erela.js");

module.exports = class extends Event {
  constructor() {
    super("ready");
  }

  async run(client) {
    setStatus(client);
    client.setInterval(() => setStatus(client), 60 * 60 * 1000);

    const reactionRoles = await client.models.reactionrole.find();
    for (const reactionRole of reactionRoles) {
      const channel = client.channels.cache.get(reactionRole.channelID);
      if (!channel) continue;
      await channel.messages.fetch(reactionRole.messageID);
    }

    if (client.loadMusic === "true") {
      client.music = new ErelaClient(client, client.config.nodes);
      client.music
        .on("nodeConnect", (node) => client.logger.info("Created new node"))
        .on("nodeError", (node, err) =>
          client.logger.error(`Node Error: ${err.stack}`)
        )
        .on(
          "queueEnd",
          async (player) =>
            await client.music.players.destroy(player.voiceChannel.guild.id)
        );
    }

    client.logger.log(
      client.util.chalk.cyan(
        `Logged in as ${client.util.chalk.red(client.user.tag)} with ${
          client.guilds.cache.size
        } guilds`
      )
    );
  }
};

function setStatus(client) {
  client.user.setPresence({
    status: "online",
    activity: {
      name: `you sleep | /help | ${client.guilds.cache.size} servers`,
      type: "WATCHING"
    }
  });
}
