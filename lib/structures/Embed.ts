import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { IConfig } from "..";
const config: IConfig = require("../../../config.json");

export class Embed extends MessageEmbed {
  constructor (data?: MessageEmbed | MessageEmbedOptions) {
    super(data);

    this.setColor(config.colours.default);
  }
}
