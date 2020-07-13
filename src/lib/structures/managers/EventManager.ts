import { EventEmitter } from "events";
import { Bort } from "../Client";
import { BortEvent } from "../base/Event";
import { findNested } from "../util/findNested";
import { Collection } from "discord.js";

class EventManager extends EventEmitter {
  public events: Collection<string, BortEvent> = new Collection();

  constructor(private client: Bort, private dir: string) {
    super(...arguments);
  }

  /**
   * load
   * @retruns A collection of events
   * @public
   */
  public load(): Collection<string, BortEvent> {
    const files = findNested(this.dir);
    for (const file of files) this.loadEvent(file);

    this.emit("ready", this.events);
    return this.events;
  }

  /**
   * unloadEvent
   * @param {String} path The file path of the event
   * @returns The success status of unloading the event
   * @public
   */
  public unloadEvent(path: string): boolean {
    const event = this.events.find((e) => e.opts.__filename === path);
    if (!event) return false;

    this.client.removeAllListeners(event.opts.name);
    delete require.cache[event.opts.__filename];
    this.events.delete(event.opts.name);

    return true;
  }

  /**
   * loadEvent
   * @param {String} path The file poth of the event
   * @returns The loaded command or the sucess status of loading the event
   * @public
   */
  public loadEvent(path: string): BortEvent | boolean {
    const required = require(path);

    const event = new required.default(this.client);
    if (!event.opts.name) return false;

    this.client.on(event.opts.name, event.run.bind(null, this.client));
    this.events.set(event.opts.name, event);

    return event;
  }
}

export default EventManager;
