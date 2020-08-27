import { Bot } from "../Client";
import { EventOptions } from "../..";

export class CustomEvent {
  constructor(private client: Bot, public readonly opts: EventOptions) {}

  /**
   * unload
   * @returns The success status of unloading the event
   * @public
   */
  public unload(): boolean {
    const res = this.client.evnt.unloadEvent(this.opts.__filename);
    return res;
  }

  /**
   * reload
   * @returns The reloaded event
   * @public
   */
  public reload(): boolean | CustomEvent {
    const unloadRes = this.unload();
    if (!unloadRes) return unloadRes;

    const res = this.client.evnt.loadEvent(this.opts.__filename);
    return res;
  }
}
