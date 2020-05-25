const Command = require("../../structures/base/Command");

module.exports = class extends Command {
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
    let amount = ["all", "max"].includes(args[0].toLowerCase())
      ? msg.guild.bank.maxWithdrawAmount
      : parseInt(args[0]);

    if (amount === 0)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You don't have any money to deposit"
      );

    if (!amount)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You need to supply an amount to withdraw"
      );

    if (amount < 0)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may not withdraw negative amounts"
      );

    if (amount > msg.guild.bank.maxWithdrawAmount)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may not withdraw more than the server limit!"
      );

    if (msg.guild.bank.amount < amount)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "This server doesn't have that much money!"
      );

    await msg.guild.bank.withdraw({
      userID: msg.author.id,
      amount
    });

    msg.channel.send(
      msg.success(`Withdrew ${amount} coins from **${msg.guild.name}**'s bank`)
    );
  }
};
