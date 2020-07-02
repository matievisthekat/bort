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
    const chanceOfGettingNothingPercent = 20;
    const options =["common", "uncommon", "legendary", "mythical"];
    const rarityChance = msg.client.util.randomInRange(0, 100);
    let option = options[0];

    switch(rarityChance) {
      case rarityChance > 30:
        option = options[2]
      case rarityChance > 65:
        option = options[2]
      case rarityChance > 90:
        option = options[3];
    }

    const chance = msg.client.util.randomInRange(0, 100);
    if (chance < chanceOfGettingNothingPercent)
      return msg.channel.send(
        msg.warning(`Oops, looks like you didn't find any ${option} animals`)
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
