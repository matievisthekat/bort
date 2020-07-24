import { EventEmitter } from "events";
import { Client, QueryResult, QueryConfig } from "pg";
import { IDatabaseOpts, IDatabaseTable } from "../types";
import { Logger } from "../";

export class Database extends EventEmitter {
  private client: Client;
  private logger: Logger = new Logger();
  private tables: Array<IDatabaseTable>;
  private startUpQuries: Array<string>;

  constructor (opts: IDatabaseOpts) {
    super();

    this.client = new Client({
      host: opts.host,
      database: opts.database,
      password: opts.password,
      user: opts.user,
      port: opts.port,
    });

    this.client.on("error", (err) => this.emit("error", err));
    this.client.on("notification", (message) => this.logger.warn(`DATABASE: ${message}`));
    this.client.on("notice", (notice) => this.logger.info(`DATABASE: ${notice.message}`));

    this.tables = opts.tables;
    this.startUpQuries = opts.startUpQuries;
  }

  /**
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<any> {
    const connection = await this.client.connect();

    if (this.tables) {
      for (const table of this.tables) {
        const query = `
            CREATE TABLE IF NOT EXISTS ${table.name} (
              ${table.cols.map(col => `${col.name} ${col.dataType}${col.length ? `(${col.length})` : ""} ${col.contraints.join(" ")}`).join(",\n")}
              ${table.contraints.join(" ")}
            );
          `;

        await this.query(query);
      }
    }

    if (this.startUpQuries) {
      for (const query of this.startUpQuries) {
        await this.query(query);
      }
    }

    this.emit("ready", connection);
  }

  public async query(query: string | QueryConfig, values?: Array<any>): Promise<QueryResult<any> | boolean> {
    const res = await this.client.query(query, values).catch(err => this.emit("error", err));
    return res;
  }
}
