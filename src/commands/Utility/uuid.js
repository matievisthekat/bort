const Command = require("../../structures/base/Command");
const { v4: uuid } = require("uuid");

module.exports = class Name extends Command {
  constructor() {
    super({
      name: "uuid",
      aliases: ["gentoken"],
      category: "Utility",
      description: "Generate a completely unique UUID or token",
      requiresArgs: false,
      
    });
  }

  async run(msg, args, flags) {
    const id = uuid();
    msg.channel
      .send(id)
      .then((m) =>
        setTimeout(
          () => m.edit(msg.warning("Hope you copied your UUID in time!")),
          5000
        )
      );
  }
};
