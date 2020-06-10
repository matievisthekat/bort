const Command = require("../../structures/base/Command");

module.exports = class Fish extends Command {
  constructor() {
    super({
      name: "fish",
      category: "Currency",
      description: "Fish for some fish",
      cooldown: "10m",
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const chance = msg.client.util.randomInRange(0, 100);

    if (chance > 10) {
      const fish = msg.client.config.fish.random();

      const data =
        (await msg.client.models.inv.findOne({
          userID: msg.author.id
        })) ||
        new msg.client.models.inv({
          userID: msg.author.id,
          inv: []
        });

      data.inv.push(fish);
      await data.save();

      msg.channel.send(
        msg.success(
          `You caught one **${fish.name}**! It is worth ${msg.client.emoji.coin}${fish.price}`
        )
      );
    } else
      return msg.channel.send(
        msg.warning("Looks like you didn't catch anything")
      );
  }
};
