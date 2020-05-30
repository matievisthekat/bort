const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("posted", "dbl");
  }

  async run(client) {
    client.logger.info("TOP.GG server stats posted");
  }
};
