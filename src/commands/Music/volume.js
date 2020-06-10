const Command = require("../../structures/base/Command");

module.exports = class Volume extends Command {
  constructor() {
    super({
      name: "volume",
      aliases: ["vol"],
      category: "Music",
      description:
        "Set the volume or view what the current volume it at\n\n- <volume> The new value to set the voume to",
      usage: "<volume>",
      examples: ["10", ""],
      cooldown: "5s",
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

    if(player.voiceChannel.id !== msg.member.voice.channel.id)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You need to be listening to me in the same voice channel to change the volume"
      );

    if (args[0]) {
      const amt = parseInt(args[0]);
      if (!amt || amt > 100 || amt < 1)
        return await msg.client.errors.custom(msg, 
          msg.channel,
          "You need to specify a number between 1 and 100 as the new volume"
        );

      await player.setVolume(amt);

      msg.channel.send(msg.success(`Set the volume to ${player.volume}%`));

      if (!player.playing) await player.play();
    } else {
      msg.channel.send(
        msg.warning(`The current volume is at ${player.volume}%`)
      );
    }
  }
};
