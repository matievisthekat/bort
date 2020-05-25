const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "leaveclan",
      aliases: ["lc"],
      category: "Clans",
      description: "Leave the clan you are in",
      cooldown: "1m",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clanModel = msg.client.models.clan;

    if (await clanModel.findOne({ leaderID: msg.author.id }))
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You cannot leave your own clan! Try `deleteclan` instead"
      );

    const clan = await clanModel.findOne({ memberIDs: msg.author.id });

    if (!clan)
      return await msg.client.errors.custom(msg, msg.channel, "You are not in any clan!");

    clan.memberIDs = clan.memberIDs.splice(
      clan.memberIDs.indexOf(msg.author.id),
      1
    );

    await clan.save().catch((err) => msg.client.errors.saveFailr(msg, msg, err));

    msg.channel.send(
      msg.success(`You have been removed from **${clan.name}**`)
    );
  }
};
