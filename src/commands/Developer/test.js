const Command = require("../../structures/base/Command");

module.exports = class Test extends Command {
  constructor() {
    super({
      name: "test",
      category: "Developer",
      description: "Run a test",
      cooldown: "3s",
      requiresArgs: false,
      creatorOnly: true,
    });
  }

  run(msg, args, flags) {
    return msg.channel.send("Test Worked #2!");
  }
};
