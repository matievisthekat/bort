const Command = require("../../structures/base/Command");

module.exports = class Hunt extends Command {
  constructor() {
    super({
      name: "hunt",
      category: "Currency",
      description: "Hunt for some animals",
      usage: "{common | uncommon | legendary | mythical}",
      examples: ["common", "mythical"],
      cooldown: "4h"
    });
  }

  async run(msg, args, flags) {
    let invalidOpt = false;
    let chanceOfGettingNothingPercent = 0;

    const option = args[0].toLowerCase();
    switch (option) {
      case "common":
        chanceOfGettingNothingPercent = 50;
        break;

      case "uncommon":
        chanceOfGettingNothingPercent = 60;
        break;

      case "legendary":
        chanceOfGettingNothingPercent = 89.09;
        break;

      case "mythical":
        chanceOfGettingNothingPercent = 99.01;
        break;

      default:
        invalidOpt = true;
        break;
    }

    if (invalidOpt)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "That is not a valid option"
      );

    const chance = msg.client.util.randomInRange(0, 100);
    if (chance < chanceOfGettingNothingPercent)
      return msg.channel.send(
        msg.warning("Oops, looks like you didn't find anything")
      );
    else {
      const animals = msg.client.config.animals;
      const animal = animals[option].random();

      const data =
        (await msg.client.models.inv.findOne({
          userID: msg.author.id
        })) ||
        new msg.client.models.inv({
          userID: msg.author.id,
          inv: []
        });

      data.inv.push(animal);
      await data.save();

      msg.channel.send(
        msg.success(
          `You caught a **${animal.name}**! It is worth ${msg.client.emoji.coin}${animal.price}`
        )
      );
    }
  }
};
