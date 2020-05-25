const Util = require("./util");
const mongoose = require("mongoose");
const model = mongoose.model(
  "logs",
  new mongoose.Schema({
    timestamp: Date,
    msg: String,
    extra: String,
  })
);

module.exports = class Logger {
  constructor(options = {}) {
    this.util = Util;
    this.model = model;
  }

  databaseLog(msg, extra) {
    new this.model({
      timestamp: Date.now(),
      msg: msg,
      extra: extra,
    })
      .save()
      .catch((err) => this.error(err));
  }

  error(msg, databaseLog) {
    console.log(
      this.util.chalk.red(
        `[ERROR: ${this.util.moment().format("HH:mm")}] ${
          msg.stack ? msg.stack : msg
        }`
      )
    );
    if (databaseLog)
      this.databaseLog(msg.stack ? `${msg.error} ${msg.stack}` : msg);
  }

  warn(msg, databaseLog) {
    console.log(
      this.util.chalk.yellow(
        `[WARN:  ${this.util.moment().format("HH:mm")}] ${msg}`
      )
    );
    if (databaseLog) this.databaseLog(msg);
  }

  info(msg) {
    console.log(
      this.util.chalk.green(
        `[INFO:  ${this.util.moment().format("HH:mm")}] ${msg}`
      )
    );
  }

  log(msg) {
    console.log(
      this.util.chalk.bold(
        `[LOG:   ${this.util.moment().format("HH:mm")}] ${msg}`
      )
    );
  }
};
