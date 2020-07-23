const Command = require("../../structures/base/Command");
const backups = require("discord-backup");

module.exports = class extends Command {
  constructor() {
    super({
      name: "backup",
      aliases: [],
      category: "Backups",
      description: "Create a backup of this server",
      cooldown: "30m",
      guildOnlyCooldown: true,
      requiresArgs: false,
      requiredPerms: ["ADMINISTRATOR"],
      requiredClientPerms: ["ADMINISTRATOR"]
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Creating backup..."));

    backups
      .create(msg.guild, {
        maxMessagesPerChannel: 10
      })
      .then(async (data) => {
        console.log(data);
        await m.edit(
          msg.success(
            `Created backup \`${data.id}\`. Use \`${await msg.prefix(
              false
            )}loadbackup ${data.id}\` to load this backup`
          )
        );
      });
  }
};
