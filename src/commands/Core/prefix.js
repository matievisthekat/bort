const Command = require("../../structures/base/Command");

module.exports = class Prefix extends Command {
  constructor() {
    super({
      name: "prefix",
      category: "Core",
      description: "Set the prefix for the server",
      usage: "{prefix}",
      examples: ["!"],
      requiredPerms: ["MANAGE_GUILD"]
    });
  }

  async run(msg, args, flags) {
    const data = await msg.client.models.prefix.findOne({
      guildID: msg.guild.id
    });

    if (args.join(" ") === msg.client.prefix && data !== null) {
      await msg.client.unloadPrefix(data);
    } else {
      await msg.client.loadPrefix({
        guildID: msg.guild.id,
        prefix: args.join(" ")
      });
    }

    msg.channel.send(
      msg.success(`Set \`${args.join(" ")}\` as the prefix for this server`)
    );
  }
};
