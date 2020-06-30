const Command = require("../../structures/base/Command");

module.exports = class Hunt extends Command {
  constructor() {
    super({
      name: "hunt",
      category: "Currency",
      description: "Hunt for some animals",
      cooldown: "4h",
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    let chanceOfGettingNothingPercent = 0;

    const option = ["uncommon", "legendary", "common", "mythical"].random();
    switch (option) {
      case "common":
        chanceOfGettingNothingPercent = 30;
        break;

      case "uncommon":
        chanceOfGettingNothingPercent = 50;
        break;

      case "legendary":
        chanceOfGettingNothingPercent = 70;
        break;

      case "mythical":
        chanceOfGettingNothingPercent = 93;
        break;
    }

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
          `You caught a${
            ["a", "e", "i", "o", "u"].includes(option.charAt(0).toLowerCase())
              ? "n"
              : ""
          } ${option} **${
            animal.name
          }**! It is worth ${animal.price.toLocaleString()} coins`
        )
      );
    }
  }
};
