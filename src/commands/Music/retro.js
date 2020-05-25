const Command = require("../../structures/base/Command");

module.exports = class Chill extends Command {
  constructor() {
    super({
      name: "retro",
      category: "Music",
      description:
        "Play an endless stream of chill music from twitch.tv/onlyhitgold",
      guildOnlyCooldown: true,
      requiresArgs: false,
      guildOnly: true,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    new (require("./genre"))().run(msg, ["retro"], {});
  }
};