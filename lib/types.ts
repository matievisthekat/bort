import { CommandManager, EventManager, Command } from ".";
import { ImageSize, PermissionString } from "discord.js";
import { Embed } from "./structures/extend/Embed";
import { APIOptions } from "../api";
import { Logger } from "./structures/Logger";
import { ImageAPIEndpoint } from "./structures/Util";
import { ConnectionOptions } from "mongoose";

export interface ArgOptions {
  name: string;
  desc: string;
  required?: boolean;
}

export interface DatabaseOptions {
  options: ConnectionOptions;
  host: string;
  port?: string;
  db: string;
  user: string;
  password: string;
  modelsPath: string;
}

/*
NOT NULL      https://www.postgresqltutorial.com/postgresql-not-null-constraint/
UNIQUE        https://www.postgresqltutorial.com/postgresql-unique-constraint/
PRIMARY KEY   https://www.postgresqltutorial.com/postgresql-primary-key/
CHECK         https://www.postgresqltutorial.com/postgresql-check-constraint/
FOREIGN KEY   https://www.postgresqltutorial.com/postgresql-foreign-key/
*/
export type DatabaseContraint = "NOT NULL" | "UNIQUE" | "PRIMARY KEY" | "CHECK" | "FOREIGN KEY";

// https://www.postgresqltutorial.com/postgresql-data-types/
export type DataType =
  | "bool"
  | "boolean"
  | "CHAR"
  | "VARCHAR"
  | "TEXT"
  | "SMALLINT"
  | "INT"
  | "SERIAL"
  | "float"
  | "real"
  | "float8"
  | "numeric"
  | "DATE"
  | "TIME"
  | "TIMESTAMP"
  | "TIMESTAMPZ"
  | "INTERVAL"
  | "JSON"
  | "JSONB"
  | "UUID"
  | "box"
  | "line"
  | "point"
  | "lseg"
  | "polygon"
  | "inet"
  | "macaddr";

export type HTTPMethod = "get" | "post" | "delete";

export interface DatabaseTableOptions {
  name: string;
  contraints: Array<DatabaseContraint>;
  cols: Array<{
    name: string;
    dataType: DataType;
    length?: number;
    contraints: Array<DatabaseContraint>;
  }>;
}

export interface CommandOptions {
  name: string;
  aliases?: Array<string>;
  category: string;
  description: string;
  examples?: Array<string>;
  args?: Array<ArgOptions>;
  usage?: string;
  devOnly?: boolean;
  botPerms?: Array<PermissionString>;
  userPerms?: Array<PermissionString>;
  cooldown?: string;
  __filename?: string;
}

export type ImageCommands = Array<ImageCommand>;

export interface ImageCommand {
  name: ImageAPIEndpoint;
  description: string;
  avSize: ImageSize;
  text?: boolean;
  target?: boolean;
  colour?: boolean;
  maxLength?: number;
}

export type CustomMessageType = "warn" | "success" | "error";

export interface EventOptions {
  name: string;
  disabled?: boolean;
  __filename: string;
}

export interface BotOptions {
  token: string;
  prefix: string;
  devs: Array<string>;
  event_dir: string;
  command_dir: string;
  database: DatabaseOptions;
  api: APIOptions;
}

export interface CommandRunOptions {
  command: Command;
  args: Array<string>;
  flags: Record<string, boolean>;
}

export interface IConfig {
  emoji: Record<string, string>;
  colours: {
    default: string;
    green: string;
    red: string;
    yellow: string;
  };
  imageAPI: ImageAPIOptions;
  api: APIOptions;
}

export interface ImageAPIOptions {
  host: string;
  port: number;
  password: string | void;
}

export interface CommandResult {
  done: boolean;
}

export interface ExecuteResult {
  stdin: string;
  stdout: string;
  stderr: string;
  error: Error | string;
}

declare module "discord.js" {
  interface Client {
    prefix: string;
    cmd: CommandManager;
    evnt: EventManager;
    config: IConfig;
    devs: Array<UserResolvable>;
    logger: Logger;
    Embed: Constructable<Embed>;

    getUserOrMember(value: string, guild?: Guild): Promise<User | GuildMember | void>;
    getRole(value: string, guild: Guild): Promise<Role | void>;
    getChannel(
      type: "category" | "text" | "voice" | "news" | "store",
      value: string,
      guild: Guild
    ): GuildChannel | void;
  }

  interface Message {
    emoji(type: string): string;
    format(type: CustomMessageType, msg: string | MessageEmbed): string | MessageEmbed;
    send(
      type: CustomMessageType,
      msg: string | MessageEmbed,
      channel?: TextChannel | DMChannel | NewsChannel
    ): Promise<Message>;
  }

  interface User {
    developer: boolean;
  }
}
