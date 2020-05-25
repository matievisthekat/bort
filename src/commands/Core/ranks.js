const Command = require("../../structures/base/Command");

module.exports = class Ranks extends Command {
  constructor() {
    super({
      name: "ranks",
      category: "Core",
      description: "View all current ranks on the server",
      requiresArgs: false,
      guildOnly: true
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Fetching ranks..."));

    const ranks = await msg.client.models.rank.find({
      guildID: msg.guild.id
    });

    if (!ranks || !ranks.length || !ranks[0]) {
      if (m.deletable) await m.delete();
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "There are no ranks set in this server"
      );
    }

    const embed = new msg.client.embed()
      .addField(
        "For more information",
        `\`\`\`dust\nDo ${await msg.prefix(false)}rankinfo {role}\`\`\``
      )
      .setFooter(
        `Requested by ${msg.author.tag}`,
        msg.author.displayAvatarURL()
      );

    for (const rank of ranks) {
      const role = msg.guild.roles.cache.get(rank.roleID);
      if (!role) continue;

      const descWords = rank.description.split(" ");

      embed.addField(
        "\u200b",
        `${role} ${descWords[0] || ""} ${descWords[1] || ""} ${
          descWords[2] || ""
        } ${descWords[3] || ""} ${descWords[4] || ""}...\n${
          msg.client.emoji.coin
        } **Price** ${rank.price}`
      );
    }

    m.edit("", embed);
  }
};
