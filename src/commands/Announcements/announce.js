const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "announce",
      category: "Announcements",
      description: "Announce a message to the channels followers",
      usage: "{message}",
      examples: ["hi"],
      flags: ["embed"],
      cooldown: "10s",
      guildOnlyCooldown: true
    });
  }

  async run(msg, args, flags) {
    const data = await msg.client.models.announcementChannel.findOne({
      channelID: msg.channel.id
    });
    if (!data)
      return msg.channel.send(
        new msg.client.embed().error(
          `This is not an announcement channel! Use \`${await msg.prefix(
            false
          )}setup\` to fix this`
        )
      );

    const content = flags["embed"]
      ? new msg.client.embed()
          .setDescription(args.join(" "))
          .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      : args.join(" ");

    await msg.client.announce(data, content);

    if (msg.deletable) await msg.delete();
    msg.channel.send(content);
  }
};
