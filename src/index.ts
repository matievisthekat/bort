import { Bot, Command, Arg, CommandResult, Util } from "../lib";
import { join } from "path";
import { Message } from "discord.js";
import { imageCommands } from "./imageCommands";

Util.loadEnv(join(__dirname, "../../", ".env.json"));

import config from "./config";
const client = new Bot(
  {
    ws: {
      ///@ts-ignore
      properties: {
        $browser: "Discord iOS",
      },
    },
    presence: {
      activity: {
        name: "you sleep",
        type: "WATCHING",
      },
      status: "idle",
    },
    disableMentions: "all",
  },
  {
    token: process.env["bot.token"],
    prefix: "./",
    devs: ["492708936290402305"],
    event_dir: join(__dirname, "events"),
    command_dir: join(__dirname, "commands"),
    database: {
      host: process.env["postgres.host"],
      database: process.env["postgres.database"],
      user: process.env["postgres.user"],
      password: process.env["postgres.password"],
      port: parseInt(process.env["postgres.port"]),
      onStartUp: config.onDatabaseStartUp,
    },
    api: {
      port: config.api.port,
      development: config.api.development,
      auth: "dev",
      routes: join(__dirname, "../api/routes"),
    },
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));
client._api.on("ready", (app) => client.logger.log(`API listening on port ${client._api.port}`));
client.db.on("ready", (connection) => client.logger.log("Connected to database"));
client.db.on("error", (err) => client.logger.error(err));
client.db.on("notice", (notice) => client.logger.info(notice.message));
client.db.on("notification", (message) => client.logger.warn(message));

process.on("uncaughtException", (err) => client.handleProcessError(err));
process.on("unhandledRejection", (err) => client.handleProcessError(err));
process.on("uncaughtExceptionMonitor", (err) => client.handleProcessError(err));

client
  .load()
  .then(([success, err]) => {
    if (err) console.error(err);
    if (!success) return console.log("Failed to initialize. There should be additional logging above");

    for (const cmd of imageCommands) {
      const examples = cmd.text ? ["some nice text content"] : cmd.target ? ["@MatievisTheKat#4975"] : cmd.colour ? ["#ffffff", "red"] : [];

      const args = cmd.text
        ? [new Arg("text", "The text to generate an image with", true)]
        : cmd.target
        ? [new Arg("user", "The user to target", true)]
        : cmd.colour
        ? [new Arg("colour", "The colour to get an image of", true)]
        : null;

      const command = new Command(client, {
        name: cmd.name,
        description: cmd.description,
        category: "Image",
        examples,
        args,
        botPerms: ["ATTACH_FILES"],
        cooldown: "5s",
      });

      command.run = async (msg, { command, args, flags }): Promise<CommandResult | Message> => {
        return await Util.imageCommand(cmd.name, msg, args, cmd.avSize, cmd.colour, cmd.text, cmd.target, cmd.maxLength ?? 0, cmd.target);
      };

      client.cmd.registerCommand(command);
    }

    client.logger.log("Successfully initialized");
  })
  .catch((err) => client.logger.error(`Failed to initialize: ${err.message}`));
