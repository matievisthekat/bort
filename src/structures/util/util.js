const emoji = require("../../constants/emoji");
const moment = require("moment");
const chalk = require("chalk");
const ms = require("ms");
const axios = require("axios");

const toProperCase = (str) =>
  str.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

const chooseString = (str) => str.split(/\|+/gi).random();
const clapString = (str) => `${str.trim().replace(/ +/gi, ":clap:")}:clap:`;
const xpForLevel = (currentLevel) => (currentLevel + 5) * 600;

const xpUntilNextLevel = (currentLevel, currentXp) =>
  (currentLevel + 5) * 600 - currentXp < 1 ? 1 : currentXp;

const formatCategory = (str) =>
  `${emoji[str.toLowerCase()] || ""} ${toProperCase(str)}`;

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

module.exports = {
  toProperCase,
  formatCategory,
  clapString,
  chooseString,
  paginate: require("./paginate"),
  findNested: require("./findNested"),
  wait: require("util").promisify(setTimeout),
  ms,
  randomInRange,
  xpForLevel,
  xpUntilNextLevel,
  chalk,
  moment,
  axios
};
