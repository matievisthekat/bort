import * as chalk from "chalk";
import * as moment from "moment";

export class Logger {
  /**
   * date
   * @returns A string
   * @private
   */
  private get date(): string {
    return moment().format("DD/MM/YYYY hh:mm:ss a");
  }

  /**
   * log
   * @param {*} msg The message to log
   * @public
   */
  public log(msg: any): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.bold("LOG  ")} ${msg}`);
  }

  /**
   * warn
   * @param {*} msg The message to log
   * @public
   */
  public warn(msg: any): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.yellow("WARN ")} ${msg}`);
  }

  /**
   * info
   * @param {*} msg The message to log
   * @public
   */
  public info(msg: any): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.green("INFO ")} ${msg}`);
  }

  /**
   * error
   * @param {*} msg The message to log
   * @public
   */
  public error(msg: any): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.red("ERROR")} ${msg}`);
  }
}
