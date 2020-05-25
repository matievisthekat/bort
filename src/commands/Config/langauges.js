const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "langauges",
      aliases: ["langs"],
      category: "Config",
      description: "View all available langauges to switch to",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    if (!msg.client.availableLangs[0])
      return msg.channel.send(
        msg.warning(
          `Oops! Looks like the langauges have not been loaded. If this doesn't work in a few minutes please contact the developer (${msg.client.config.creators.tags[0]})`
        )
      );

    const embeds = [];
    for (let i = 0; i < msg.client.availableLangs.length; i += 10) {
      const langs = msg.client.availableLangs.slice(i, i + 10);
      const embed = new msg.client.embed().blue
        .setAuthor(
          `Available Langauges (${msg.client.availableLangs.length})`,
          msg.author.displayAvatarURL()
        )
        .setDescription(langs.map((lang) => `${lang.name} (${lang.code})`));
      embeds.push(embed);
    }

    await msg.client.util.paginate(msg, embeds);
  }
};
