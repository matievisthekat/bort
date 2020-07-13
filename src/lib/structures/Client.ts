import { Client } from "discord.js";
import CommandManager from "./managers/CommandManager";
import EventManager from "./managers/EventManager";

interface IBort {
  token: string;
  mongo_uri: string;
  event_dir: string;
  command_dir: string;
}

class Bort extends Client {
  public evnt: EventManager;
  public cmd: CommandManager;

  constructor(opts: IBort) {
    super(...arguments);

    this.token = opts.token;

    this.evnt = new EventManager(this, opts.event_dir);
    this.cmd = new CommandManager(this, opts.command_dir);
  }

  async load() {
    this.cmd.load();
    this.evnt.load();

    super.login(this.token);
  }
}

export default Bort;
