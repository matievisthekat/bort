const Command = require("../../structures/base/Command");

module.exports = class LeaveClan extends Command {
  constructor() {
    super({
      name: "leaveclan",
      aliases: ["lc"],
      category: "Clans",
      description: "Leave the clan you are in",
      cooldown: "1m",
      requiresArgs: true,
      usage: "{clan_name}",
      examples: ["the kats"],
    });
  }

  async run(msg, args, flags) {
    const clanModel = msg.client.models.clan;

    if (await clanModel.findOne({ leaderID: msg.author.id }))
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You cannot leave your own clan! Try `deleteclan` instead"
      );

    const clan = await clanModel.findOne({
      name: args.join(" "),
      memberIDs: msg.author.id
    });
    if (!clan)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You are not in that clan!"
      );

    clan.memberIDs.splice(
      clan.memberIDs.indexOf(msg.author.id),
      1
    );

    await clan.save().catch((err) => msg.client.errors.saveFail(msg, msg, err));

    msg.channel.send(msg.success(`You have left from **${clan.name}**`));
  }
};
