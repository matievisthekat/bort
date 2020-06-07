const Command = require("../../structures/base/Command"),
  Clan = require("../../structures/currency/Clan");

module.exports = class extends Command {
  constructor() {
    super({
      name: "createclan",
      category: "Clans",
      description: "Create a clan of your own!",
      usage: "{clan name}",
      examples: ["The Big Bois"],
      cooldown: "10m",
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clanModel = msg.client.models.clan;

    const name = args.join(" ");
    if (await clanModel.findOne({ name: name }))
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "There is already a clan with that name!"
      );

    if (
      (await clanModel.findOne({
        leaderID: msg.author.id
      })) ||
      (await clanModel.findOne({ memberIDs: msg.author.id }))
    )
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You already own a clan!"
      );

    const col = msg.channel.createMessageCollector(
      (m) => m.author.id === msg.author.id,
      {
        max: 1,
        time: 30000
      }
    );

    msg.channel.send(
      msg.warning(
        `Are you sure you want to create a clan named **${name}**? (yes/no)`
      )
    );

    col.on("collect", async (m) => {
      if (/yes/gi.test(m.content)) {
        col.stop();

        const clan = new Clan(name, msg.author);
        await clan.load();

        const embed = new msg.client.embed()
          .setAuthor(`Clan: ${clan.name}`)
          .setThumbnail(clan.iconURL)
          .addField(
            "Information",
            `**Leader:** ${clan.leader}
            **Members:** ${
              clan.members.map((id) => `<@${id}>`).join("\n") || "[ None ]"
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

        msg.channel.send("**New clan created:**", embed);
      } else {
        return col.stop();
      }
    });

    col.on("end", async (collected) => {
      if (!collected.first())
        msg.channel.send(msg.warning("Cancelled clan creation"));
    });
  }
};
