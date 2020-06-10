const Command = require("../../structures/base/Command"),
  hastebin = require("hastebin.js");

module.exports = class Guilds extends Command {
  constructor() {
    super({
      name: "guilds",
      aliases: ["servers"],
      category: "Core",
      description: "View all the servers the bot is in",
      requiresArgs: false,
      guildOnly: false,
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    if (msg.deletable) msg.delete();

    const guilds = msg.client.guilds.cache
      .array()
      .sort((a, b) => b.members.cache.size - a.members.cache.size)
      .map((g) => `${g.members.cache.size} - ${g.name}`)
      .join("\n");

    new hastebin()
      .post(guilds)
      .then((link) =>
        msg.author.send(`**Total Guilds** Ordered by member count: ${link}`)
      );
  }
};
