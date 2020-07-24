import { EventEmitter } from "events";
import { Client } from "pg";
import { IDatabaseOpts } from "../types";

export class Database extends EventEmitter {
  private client: Client;

  constructor (opts: IDatabaseOpts) {
    super();

    this.client = new Client({
      host: opts.host,
      database: opts.database,
      password: opts.password,
      user: opts.user,
      port: opts.port,
    });
  }

  /**
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<any> {
    const connection = await this.client.connect();
    this.emit("ready", connection);
  }

  public async query(query: string): Promise<any> {

  }
}
