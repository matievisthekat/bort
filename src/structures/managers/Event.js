const { findNested } = require("../util/util"),
  { Collection } = require("discord.js");

module.exports = class EventManager {
  constructor(options = {}) {
    this.dir = options.directory;
    this.client = options.client;
    this.events = new Collection();

    this.client.web.app.get(
      `/api/${this.client.config.apiVersion}/events`,
      (req, res) => {
        const events = this.events.array();

        res.send({ events }).status(200);
      }
    );
  }

  load() {
    const files = findNested(this.dir, ".js");
    for (const file of files) {
      const evnt = new (require(file))();
      if (!evnt.run || !evnt.name) continue;

      if (evnt.type === "dbl")
        this.client.dbl.on(evnt.name, evnt.run.bind(null, this.client));
      else if (evnt.type === "dbl-webhook")
        this.client.dbl.webhook.on(evnt.name, evnt.run.bind(null, this.client));
      else this.client.on(evnt.name, evnt.run.bind(null, this.client));

      this.events.set(evnt.name, evnt);
    }

    this.client.logger.log(`Loaded ${files.length} events`);

    return { message: "Successfully loaded events", status: 200 };
  }

  // unloadEvent(evtName) {
  //   this.events.set(evtName, false);
  //   return { message: `Successfully unloaded ${evtName}`, status: 200 };
  // }
};
