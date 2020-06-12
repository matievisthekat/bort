const Command = require("../../structures/base/Command");

module.exports = class Work extends Command {
  constructor() {
    super({
      name: "work",
      category: "Currency",
      description: "Work for some cash",
      cooldown: "1h",
      requiresArgs: false,
      guildOnly: true
    });
  }

  async run(msg, args, flags) {
    const amt = msg.client.util.randomInRange(12, 200);
    await msg.author.currency.add(amt);
    msg.channel.send(msg.success(`You worked for **${amt}** coins`));
  }
};
