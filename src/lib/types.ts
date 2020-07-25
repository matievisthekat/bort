import { CommandManager, EventManager, Command } from "./";
import { PermissionString } from "discord.js";
import { Embed } from "./structures/Embed";

export interface IArg {
  name: string;
  desc: string;
  required?: boolean;
}

export interface IDatabaseOpts {
  host: string;
  database: string;
  password: string;
  user: string;
  port: number;
  onStartUp: IDatabaseStartUp;
}

export interface IDatabaseStartUp {
  tables?: {
    create?: Array<IDatabaseTable>;
    drop?: Array<string>;
  };
  quries?: Array<string>;
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
export type DataType = "bool" | "boolean" | "CHAR" | "VARCHAR" | "TEXT" | "SMALLINT" | "INT" | "SERIAL" | "float" | "real" | "float8" | "numeric" | "DATE" | "TIME" | "TIMESTAMP" | "TIMESTAMPZ" | "INTERVAL" | "JSON" | "JSONB" | "UUID" | "box" | "line" | "point" | "lseg" | "polygon" | "inet" | "macaddr";

export interface IDatabaseTable {
  name: string;
  contraints: Array<DatabaseContraint>;
  cols: Array<{
    name: string;
    dataType: DataType;
    length?: number;
    contraints: Array<DatabaseContraint>;
  }>;
}

export interface ICommandOpts {
  name: string;
  aliases?: Array<string>;
  category: string;
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

export interface IBotOpts {
  token: string;
  prefix: string;
  devs: Array<string>;
  event_dir: string;
  command_dir: string;
  config: IConfig;
  mongo_uri: string;
  database: IDatabaseOpts;
}

export interface ICommandOptsRun {
  command: Command;
  args: Array<string>;
  flags: any;
}

export interface IConfig {
  emoji: object;
  colours: {
    default: string;
    green: string;
    red: string;
    yellow: string;
  };
  onDatabaseStartUp?: object;
}

export interface ICommandOptsDone {
  done: boolean;
}

export interface IExecuteResult {
  stdin: string,
  stdout: string,
  stderr: string,
  error: Error | string;
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
    embed(): Embed;
  }
}
