import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import config from "../../src/config"

export class Embed extends MessageEmbed {
  constructor (data?: MessageEmbed | MessageEmbedOptions) {
    super(data);

    this.setColor(config.colours.default);
  }
}
