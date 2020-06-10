const Command = require("../../structures/base/Command");

module.exports = class DeleteClan extends Command {
  constructor() {
    super({
      name: "deleteclan",
      aliases: ["delclan", "dc"],
      category: "Clans",
      description: "Delete your clan",
      cooldown: "1m",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clan = await msg.client.models.clan.findOne({
      leaderID: msg.author.id
    });
    if (!clan)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You aren't a leader of any clan!"
      );

    const name = clan.name;

    await clan.delete();

    return msg.channel.send(msg.success(`I have deleted **${name}**`));
  }
};
