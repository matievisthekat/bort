import { Bort } from "../Client";
import { IEvent } from "../../types";

export class _Event {
  constructor(private client: Bort, public opts: IEvent) {}

  async run(client, ...args): Promise<any> {
    this.client.logger.warn(
      `Event without run method at ${this.opts.__filename}`
    );
  }

  unload() {
    const res = this.client.evnt.unloadEvent(this.opts.__filename);
    return res;
  }
}
