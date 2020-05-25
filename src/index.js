require("dotenv").config();
const fs = require("fs");
const { resolve } = require("path");

const Bort = require("./structures/base/Client");
const client = new Bort({
  disableMentions: "everyone",
  loadMusic: process.env.LOAD_MUSIC,
  commandDir: resolve(__dirname, "./commands/"),
  eventDir: resolve(__dirname, "./events/"),
  prefix: process.env.PREFIX || "/",
  token: process.env.TOKEN,
  uri: process.env.URI,
  partials: ["REACTION"],
  translateAPIKey: process.env.YANDEX_API_KEY
});

client.init({ login: true }).then((res) => client.logger.log(res.message));

require("discord.js/src/util/Constants.js").DefaultOptions.ws.properties.$browser =
  "Discord iOS";

String.prototype.toProperCase = function () {
  return this.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
