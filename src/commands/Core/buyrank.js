const Command = require("../../structures/base/Command");

module.exports = class BuyRank extends Command {
  constructor() {
    super({
      name: "buyrank",
      aliases: ["br"],
      category: "Core",
      description:
        "Buy a rank on the server. The price goes to the server bank",
      usage: "{role}",
      examples: ["@Master", "developer"],
      cooldown: "10s",
      requiresArgs: true,
      currency: true,
    });
  }

  async run(msg, args, flags) {
    const role = await msg.client.resolve("role", args.join(" "), msg.guild);
    if (role === null) return client.errors.invalidTarget(msg, msg.channel);

    const rank = await msg.client.models.rank.findOne({
      guildID: msg.guild.id,
      roleID: role.id,
    });
    if (!rank)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "That role is not set as a rank on this server!"
      );

    if (msg.author.currency.model.wallet < rank.price)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You do not have enough money in your wallet to buy that!"
      );

    const res = await msg.guild.bank.transfer({
      type: "deposit",
      userID: msg.author.id,
      amount: rank.price,
    });

    if (!res)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "Something unexpected occured when transfering coins. Please try again!"
      );

    try {
      await msg.member.roles.add(rank.roleID);
      msg.channel.send(msg.success(`You now have the **${role.name}** rank!`));
    } catch (err) {
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "I cannot added roles to you on this server! Please talk to a server admin to change this!"
      );
    }
  }
};
