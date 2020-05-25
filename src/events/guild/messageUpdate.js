const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("messageUpdate");
  }

  run(client, oldMsg, newMsg) {
    if (
      oldMsg.content.toLowerCase() === newMsg.content.toLowerCase() ||
      oldMsg.author.bot
    )
      return;

    newMsg.run();
  }
};
