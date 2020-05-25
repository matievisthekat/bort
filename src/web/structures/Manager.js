const express = require("express"),
  Logger = require("../../structures/util/Logger"),
  cors = require("cors"),
  bodyParser = require("body-parser");

module.exports = class WebManager {
  constructor() {
    this.logger = new Logger();
    this.port = 3001;

    const app = express();
    this.app = app;
    app.use(cors());
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
  }

  init() {
    this.app.listen(this.port, () =>
      this.logger.log(`API listening on port ${this.port}`)
    );
  }
};
