const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("vote");
  }

  async run(client, voter, bot) {
    const logChan = client.channels.cache.get(client.config.channels.vote);
    if (logChan) {
      const embed = new client.embed().green
        .setAuthor(
          voter ? voter.tag : "Unknown",
          voter && voter.displayAvatarURL
            ? voter.displayAvatarURL()
            : client.config.defaultUserAvatarURL
        )
        .setDescription(
          `${voter ? `${voter} (${voter.tag})` : "Unknown"} just voted for ${
            bot ? `${bot} (${bot.tag})` : "Unknown"
          } ${
            bot && bot.id === client.user.id
              ? `and earned ${client.config.voteReward}`
              : ""
          }`
        );

      logChan.send(embed);
    } else
      client.logger.warn(
        "Someone voted but the vote log channel was not found!"
      );

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
