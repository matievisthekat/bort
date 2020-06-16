const Command = require("../../structures/base/Command");

module.exports = class DelRank extends Command {
  constructor() {
    super({
      name: "delrank",
      aliases: ["dr", "deleterank"],
      category: "Config",
      description: "Delete a rank from the ranks in the current server",
      usage: "{role}",
      examples: ["@Developer --override", "master", "661300428532875266"],
      flags: ["override"],
      cooldown: "5s",
      guildOnlyCooldown: true,
    });
  }

  async run(msg, args, flags) {
    if (flags["override"] && !msg.member.hasPermission("MANAGE_GUILD"))
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You need the manage guild permission to use the override flag!"
      );

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

    if (rank.setterID !== msg.author.id && !flags["override"])
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "Only the setter may delete ranks of their own. Use the --override flag to override this"
      );

    rank.delete();

    msg.channel.send(msg.succes(`**${role.name}** has been removed as a rank`));
  }
};
