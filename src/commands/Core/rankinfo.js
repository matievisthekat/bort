const Command = require("../../structures/base/Command");

module.exports = class RankInfo extends Command {
  constructor() {
    super({
      name: "rankinfo",
      aliases: ["ri"],
      category: "Core",
      description: "View information on a specific rank",
      usage: "{role}",
      examples: ["660046242910568449", "Master"],
      requiresArgs: true,
      guildOnly: true,
    });
  }

  async run(msg, args, flags) {
    const role = await msg.client.resolve("role", args.join(" "), msg.guild);
    if (role === null) return msg.client.errors.invalidTarget(msg, msg.channel);

    const rank = await msg.client.models.rank.findOne({
      guildID: msg.guild.id,
      roleID: role.id,
    });
    if (rank === null)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "That role is not set as a rank in this server!"
      );

    const setter = msg.client.users.resolve(rank.setterID);

    const embed = new msg.client.embed()
      .setColor(role.color || msg.client.colours.def)
      .setThumbnail(
        setter ? setter.displayAvatarURL() : msg.client.user.displayAvatarURL()
      )
      .addField(
        "Rank",
        `${role} **:** ${role.name} **:** ${role.id}\n${msg.client.emoji.coin} **Price** ${rank.price}`
      )
      .addField(
        "Relevant Dates",
        `↳ **Created** ${msg.client.util
          .moment(parseInt(rank.timestamp) || Date.now())
          .from(Date.now())}\n↳ **Last updated** ${msg.client.util
          .moment(parseInt(rank.lastUpdateTimestamp) || Date.now())
          .from(Date.now())}`
      )
      .addField(
        "Misc",
        `${msg.client.emoji.user} **Set by** ${setter} **:** ${setter.tag}`
      )
      .setFooter(
        `Requested by ${msg.author.tag}`,
        msg.author.displayAvatarURL()
      );

    msg.channel.send(embed);
  }
};
