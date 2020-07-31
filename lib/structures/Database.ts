import { EventEmitter } from "events";
import { Client, QueryResult, QueryConfig } from "pg";
import { DatabaseOptions, DatabaseStartUpOptions } from "../types";
import { Logger } from "../";

export class Database extends EventEmitter {
  private client: Client;
  private logger: Logger = new Logger();

  constructor (opts: DatabaseOptions, private onStartUp: DatabaseStartUpOptions) {
    super();

    this.client = new Client({
      host: opts.host,
      database: opts.database,
      password: opts.password,
      user: opts.user,
      port: opts.port,
    });

    this.client.on("error", (err) => this.emit("error", err));
    this.client.on("notification", (message) => this.emit("notification", message));
    this.client.on("notice", (notice) => this.emit("notice", notice));
  }

  /**
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<any> {
    const connection = await this.client.connect();
    const tables = this.onStartUp?.tables;

    if (tables?.create) {
      for (const table of this.onStartUp.tables.create) {
        const query = `CREATE TABLE IF NOT EXISTS ${table.name} (
            ${table.cols.map(col => `${col.name} ${col.dataType}${col.length ? `(${col.length})` : ""} ${col.contraints.join(" ")}`).join(",\n")}
            ${table.contraints.join(" ")}
          );`;

        await this.query(query).catch(err => this.logger.error(err));
      }
    }

    if (tables?.drop) {
      for (const table of tables.drop) {
        this.query("DROP TABLE $1;", [table]).catch(err => this.logger.error(err));
      }
    }

    if (this.onStartUp?.quries) {
      for (const query of this.onStartUp.quries) {
        await this.query(query).catch(err => this.logger.error(err));
      }
    }

    this.emit("ready", connection);
  }

  public async query(query: string | QueryConfig, values?: Array<any>): Promise<QueryResult<any> | boolean> {
    return await this.client.query(query, values).catch(err => { throw err; });
  }
};
