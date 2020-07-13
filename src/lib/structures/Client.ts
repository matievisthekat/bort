import { Client } from "discord.js";
import CommandManager from "./managers/CommandManager";
import EventManager from "./managers/EventManager";
import Logger from "./Logger";
import { IBort } from "../types";

export class Bort extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;
  public logger: Logger;

  constructor(baseOpts, opts: IBort) {
    super(baseOpts);

    this.token = opts.token;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
    this.logger = new Logger();
  }

  async load() {
    this.cmd.load();
    this.evnt.load();

    super.login(this.token);
  }
}
