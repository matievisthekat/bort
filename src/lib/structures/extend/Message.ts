import { Bot } from "../Client";
import { TextChannel, DMChannel, NewsChannel, MessageEmbed, Structures, Client } from "discord.js";
import { PermissionString } from "discord.js";

Structures.extend(
  "Message",
  (Message) =>
    class extends Message {
      constructor(client: Bot | Client, data: object, channel: TextChannel | DMChannel) {
        super(client, data, channel);
      }

      /**
       * warn
       * @param {String|MessageEmbed} msg The message to send
       * @returns A promise
       * @public
       */
      public async warn(msg: string | MessageEmbed, channel: TextChannel | DMChannel | NewsChannel = this.channel): Promise<any> {
        return await channel.send(`:warning: ${msg}`);
      }

      /**
       * success
       * @param {String|MessageEmbed} msg The message to send
       * @returns A promise
       * @public
       */
      public async success(msg: string | MessageEmbed, channel: TextChannel | DMChannel | NewsChannel = this.channel): Promise<any> {
        return await channel.send(`:white_check_mark: ${msg}`);
      }

      /**
       * emoji
       */
      public emoji(type: string): string {
        const perms: PermissionString = "USE_EXTERNAL_EMOJIS";
        let external: boolean = true;

        if (this.guild && (!this.guild.me.hasPermission(perms) || !this.guild.me.permissionsIn(this.channel).has(perms))) {
          external = false;
        }

        const emoji = this.client.config.emoji[type.toLowerCase()];
        if (!emoji) return "";

        return external ? emoji.custom || emoji.default : emoji.default;
      }
    }
);
