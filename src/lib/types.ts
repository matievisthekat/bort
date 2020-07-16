import { CommandManager, EventManager } from "./";
import { PermissionString } from "discord.js";
import { Command } from "./structures/base/Command";

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
  config: IConfig;
}

export interface ICommandRun {
  command: Command;
  args: Array<string>;
  flags: any;
}

export interface IConfigEmbed {
  colour: any;
}

export interface IConfig {
  emoji: object;
  embed: IConfigEmbed;
}

export interface ICommandDone {
  done: boolean;
}

declare module "discord.js" {
  interface Client {
    prefix: string;
    cmd: CommandManager;
    evnt: EventManager;
    config: IConfig;
  }

  interface Message {
    warn(msg: string | MessageEmbed, channel?: TextChannel | DMChannel | NewsChannel): Promise<any>;
    success(msg: string | MessageEmbed, channel?: TextChannel | DMChannel | NewsChannel): Promise<any>;
  }
}
