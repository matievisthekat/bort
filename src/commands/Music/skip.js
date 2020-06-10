const Command = require("../../structures/base/Command");

module.exports = class Skip extends Command {
  constructor() {
    super({
      name: "skip",
      aliases: ["next"],
      category: "Music",
      description: "Skip the current song",
      cooldown: "4s",
      guildOnlyCooldown: true,
      requiresArgs: false,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "There is nothing playing on this server!"
      );

    if (!player.queue[1] || !player.queue[0])
      return skipAndDestroy(msg, player);
    else skip(msg, player);
  }
};

async function skip(msg, player) {
  const previous = player.queue[0];
  const now = player.queue[1];

  await player.stop();
  if (!player.playing) await player.play();

  msg.channel.send(
    msg.success(
      `Stopped **${
        previous.title || "the current song"
      }** and started playing **${now.title || "the next song"}**`
    )
  );
}

async function skipAndDestroy(msg, player) {
  const previous = player.queue[0];

  await player.stop();
  await msg.client.music.players.destroy(msg.guild.id);

  msg.channel.send(
    msg.success(
      `Skipped **${
        previous.title || "the current song"
      }** and stopped the player`
    )
  );
}
