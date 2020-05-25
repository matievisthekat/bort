const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("error", "dbl");
  }

  async run(client, err) {
    client.logger.error(err.stack);
  }
};
