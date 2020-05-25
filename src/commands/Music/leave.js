const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "leave",
      aliases: ["disconnect"],
      category: "Music",
      description: "Disconnect me from the voice channel",
      cooldown: "5s",
      guildOnlyCooldown: true,
      requiresArgs: false,
      voiceChannelOnly: false
    });
  }

  async run(msg, args, flags) {
    if (!msg.guild.me.voice)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "I am not in a voice channel!"
      );

    const player = await msg.client.music.players.get(msg.guild.id);
    if (player) await msg.client.music.players.destory(msg.guild.id);
    else await msg.guild.me.voice.channel.leave();

    msg.channel.send(msg.success(`I have disconnected`));
  }
};
