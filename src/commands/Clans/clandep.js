const Command = require("../../structures/base/Command");

module.exports = class ClanDep extends Command {
  constructor() {
    super({
      name: "clandep",
      aliases: ["clandeposit"],
      category: "Clans",
      description: "Deposit money into your clan's bank",
      usage: "{amount | max} <clan_name>",
      examples: ["100", "max", "all"],
      currency: true
    });
  }

  async run(msg, args, flags) {
    const amt = ["max", "all"].includes(args[0].toLowerCase())
      ? msg.author.currency.wallet
      : parseInt(args[0]);
    if (!amt)
      return msg.channel.send(msg.warning("That is not a valid amount!"));

    if (amt > msg.author.currency.wallet)
      return msg.channel.send(
        msg.warning("You cannot deposit more than you have!")
      );

    if (amt < 0)
      return msg.channel.send(
        msg.warning("You cannot deposit a negative amount!")
      );

    const clanName = args.slice(1).join(" ");
    const clan = !clanName
      ? (await msg.client.models.clan.findOne({
          leaderID: msg.author.id
        })) ||
        (await msg.client.models.clan.findOne({
          name: clanName,
          memberIDs: msg.author.id
        }))
      : await msg.client.models.clan.findOne({
          name: clanName,
          memberIDs: msg.author.id
        });
    if (!clan)
      return msg.channel.send(msg.warning("You aren't in that/any clan yet"));

    clan.bank += amt;
    await msg.author.currency.remove(amt);
    await clan.save();

    msg.channel.send(
      msg.success(`Deposited **${amt}** coins into **${clan.name}**`)
    );
  }
};
