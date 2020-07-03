const { randomInRange } = require("../util/util");
const { money } = require("../../constants/models");

module.exports = class User {
  constructor(user) {
    this.user = user;
    this.userID = user.id;
    this.schema = money;
  }

  async load() {
    const previousModel = await this.schema.findOne({
      userID: this.userID
    });

    this.model =
      previousModel ||
      new this.schema({
        userID: this.userID,
        wallet: 0,
        bank: 0,
        bankLimit: 200,
        economyXp: 0,
        economyLevel: 0
      });

    await this.model.save();

    await this.update();
  }

  async update() {
    if (!this.model) await this.load();

    this.wallet = Math.floor(this.model.wallet);
    this.bank = Math.floor(this.model.bank);
    this.xp = Math.floor(this.model.economyXp);
    this.level = Math.floor(this.model.economyLevel);
    this.bankLimit = Math.floor(this.model.bankLimit);

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

    const min = this.level === 0 ? 10 : this.level * 10;
    const max = this.level === 0 ? 55 : this.level * 30;

    this.model.bankLimit += randomInRange(min, max);
    this.model.economyLevel++;
    this.model.economyXp = 0;

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
