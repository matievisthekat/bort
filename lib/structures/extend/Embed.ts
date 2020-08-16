import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import config from "../../../src/config";

export class Embed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);

    this.setColor(config.colours.default);
  }

  public get red() {
    return this.setColor(config.colours.red);
  }

  public get yellow() {
    return this.setColor(config.colours.yellow);
  }

  public get green() {
    return this.setColor(config.colours.green);
  }
}
