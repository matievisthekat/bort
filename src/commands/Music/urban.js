const Command = require("../../structures/base/Command");

module.exports = class Chill extends Command {
  constructor() {
    super({
      name: "urban",
      category: "Music",
      description:
        "Play an endless stream of chill music from twitch.tv/urbanorder",
      guildOnlyCooldown: true,
      requiresArgs: false,
      guildOnly: true,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    new (require("./genre"))().run(msg, ["urban"], {});
  }
};
