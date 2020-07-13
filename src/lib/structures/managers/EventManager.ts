import { EventEmitter } from "events";
import Bort from "../Client";
import _Event from "../base/Event";
import findNested from "../util/findNested";
import { Collection } from "discord.js";

class EventManager extends EventEmitter {
  public events: Collection<string, _Event>;

  constructor(private client: Bort, private dir: string) {
    super(...arguments);
  }

  load() {
    const files = findNested(this.dir);
    for (const file of files) {
      const required = require(file);
      if (typeof required !== "function") continue;

      const event = new required();
      if (!event.name) continue;

      this.client.on(event.name, event.run.bind(null, this.client));
      this.events.set(event.name, event);
    }

    this.emit("ready");
  }
}

export default EventManager;
