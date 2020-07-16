import { CustomEvent, Bot } from "../../lib/";
import { Message } from "discord.js";

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
   * @param {Message} oldMsg The old message
   * @param {Message} msg The updated message
   */
  public async run(client: Bot, oldMsg: Message, msg: Message): Promise<any> {
    if (oldMsg.content.toLowerCase() === msg.content.toLowerCase()) return;

    const event = client.evnt.events.get("message");
    if (event) return await event.run(client, msg);
  }
}
