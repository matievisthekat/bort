const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "clan",
      category: "Clans",
      description: "View your current clan",
      guildOnlyCooldown: false,
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clan =
      (await msg.client.models.clan.findOne({
        leaderID: msg.author.id
      })) ||
      (await msg.client.models.clan.findOne({
        memberIDs: msg.author.id
      }));

    if (!clan)
      return msg.channel.send(msg.warning("You aren't in any clan yet"));

    const embed = new msg.client.embed()
      .setAuthor(`Clan: ${clan.name}`)
      .setThumbnail(clan.iconURL)
      .addField(
        "Information",
        `**Leader:** <@${clan.leaderID}>
        **Members:** ${
          clan.memberIDs.map((id) => `<@${id}>`).join("\n") || "[ None ]"
        }
        **Pets:** ${
          clan.pets.map((p) => `**${p.name}**`).join(", ") || "[ None ]"
        }`
      )
      .addField(
        "Base",
        `**Health:** ${clan.health}/${clan.maxHealth}\n**Wall Level:** ${clan.wallLevel}`
      )
      .addField("Bank", `**Amount:** ${clan.bank}`);

    return msg.channel.send(embed);
  }
};
