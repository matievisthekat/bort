import { config } from "dotenv";
import { Bort } from "../lib";
import { join } from "path";
import CommandManager from "../lib/structures/managers/CommandManager";
import EventManager from "../lib/structures/managers/EventManager";

config({
  path: join(__dirname, "../../", ".env")
});

declare module "discord.js" {
  interface Client {
    prefix: string;
    cmd: CommandManager;
    evnt: EventManager;
  }
}

const client = new Bort(
  {},
  {
    token: process.env.TOKEN,
    prefix: "./",
    event_dir: join(__dirname, "events"),
    command_dir: join(__dirname, "commands")
  }
);

client.cmd.on("ready", (commands) =>
  client.logger.log(`Loaded ${commands.size} commands`)
);
client.evnt.on("ready", (events) =>
  client.logger.log(`Loaded ${events.size} events`)
);

client.load().then(() => client.logger.log("Successfully initialized"));
