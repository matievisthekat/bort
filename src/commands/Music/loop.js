const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "loop",
      aliases: ["repeat"],
      category: "Music",
      description: "Loop or un-loop the current song or the entire queue",
      usage: "<song | queue>",
      examples: ["song", "", "queue"],
      cooldown: "10s",
      guildOnlyCooldown: true,
      requiresArgs: false,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player)
      return msg.channel.send(
        msg.warning("There is nothing playing on this server!")
      );

    const opt = !["song", "queue"].includes(args[0]) ? "queue" : args[0];
    switch (opt) {
      case "song":
        await player.setTrackRepeat(!player.trackRepeat);
        return msg.channel.send(
          msg.success(
            `I am ${
              player.trackRepeat
                ? "now looping the current song"
                : "no longer looping the current song"
            }`
          )
        );

      case "queue":
        await player.setQueueRepeat(!player.queueRepeat);
        return msg.channel.send(
          msg.success(
            `I am ${
              player.queueRepeat
                ? "now looping the queue"
                : "no longer looping the queue"
            }`
          )
        );

      default:
        await player.setQueueRepeat(!player.queueRepeat);
        return msg.channel.send(
          msg.success(
            `I am ${
              player.queueRepeat
                ? "now looping the queue"
                : "no longer looping the queue"
            }`
          )
        );
    }
  }
};
