import { CommandManager, EventManager, Command } from ".";
import { ImageSize, PermissionString } from "discord.js";
import { Embed } from "./structures/extend/Embed";
import { APIOptions } from "../api";
import { Logger } from "./structures/Logger";
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

export type LoadFilesCallback = (file: string) => unknown;

export type ImageAPIQuery = "avatar" | "color" | "text" | "target";

export type ImageAPIEndpoint =
  | "religion" // Image url: 512x
  | "beautiful" // Image url: 256x
  | "fear" // Image url: 256x
  | "sacred" // Image url: 512x
  | "painting" // Image url: 512x
  | "color" // Name or hex
  | "delete" //  Image url: 256x
  | "garbage" // Image url: 512x
  | "tom" // Image url: 256x
  | "bed" // Image url: 128x | Image url: 128x
  | "crush" // Image url: 512x | Image url: 512x
  | "patrick" // Image url: 512x
  | "respect" // Image url: 128x
  | "dipshit" // Text: 33
  | "picture" // Image url: 256x
  | "tweet" // Text: 165
  | "truth" // Image url: 256x
  | "bobross" // Image url: 512x
  | "mask" // Image url: 512x
  | "father" // Image url: 256x | Text: 42
  | "achievement" // Image url: 64x | Text: 21
  | "dominantColor"; // Image url: any size

export type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 444
  | 451
  | 499
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511
  | 599;

export type HTTPMethod = "get" | "post" | "delete";

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
  eventDir: string;
  commandDir: string;
  database: DatabaseOptions;
  api: APIOptions;
}

export interface CommandRunOptions {
  command: Command;
  args: Array<string>;
  flags: Record<string, boolean>;
}

export interface Config {
  emoji: Record<string, Record<string, string>>;
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
    config: Config;
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
