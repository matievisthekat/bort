const { MessageEmbed } = require("discord.js");
const { x, check, dnd, idle, online } = require("../../constants/emoji");
const { red, green, yellow, def } = require("../../constants/colours");

module.exports = class Embed extends MessageEmbed {
  constructor(data) {
    super(data);
    this.color = def;
    this.setTimestamp();
  }

  /**
   * Set the embed's colour to blue
   */
  get blue() {
    return this.setColor("BLUE");
  }

  /**
   * Set the embed's colour to green
   */
  get green() {
    return this.setColor(green);
  }

  /**
   * Set the embed's colour to default
   */
  get default() {
    return this.setColor(def);
  }

  /**
   * Set the embed's colour to red
   */
  get red() {
    return this.setColor(red);
  }

  /**
   * Set the embed's colour to yellow
   */
  get yellow() {
    return this.setColor(yellow);
  }

  /**
   * Get a default embed with a set description
   * @param {String} msg The message to set as the description of the embed
   */
  none(msg) {
    return this.default.setDescription(msg);
  }

  /**
   * Get an embed formatted for a success message
   * @param {String} msg The message to set as the description of the embed
   */
  success(msg) {
    return this.green.setDescription(msg);
  }

  /**
   * Get an embed formatted for an error message
   * @param {String} msg The message to set as the description of the embed
   */
  error(msg) {
    return this.red.setDescription(msg);
  }

  /**
   * Get an embed formatted for a warning message
   * @param {String} msg
   */
  warn(msg) {
    return this.yellow.setDescription(msg);
  }
};
