import { config } from "dotenv";
import { Bot } from "../lib";
import { join } from "path";

require("../lib/structures/extend/Message");

config({
  path: join(__dirname, "../../", ".env")
});

const client = new Bot(
  {},
  {
    token: process.env.TOKEN,
    prefix: "./",
    devs: ["492708936290402305"],
    event_dir: join(__dirname, "events"),
    command_dir: join(__dirname, "commands"),
    config: require("./config.json")
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));

client.load().then(() => client.logger.log("Successfully initialized"));
