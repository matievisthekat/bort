const Command = require("../../structures/base/Command");

module.exports = class BankWith extends Command {
  constructor() {
    super({
      name: "bankwith",
      aliases: ["bankwithdraw", "bw"],
      category: "Currency",
      description: "Withdraw an amount from the current sevrer's bank",
      usage: "{amount | max}",
      examples: ["100", "max"],
      cooldown: "24h",
      currency: true
    });
  }

  async run(msg, args, flags) {
    if (
      msg.guild.bank.allowedRoleID &&
      !msg.member.roles.cache.has(msg.guild.bank.allowedRoleID)
    )
      return await msg.channel.send(
        msg.warning(
          "You do not have the role to withdraw coins from this bank!"
        )
      );

    if (
      msg.guild.bank.whitelistedMemberIDs.length > 0 &&
      !msg.guild.bank.whitelistedMemberIDs.includes(msg.author.id)
    )
      return await msg.channel.send(
        msg.warning("You are not whitelisted to withdraw coins from this bank!")
      );

    if (msg.guild.bank.blacklistedMemberIDs.includes(msg.author.id))
      return await msg.channel.send(
        msg.warning("You are blacklisted from withdrawing coins in this guild!")
      );

    let amount = ["all", "max"].includes(args[0].toLowerCase())
      ? msg.guild.bank.maxWithdrawAmount
      : parseInt(args[0]);

    if (amount === 0)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You don't have any money to deposit"
      );

    if (!amount)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You need to supply an amount to withdraw"
      );

    if (amount < 0)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You may not withdraw negative amounts"
      );

    if (amount > msg.guild.bank.maxWithdrawAmount)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You may not withdraw more than the server limit!"
      );

    if (msg.guild.bank.amount < amount)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "This server doesn't have that much money!"
      );

    await msg.guild.bank.withdraw({
      userID: msg.author.id,
      amount
    });

    msg.channel.send(
      msg.success(
        `Withdrew ${amount.toLocaleString()} coins from **${
          msg.guild.name
        }**'s bank`
      )
    );
  }
};
