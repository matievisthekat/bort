import { CommandManager, EventManager } from "../lib";

declare module "discord.js" {
  interface Client {
    prefix: string;
    cmd: CommandManager;
    evnt: EventManager;
  }

  interface Message {
    warn(
      msg: string | MessageEmbed,
      channel?: TextChannel | DMChannel | NewsChannel
    ): Promise<any>;
    success(
      msg: string | MessageEmbed,
      channel?: TextChannel | DMChannel | NewsChannel
    ): Promise<any>;
  }
}
