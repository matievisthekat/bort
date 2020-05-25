const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("name", "type");
  }

  async run(client, ...args) {}
};
