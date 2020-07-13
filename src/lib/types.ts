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
