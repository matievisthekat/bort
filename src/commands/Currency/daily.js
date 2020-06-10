const Command = require("../../structures/base/Command");

module.exports = class Daily extends Command {
  constructor() {
    super({
      name: "daily",
      category: "Currency",
      description: "Collect your daily reward",
      cooldown: "24h",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const amt = 500;

    await msg.author.currency.add(amt);

    msg.channel.send(msg.success(`You have collected **${amt}** coins!`));
  }
};
