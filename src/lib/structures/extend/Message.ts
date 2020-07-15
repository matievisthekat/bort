import { Bot } from "../Client";
import {
  TextChannel,
  DMChannel,
  NewsChannel,
  MessageEmbed,
  Structures,
  Client
} from "discord.js";

Structures.extend(
  "Message",
  (Message) =>
    class extends Message {
      constructor(
        client: Bot | Client,
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
      public async warn(
        msg: string | MessageEmbed,
        channel: TextChannel | DMChannel | NewsChannel = this.channel
      ): Promise<any> {
        return await channel.send(`:warning: ${msg}`);
      }

      /**
       * success
       * @param {String|MessageEmbed} msg The message to send
       * @returns A promise
       * @public
       */
      public async success(
        msg: string | MessageEmbed,
        channel: TextChannel | DMChannel | NewsChannel = this.channel
      ): Promise<any> {
        return await channel.send(`:white_check_mark: ${msg}`);
      }
    }
);
