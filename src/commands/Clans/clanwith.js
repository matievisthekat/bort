const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "clanwith",
      aliases: ["clanwithdraw"],
      category: "Clans",
      description: "Withdraw money from your clan's bank",
      usage: "{amount | max} <clan_name>",
      examples: ["100", "max", "all"],
      currency: true
    });
  }

  async run(msg, args, flags) {
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

    if (
      ["max", "all"].includes(args[0].toLowerCase()) &&
      clan.leaderID !== msg.author.id
    )
      return msg.channel.send(
        msg.warning(
          "You may not use the `max` argument if you aren't the leader of the clan"
        )
      );

    const amt = ["max", "all"].includes(args[0].toLowerCase())
      ? clan.bank
      : parseInt(args[0]);
    if (!amt)
      return msg.channel.send(msg.warning("That is not a valid amount!"));

    if (amt > clan.bank)
      return msg.channel.send(
        msg.warning("You cannot withdraw more than the clan has!")
      );

    if (amt < 0)
      return msg.channel.send(
        msg.warning("You cannot withdraw a negative amount!")
      );

    clan.bank -= amt;
    await msg.author.currency.add(amt);
    await clan.save();

    msg.channel.send(
      msg.success(`Withdrew **${amt}** coins from **${clan.name}**`)
    );
  }
};
