const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "",
      aliases: [],
      category: "",
      description: "",
      usage: "",
      examples: [],
      flags: [],
      cooldown: "3s",
      guildOnlyCooldown: false,
      requiresArgs: true,
      requiredPerms: [],
      requriedClientPerms: [],
			guildOnly: true,
      voiceChannelOnly: false,
      currency: false,
      creatorOnly: false
    });
  }

  async run(msg, args, flags) {}
};
