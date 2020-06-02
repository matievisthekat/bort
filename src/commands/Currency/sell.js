const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "sell",
      category: "Currency",
      description: "Sell some of your hard earned items",
      usage: "{item ID}",
      examples: ["dog", "ultrachicken"],
      currency: true
    });
  }

  async run(msg, args, flags) {
    const data = await msg.client.models.inv.findOne({
      userID: msg.author.id
    });
    if (!data)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You currently do not won any items!"
      );

    const item = data.inv.find(
      (i) => i.name.toLowerCase().replace(/ +/gi, "") === args[0]
    );
    if (!item)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You do not own that item or it is not a valid item ID!"
      );

    data.inv.splice(data.inv.indexOf(item), 1);
    await data.save();
    await msg.author.currency.add(item.price);

    msg.channel.send(
      msg.success(
        `You sold one **${item.name}** for ${msg.client.emoji.coin}${item.price}`
      )
    );
  }
};
