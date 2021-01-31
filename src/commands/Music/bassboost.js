const Command = require("../../structures/base/Command");

const levels = {
  none: 0.0,
  low: 0.2,
  medium: 0.3,
  high: 0.35
};

module.exports = class Chill extends (
  Command
) {
  constructor() {
    super({
      name: "bassboost",
      category: "Music",
      description: "Bassboost the current music",
      usage: "<level>",
      examples: ["none", "low", "high"],
      cooldown: "2s",
      guildOnlyCooldown: true,
      requiresArgs: true,
      guildOnly: true,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player)
      return await msg.channel.send(
        msg.warning("There isn't anything playing in this guild")
      );

    const level = levels[args[0]];
    if (typeof level === "undefined")
      return await msg.channel.send(
        msg.warning(
          `Invalid 'level' argument. Please use one of ${Object.keys(levels)
            .map((k) => `'${k}'`)
            .join(", ")}`
        )
      );

    player.setEQ(
      new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[args[0]] }))
    );

    return await msg.channel.send(
      msg.success(`Set the bassboost level to ${args[0]}`)
    );
  }
};
