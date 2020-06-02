const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "inventory",
      aliases: ["inv"],
      category: "Fun",
      description: "View your inventory",
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const data = await msg.client.models.inv.findOne({
      userID: msg.author.id
    });
    if (!data || data.inv.length < 1)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You don't have anything in your inventory!"
      );

    const embeds = [];

    for (let index = 0; index < data.inv.length; index += 7) {
      const embed = new msg.client.embed();
      const items = data.inv.slice(index, index + 7);
      items.forEach((item) =>
        embed.addField(
          `**${item.name.toProperCase()}**`,
          `- Price: ${msg.client.emoji.coin}${
            item.price
          }\n- ID: \`${item.name.toLowerCase().replace(/ +/gi, "")}\``
        )
      );
      embeds.push(embed);
    }

    if (embeds.length > 1) msg.client.util.paginate(msg, embeds);
    else msg.channel.send(embeds[0]);
  }
};
