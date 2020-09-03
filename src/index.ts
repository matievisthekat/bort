/* eslint-disable indent */
import { Bot, Command, Arg, CommandResult, Util } from "../lib";
import { join } from "path";
import { Message } from "discord.js";
import { imageCommands } from "./imageCommands";

Util.loadEnv(join(__dirname, "../../", ".env.json"));

import config from "./config";
const client = new Bot(
  {
    ws: {
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
    eventDir: join(__dirname, "events"),
    commandDir: join(__dirname, "commands"),
    database: {
      host: process.env["db.host"],
      user: process.env["db.user"],
      password: process.env["db.password"],
      port: process.env["db.port"],
      db: process.env["db.name"],
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      modelsPath: join(__dirname, "models"),
    },
    api: config.api,
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));
client._api.on("ready", () => client.logger.log(`API listening on port ${client._api.port}`));
client.db.on("ready", () => client.logger.log(`Connected to database at ${process.env["db.host"]}`));
client.db.on("error", (err) => client.logger.error(err));

process.on("uncaughtException", (err) => client.handleProcessError(err));
process.on("unhandledRejection", (err) => client.handleProcessError(err));
process.on("uncaughtExceptionMonitor", (err) => client.handleProcessError(err));

client
  .load()
  .then(([success, err]) => {
    if (err) console.error(err);
    if (!success) return console.log("Failed to initialize. There should be additional logging above");

    for (const cmd of imageCommands) {
      const examples = cmd.text
        ? ["some nice text content"]
        : cmd.target
        ? ["@MatievisTheKat#4975"]
        : cmd.colour
        ? ["#ffffff", "red"]
        : [];

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

      command.run = async (msg: Message, { args: runArgs }): Promise<CommandResult | Message> => {
        return Util.imageCommand(
          cmd.name,
          msg,
          runArgs,
          cmd.avSize,
          cmd.colour,
          cmd.text,
          cmd.target,
          cmd.maxLength ?? 0,
          cmd.target
        );
      };

      client.cmd.registerCommand(command);
    }

    client.logger.log("Successfully initialized");
  })
  .catch((err) => client.logger.error(`Failed to initialize: ${err.message}`));
