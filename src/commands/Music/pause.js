const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "pause",
      category: "Music",
      description: "Pause the current track",
      cooldown: "5s",
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

    if (!player.playing)
      return msg.channel.send(
        msg.warning(
          `The player is not playing! Use \`${await msg.prefix(
            false
          )}play\` to resume`
        )
      );

    await player.pause(true);

    msg.channel.send(
      msg.success(`Paused **${player.queue[0].title || "the current song"}**`)
    );
  }
};
