const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("message");
  }

  run(client, msg) {
    msg.run();
  }
};
