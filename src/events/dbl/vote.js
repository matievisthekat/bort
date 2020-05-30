const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("vote", "dbl");
  }

  async run(client, voter, bot, isWeekend) {
    const logChan = client.channels.cache.get(client.config.voteLogChannelID);
    if (logChan) {
      const embed = new client.embed().green
        .setAuthor(
          voter ? voter.tag : "Unknown",
          voter ? voter.displayAvatarURL() : client.config.defaultUserAvatarURL
        )
        .setDescription(
          `${`${voter} (${voter.tag})` || "Unknown"} just voted for ${
            `${bot} (${bot.tag})` || "Unknown"
          } ${
            bot && bot.id === client.user.id
              ? `and earned ${client.config.voteReward}`
              : ""
          }`
        );

      logChan.send(embed);
    }

    const user = await client.models.money.findOne({
      userID: voter ? voter.id : ""
    });
    if (user) {
      user.wallet += client.config.voteRewardAmount;
      user.bankLimit += client.util.randomInRange(10, 50);
      user.economyXp += client.util.randomInRange(20, 70);

      await user.save();
    }
  }
};
