const { bank } = require("../../constants/models");

module.exports = class Bank {
  constructor(guild) {
    this.guild = guild;
  }

  async load() {
    this.model =
      (await bank.findOne({ guildID: this.guild.id })) ||
      (await new bank({
        guildID: this.guild.id,
        amount: 0,
        maxWithdrawAmount: 100,
        allowedRoleID: "",
        blacklistedMemberIDs: [],
        whitelistedMemberIDs: []
      }).save());

    await this.update();
  }

  async update() {
    if (!this.model) await this.load();

    this.amount = this.model.amount;
    this.maxWithdrawAmount = this.model.maxWithdrawAmount;
    this.allowedRoleID = this.model.allowedRoleID;
    this.blacklistedMemberIDs = this.model.blacklistedMemberIDs;
    this.whitelistedMemberIDs = this.model.whitelistedMemberIDs;

    return this.model;
  }

  async deposit(options = {}) {
    if (!this.model) await this.load();

    this.model.amount += options.amount;

    const user = await this.guild.members.resolve(options.userID)?.user;
    if (!user) throw new Error("Could not get user");

    user.currency.model.wallet -= options.amount;

    await this.model.save();
    await user.currency.model.save();

    await this.update();
    return this.model;
  }

  async withdraw(options) {
    if (!this.model) await this.load();

    this.model.amount -= options.amount;

    const user = await this.guild.members.resolve(options.userID)?.user;
    if (!user) throw new Error("Could not get user");

    user.currency.model.wallet += options.amount;

    await this.model.save();
    await user.currency.model.save();

    await this.update();
    return this.model;
  }

  async add(amount) {
    if (!this.model) await this.load();

    this.model.amount += amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async remove(amount) {
    if (!this.model) await this.load();

    this.model.amount -= amount;

    await this.model.save();
    await this.update();
    return this.model;
  }

  async setMaxWithdrawAmount(amount) {
    if (!this.model) await this.load();

    this.model.maxWithdrawAmount = amount;

    await this.model.save();
    await this.update();
    return this.model;
  }

  async whitelist(id) {
    if (!this.model) await this.load();

    this.model.whitelistedMemberIDs.push(id);

    await this.model.save();
    await this.update();
    return this.model;
  }

  async unWhitelist(id) {
    if (!this.model) await this.load();

    this.model.whitelistedMemberIDs.splice(
      this.model.whitelistedMemberIDs.indexOf(id),
      1
    );

    await this.model.save();
    await this.update();
    return this.model;
  }

  async blacklist(id) {
    if (!this.model) await this.load();

    this.model.blacklistedMemberIDs.push(id);

    await this.model.save();
    await this.update();
    return this.model;
  }

  async unBlacklist(id) {
    if (!this.model) await this.load();

    this.model.blacklistedMemberIDs.splice(
      this.model.blacklistedMemberIDs.indexOf(id),
      1
    );

    await this.model.save();
    await this.update();
    return this.model;
  }
};
