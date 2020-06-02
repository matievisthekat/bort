const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "mine",
      category: "Currency",
      description: "Mine for some ores",
      cooldown: "30m",
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const chance = msg.client.util.randomInRange(0, 100);

    if (chance > 20) {
      const ore = msg.client.config.ores.random();

      const data =
        (await msg.client.models.inv.findOne({
          userID: msg.author.id
        })) ||
        new msg.client.models.inv({
          userID: msg.author.id,
          inv: []
        });

      data.inv.push(ore);
      await data.save();

      msg.channel.send(
        msg.success(
          `You found one **${ore.name}**! It is worth ${msg.client.emoji.coin}${ore.price}`
        )
      );
    } else
      return msg.channel.send(
        msg.warning(
          "Looks like you didn't find anything. Better luck next time!"
        )
      );
  }
};
