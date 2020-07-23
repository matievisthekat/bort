const Command = require("../../structures/base/Command");
const moment = require("moment");

module.exports = class Daily extends Command {
  constructor() {
    super({
      name: "daily",
      category: "Currency",
      description: "Collect your daily reward",
      requiresArgs: false,
      
    });
  }

  async run(msg, args, flags) {
    const daily = await msg.client.models.daily.findOne({
      userID: msg.author.id
    });
    if (daily)
      return msg.channel.send(
        msg.warning(
          `You have already collected your daily reward for ${moment().format(
            "LL"
          )}. Come back tomorrow!`
        )
      );

    const amt = 750;
    await msg.author.currency.add(amt);

    await new msg.client.models.daily({ userID: msg.author.id }).save();

    msg.channel.send(
      msg.success(`You have collected **${amt.toLocaleString()}** coins!`)
    );
  }
};
