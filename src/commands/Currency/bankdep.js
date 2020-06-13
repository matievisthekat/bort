const Command = require("../../structures/base/Command");

module.exports = class BankDep extends Command {
  constructor() {
    super({
      name: "bankdep",
      aliases: ["bd"],
      category: "Currency",
      description: "Deposit money into the server bank",
      usage: "{amount | max}",
      examples: ["all", "max", "127"],
      cooldown: "5s",
      currency: true
    });
  }

  async run(msg, args, flags) {
    let amount = ["all", "max"].includes(args[0].toLowerCase())
      ? msg.author.currency.wallet
      : parseInt(args[0]);

    if (amount === 0)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You don't have any money to deposit"
      );

    if (!amount)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You need to supply an amount to deposit"
      );

    if (amount < 0)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may not deposit negative amounts"
      );

    if (amount > msg.author.currency.wallet)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may not deposit more than you have. Nice try though ;)"
      );

    await msg.guild.bank.deposit({
      userID: msg.author.id,
      amount
    });

    msg.channel.send(
      msg.success(`Deposited ${amount.toLocaleString()} coins into **${msg.guild.name}**'s bank`)
    );
  }
};
