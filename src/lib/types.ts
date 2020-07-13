import { PermissionResolvable } from "discord.js";

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
  botPerms: PermissionResolvable;
  userPerms: PermissionResolvable;
  cooldown?: string;
  __filename: string;
}

export interface IEvent {
  name: string;
  disabled?: boolean;
  __filename: string;
}

export interface IBort {
  token: string;
  prefix: string;
  devs: Array<string>;
  event_dir: string;
  command_dir: string;
}
