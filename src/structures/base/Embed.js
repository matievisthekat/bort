const { MessageEmbed } = require("discord.js");
const { x, check, dnd, idle, online } = require("../../constants/emoji");
const { red, green, yellow, def } = require("../../constants/colours");

module.exports = class Embed extends MessageEmbed {
  constructor(data) {
    super(data);
    this.color = def;
    this.setTimestamp();
  }

  get blue() {
    return this.setColor("BLUE");
  }

  setDesc(str) {
    return this.setDescription(str);
  }

  none(msg) {
    return this.setColor(def).setDescription(msg);
  }

  success(msg) {
    return this.setColor(green).setDescription(msg);
  }

  error(msg) {
    return this.setColor(red).setDescription(msg);
  }

  warn(msg) {
    return this.setColor(yellow).setDescription(msg);
  }
};
