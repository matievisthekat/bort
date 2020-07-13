import { EventEmitter } from "events";
import { Bort } from "../Client";
import { _Event } from "../base/Event";
import { findNested } from "../util/findNested";
import { Collection } from "discord.js";

class EventManager extends EventEmitter {
  public events: Collection<string, _Event>;

  constructor(private client: Bort, private dir: string) {
    super(...arguments);
  }

  load() {
    const files = findNested(this.dir);
    for (const file of files) this.loadEvent(file);

    this.emit("ready");
  }

  unloadEvent(path: string): boolean {
    const event = this.events.find((e) => e.opts.__filename === path);
    if (!event) return false;

    this.client.removeAllListeners(event.opts.name);
    delete require.cache[event.opts.__filename];
    this.events.delete(event.opts.name);

    return true;
  }

  loadEvent(path: string): _Event | boolean {
    const required = require(path);
    if (typeof required !== "function") return false;

    const event = new required();
    if (!event.opts.name) return false;

    this.client.on(event.opts.name, event.run.bind(null, this.client));
    this.events.set(event.opts.name, event);

    return event;
  }
}

export default EventManager;
