import { Bot } from "../Client";
import { EventOptions } from "../..";

export class CustomEvent {
  constructor(private client: Bot, public readonly opts: EventOptions) {}

  /**
   * run
   * @param {Bot} client The client this was received by
   * @param {*} args The arguments for the event\
   * @returns Anything
   */
  run(client: Bot, ...args: any): any {
    client.logger.warn(
      `Event without run method (dunno why I cant get the file)`
    );
  }

  /**
   * unload
   * @returns The success status of unloading the event
   * @public
   */
  public unload() {
    const res = this.client.evnt.unloadEvent(this.opts.__filename);
    return res;
  }

  /**
   * reload
   * @returns The reloaded event
   * @public
   */
  public reload() {
    const unloadRes = this.unload();
    if (!unloadRes) return unloadRes;

    const res = this.client.evnt.loadEvent(this.opts.__filename);
    return res;
  }
}
