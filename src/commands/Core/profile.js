const Command = require("../../structures/base/Command");

module.exports = class Profile extends Command {
  constructor() {
    super({
      name: "profile",
      category: "Core",
      description: "View the profile off someone",
      usage: "<person>",
      examples: ["@MatievisTheKat#4975", "492708936290402305", "", "matievis"],
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Fetching user profile..."));

    const target = await msg.client.resolve(
      "user",
      args.join(" ") || msg.author.id,
      msg.guild
    );
    if (target === null) return m.edit(msg.warning("No target found"));

    const profile = await msg.client.models.profile.findOne({
      userID: target.id
    });

    const embed = new msg.client.embed()
      .setAuthor(target.tag)
      .setThumbnail(
        target.displayAvatarURL({
          size: 512,
          dynamic: true,
          format: "png"
        })
      )
      .addField(
        "Posts & Karma",
        `**Total Posts:** ${
          profile !== null ? profile.postCount : 0
        }\n**Karma:** ${profile !== null ? profile.karma : 0}`,
        true
      )
      .setFooter(
        `Requested by ${msg.author.tag}`,
        msg.author.displayAvatarURL({ dynamic: true })
      );

    m.edit("", embed);
  }
};
