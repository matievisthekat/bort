const Command = require("../../structures/base/Command");

module.exports = class SetRank extends Command {
  constructor() {
    super({
      name: "setrank",
      category: "Config",
      description: "Set a buyable rank",
      usage: "{role} {price}",
      examples: ["@Master 100", "652501889400832011 258034", "noob 40"],
      cooldown: "4s",
      requiredPerms: ["MANAGE_ROLES"],
    });
  }

  async run(msg, args, flags) {
    const role = await msg.client.resolve("role", args[0], msg.guild);
    if (!role) return msg.client.errors.invalidTarget(msg, msg.channel);

    const data = await msg.client.models.rank.findOne({
      guildID: msg.guild.id,
      roleID: role.id,
    });
    if (data !== null)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        `That role is already set as a rank! Do \`${await msg.prefix(false)}rank ${role.name}\` to view it`
      );

    const price = parseInt(args[1]) || undefined;
    if (!price)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You need to supply a price for the rank!"
      );

    new msg.client.models.rank({
      guildID: msg.guild.id,
      roleID: role.id,
      price: price,
      description: args.slice(2).join(" ") || "No description set",
      timestamp: Date.now(),
      lastUpdateTimestamp: Date.now(),
      setterID: msg.author.id,
    })
      .save()
      .catch(
        (err) =>
          msg.client.logger.error(err) && msg.client.errors.saveFailr(msg, msg, err)
      );

    msg.channel.send(
      msg.success(`**${role.name}** is now set as a rank in this server`)
    );
  }
};
