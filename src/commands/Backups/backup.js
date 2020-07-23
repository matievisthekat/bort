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
    const backup =
      (await msg.client.models.backups.findOne({
        guildID: msg.guild.id
      })) ?? new msg.client.models.backups({ guildID: msg.guild.id });

    backups
      .create(msg.guild, {
        maxMessagesPerChannel: 10
      })
      .then(async (data) => {
        backup.data = data;
        await backup.save();

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
