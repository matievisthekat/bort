require("dotenv").config();
const cron = require("node-cron");
const { resolve } = require("path");

const Bort = require("./structures/base/Client");
const client = new Bort({
  disableMentions: "everyone",
  loadMusic: process.env.LOAD_MUSIC,
  commandDir: resolve(__dirname, "./commands/"),
  eventDir: resolve(__dirname, "./events/"),
  prefix: process.env.PREFIX || "/",
  token: process.env.TOKEN,
  uri: process.env.MONGO_URI,
  partials: ["REACTION"],
  translateAPIKey: process.env.YANDEX_API_KEY
});

client.init(true).then((res) => client.logger.log(res.message));

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

cron.schedule("59 23 * * *", async function () {
  const dailies = await client.models.daily.find();
  for (const daily of dailies) await daily.delete();
});
