import { config as dotenv } from "dotenv";
import { Bot } from "../lib";
import { join } from "path";

dotenv({
  path: join(__dirname, "../../", ".env")
});

const config = require(join(__dirname, "../..", "config.json"));

const client = new Bot(
  {
    presence: {
      activity: {
        name: "you sleep",
        type: "WATCHING"
      },
      status: "idle"
    },
    disableMentions: "all"
  },
  {
    token: process.env.TOKEN,
    mongo_uri: process.env.MONGO_URI,
    prefix: "./",
    devs: ["492708936290402305"],
    event_dir: join(__dirname, "events"),
    command_dir: join(__dirname, "commands"),
    config,
    database: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      port: parseInt(process.env.PG_PORT),
      onStartUp: config.onDatabaseStartUp
    }
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));
client.db.on("ready", (connection) => client.logger.log("Connected to database"));
client.db.on("error", (err) => client.logger.error(err));
client.db.on("notice", (notice) => client.logger.info(notice.message));
client.db.on("notification", (message) => client.logger.warn(message));

client.load().then(() => client.logger.log("Successfully initialized")).catch((err) => client.logger.error(`Failed to initialize: ${err.message}`));