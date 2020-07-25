import { Bot } from "../Client";
import { TextChannel, DMChannel, NewsChannel, MessageEmbed, Structures, Client, PermissionString, Message } from "discord.js";
import { Embed } from "../Embed";



Structures.extend("Message", (Message) => class extends Message {
  constructor (client: Bot | Client, data: object, channel: TextChannel | DMChannel) {
    super(client, data, channel);
  }

  /**
   * warn
   * @param {String|MessageEmbed} msg The message to send
   * @returns {Promise<Message>} The message that was sent
   * @public
   */
  public async warn(msg: string | MessageEmbed, channel: TextChannel | DMChannel | NewsChannel = this.channel): Promise<Message> {
    return await channel.send(`${this.emoji("warn")} ${msg}`);
  }

  /**
   * success
   * @param {String|MessageEmbed} msg The message to send
   * @returns {Promise<Message>} The message that was sent
   * @public
   */
  public async success(msg: string | MessageEmbed, channel: TextChannel | DMChannel | NewsChannel = this.channel): Promise<Message> {
    return await channel.send(`${this.emoji("success")} ${msg}`);
  }

  /**
   * error
   * @param {String|MessageEmbed} msg The message to send
   * @returns {Promise<Message>} The message that was sent
   * @public
   */
  public async error(msg: string | MessageEmbed, channel: TextChannel | DMChannel | NewsChannel = this.channel): Promise<Message> {
    return await channel.send(`${this.emoji("error")} ${msg}`);
  }

  /**
   * emoji
   * @param {string} type The type of emoji to search for
   * @returns {string} The emoji string
   * @public
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

  /**
   * @returns {Embed} A new embed
   * @public
   */
  public embed() {
    return new Embed();
  }
});
