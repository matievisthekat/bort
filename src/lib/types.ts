import { CommandManager, EventManager } from "./";
import { PermissionString } from "discord.js";

export interface IArg {
  name: string;
  required?: boolean;
}

export interface ICommand {
  name: string;
  aliases?: Array<string>;
  description: string;
  examples?: Array<string>;
  args?: Array<IArg>;
  usage?: string;
  devOnly?: boolean;
  botPerms?: Array<PermissionString>;
  userPerms?: Array<PermissionString>;
  cooldown?: string;
  __filename: string;
}

export interface IEvent {
  name: string;
  disabled?: boolean;
  __filename: string;
}

export interface IBot {
  token: string;
  prefix: string;
  devs: Array<string>;
  event_dir: string;
  command_dir: string;
}

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
