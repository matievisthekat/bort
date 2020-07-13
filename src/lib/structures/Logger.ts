import * as chalk from "chalk";

export class Logger {
  /**
   * log
   * @param {*} msg The message to log
   * @public
   */
  public log(msg: any): void {
    console.log(chalk.bold(msg));
  }

  /**
   * warn
   * @param {*} msg The message to log
   * @public
   */
  public warn(msg: any): void {
    console.log(chalk.yellow(msg));
  }

  /**
   * info
   * @param {*} msg The message to log
   * @public
   */
  public info(msg: any): void {
    console.log(chalk.green(msg));
  }

  /**
   * error
   * @param {*} msg The message to log
   * @public
   */
  public error(msg: any): void {
    console.log(chalk.red(msg));
  }
}
