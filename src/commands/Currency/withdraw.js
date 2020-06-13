const Command = require("../../structures/base/Command");

module.exports = class Withdraw extends Command {
  constructor() {
    super({
      name: "withdraw",
      aliases: ["with", "wd"],
      category: "Currency",
      description: "Withdraw coins from your bank",
      usage: "{amount | all}",
      examples: ["all", "142"],
      cooldown: "5s",
      guildOnly: false,
      currency: true
    });
  }

  async run(msg, args, flags) {
    const amount = ["all", "max"].includes(args[0].toLowerCase())
      ? msg.author.currency.model.bank
      : parseInt(args[0]);
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

    if (amount > msg.author.currency.model.bank)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may not withdraw more than you have in your bank"
      );

    await msg.author.currency.withdraw(amount);

    msg.channel.send(
      msg.success(`Withdrew ${amount.toLocaleString()} coins from your bank`)
    );
  }
};
