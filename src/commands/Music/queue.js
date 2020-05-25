const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "queue",
      aliases: ["q"],
      category: "Music",
      description: "View the queue",
      cooldown: "5s",
      guildOnlyCooldown: true,
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "There is nothing playing on this server!"
      );

    if (!player.queue[0]) {
      await msg.client.music.players.destroy(msg.guild.id);
      return msg.channel.send(
        msg.warning("There is nothing playing in this server!")
      );
    }

    const queue = player.queue.slice(0, 10);
    const extra = player.queue.length - queue.length;

    const embed = new msg.client.embed().setDescription(
      `${queue.map((t, i) => `**[${i + 1}]** ${t.title}`).join("\n")}\n\n${
        extra <= 0
          ? ""
          : `And ${extra} more ${extra > 1 ? "tracks" : "track"}...`
      }`
    );

    msg.channel.send(embed);
  }
};
