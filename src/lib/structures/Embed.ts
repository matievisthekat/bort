import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { IConfig } from "../types";
const config: IConfig = require("../../../config.json");

export class Embed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);

    this.color = config.embed.colour.default;
  }
}
