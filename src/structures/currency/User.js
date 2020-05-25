const { randomInRange } = require("../util/util");

module.exports = class User {
  constructor(options = {}) {
    this.userID = options.userID;
    this.schema = options.schema;
  }

  async load() {
    const previousModel = await this.schema.findOne({
      userID: this.userID,
    });

    this.model =
      previousModel ||
      new this.schema({
        userID: this.userID,
        wallet: 0,
        bank: 0,
        bankLimit: 200,
        economyXp: 0,
        economyLevel: 0,
      });

    await this.model.save();

    await this.update();
  }

  async update() {
    if (!this.model) await this.load();

    this.wallet = this.model.wallet;
    this.bank = this.model.bank;
    this.xp = this.model.economyXp;
    this.level = this.model.economyLevel;
    this.bankLimit = this.model.bankLimit;

    return this;
  }

  async withdraw(amount) {
    if (!this.model) await this.load();

    this.model.wallet += amount;
    this.model.bank -= amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async deposit(amount) {
    if (!this.model) await this.load();

    this.model.wallet -= amount;
    this.model.bank += amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async addXp(amount) {
    if (!this.model) await this.load();

    this.model.economyXp += amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async levelUp() {
    if (!this.model) await this.load();

    this.model.economyLevel++;
    this.model.bankLimit += randomInRange(
      this.level * 10000,
      this.level * 100000
    );

    await this.model.save();

    await this.update();
    return this.model;
  }

  async add(amount) {
    if (!this.model) await this.load();

    this.model.wallet += amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async remove(amount) {
    if (!this.model) await this.load();

    this.model.wallet -= amount;

    await this.model.save();

    await this.update();
    return this.model;
  }
};
