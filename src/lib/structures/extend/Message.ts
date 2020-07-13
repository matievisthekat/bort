import { Structures, Client } from "discord.js";
import { Bort } from "../Client";
import { TextChannel } from "discord.js";
import { DMChannel } from "discord.js";
import { MessageEmbed } from "discord.js";

Structures.extend(
  "Message",
  (Message) =>
    class extends Message {
      constructor(
        client: Bort | Client,
        data: object,
        channel: TextChannel | DMChannel
      ) {
        super(client, data, channel);
      }

      /**
       * warn
       * @param {String|MessageEmbed} msg The message to send
       * @returns A promise
       * @public
       */
      public async warn(msg: string | MessageEmbed): Promise<any> {
        await this.channel.send(`:warning: ${msg}`);
      }
    }
);
