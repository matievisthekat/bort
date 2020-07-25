import { config } from "dotenv";
import { Bot } from "../lib";
import { join } from "path";

config({
  path: join(__dirname, "../../", ".env")
});

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
    config: require(join(__dirname, "../..", "config.json")),
    database: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      port: parseInt(process.env.PG_PORT),
      onStartUp: {
        tables: {
          create: [
            {
              name: "testing",
              contraints: ["NOT NULL"],
              cols: [
                {
                  name: "user_id",
                  dataType: "TEXT",
                  contraints: ["PRIMARY KEY", "NOT NULL"],
                },
                {
                  name: "user_name",
                  dataType: "VARCHAR",
                  length: 50,
                  contraints: ["NOT NULL"]
                }
              ]
            }
          ]
        },
        quries: [
          "INSERT INTO testing(user_id, user_name) VALUES(12345678, 'matievisthekat')",
          "SELECT * FROM testing"
        ]
      },
    }
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));
client.db.on("ready", (connection) => client.logger.log("Connected to database"));
client.db.on("error", (err) => client.logger.error(`DATABASE: ${err}`));

client.load().then(() => client.logger.log("Successfully initialized"));
