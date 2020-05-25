const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "end",
      aliases: ["stop"],
      category: "Music",
      description: "End the music stream",
      requiresArgs: false,
      voiceChannelOnly: false
    });
  }

  async run(msg, args, flags) {
    const player = await msg.client.music.players.get(msg.guild.id);
    if (!player || !player.voiceChannel)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "There is nothing playing on this server!"
      );

    await msg.client.music.players.destroy(msg.guild.id);

    msg.channel.send(msg.success("The music has been stopped for this server"));
  }
};
