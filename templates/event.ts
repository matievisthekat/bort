// @ts-ignore
import { CustomEvent, Bot } from "../../lib/";

export default class extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "",
      __filename
    });
  }

  /**
   * run
   * @param {Bot} client The client that received this event
   */
  public async run(client: Bot): Promise<any> {}
}
