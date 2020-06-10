const Command = require("../../structures/base/Command");

module.exports = class Suggest extends Command {
  constructor() {
    super({
      name: "suggest",
      category: "Utility",
      description: "Suggest something to the server",
      usage: "{suggestion}",
      examples: ["a nice hat"],
      cooldown: "1m"
    });
  }

  async run(msg, args, flags) {
    const data = await msg.client.models.suggestionChannel.findOne({
      guildID: msg.guild.id
    });

    const chan = await msg.client.resolve(
      "channel",
      data ? data.channelID : msg.channel.toString(),
      msg.guild
    );
    if (!chan)
      return msg.channel.send(
        msg.warning("I could not find the suggestions channel for this server!")
      );

    const embed = new msg.client.embed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(args.join(" "))
      .setFooter(`Suggested by ${msg.author.tag}`);

    chan.send("**Pending Review**", embed).then(async (m) => {
      await m.react("✅");
      await m.react("🤷");
      await m.react("❌");

      await new msg.client.models.suggestion({
        guildID: msg.guild.id,
        messageID: m.id,
        accepted: false,
        denied: false
      }).save();
    });

    if (chan.id !== msg.channel.id)
      msg.channel.send(
        msg.success(`Your suggestion was redirected to ${chan}`)
      );
  }
};
