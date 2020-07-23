const moment = require('moment')
const chalk = require('chalk')

module.exports = class Logger {
  constructor () {
    this.tabLength = 4
  }

  get time () {
    return moment().format('HH:mm:ss a')
  }

  get date () {
    return moment().format('DD/MM/YYYY')
  }

  get timestamp () {
    return `${this.date} ${this.time}`
  }

  /**
   * @private
   * @param {String} type The logging type
   */
  _genPrefix (type) {
    const tabs = ' '.repeat(this.tabLength - (type.length - this.tabLength))
    return `[${type.toUpperCase()}:${tabs}${this.timestamp}]`
  }

  /**
   * @param {String} msg Log an error
   */
  error (msg) {
    console.log(chalk.red(`${this._genPrefix('error')} ${msg}`))
  }

  /**
   * @param {String} msg Log a warning
   */
  warn (msg) {
    console.log(chalk.yellow(`${this._genPrefix('warn')} ${msg}`))
  }

  /**
   * @param {String} msg Log information
   */
  info (msg) {
    console.log(chalk.green(`${this._genPrefix('info')} ${msg}`))
  }

  /**
   * @param {String} msg Log a message
   */
  log (msg) {
    console.log(chalk.bold(`${this._genPrefix('log')} ${msg}`))
  }
}
