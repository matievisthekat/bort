const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "nowplaying",
      aliases: ["np"],
      category: "Music",
      description: "View the currently playing song",
      cooldown: "5s",
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "There is nothing playing on this server!"
      );

    const np = player.queue[0];

    const part = Math.floor((player.position / np.duration) * 10);
    const duration = msg.client.util.moment(np.duration).format("mm:ss");
    const currPos = msg.client.util.moment(player.position).format("mm:ss");

    const embed = new msg.client.embed()
      .setThumbnail(np.thumbnail)
      .setAuthor(np.title)
      .setURL(np.uri)
      .setDescription(
        `${player.playing ? "▶️" : "⏸️"} ${
          "▬".repeat(part) + "🔘" + "▬".repeat(10 - part)
        }[${currPos}/${duration === "Invalid date" ? "Infinite" : duration}]`
      )
      .setFooter(
        `Song added by ${np.requester ? np.requester.tag : "Unknown"}`
      );

    msg.channel.send(embed);
  }
};
