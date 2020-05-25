module.exports = class Bank {
  constructor(options = {}) {
    this.schema = options.schema;
    this.guild = options.guild;
  }

  async load() {
    this.model =
      (await this.schema.findOne({ guildID: this.guild.id })) ||
      (await new this.schema({
        guildID: this.guild.id,
        amount: 0,
        maxWithdrawAmount: 100,
        allowedRoleID: "",
        blacklistedMemberIDs: [],
        whitelistedMemberIDs: []
      }).save());

    this.update();
  }

  async update() {
    this.amount = this.model.amount;
    this.maxWithdrawAmount = this.model.maxWithdrawAmount;
    this.allowedRoleID = this.model.allowedRoleID;
    this.blacklistedMemberIDs = this.model.blacklistedMemberIDs;
    this.whitelistedMemberIDs = this.model.whitelistedMemberIDs;
  }

  async transfer(options = {}) {
    if (!options.type) throw new Error("No type specified");

    switch (options.type.toLowerCase()) {
      case "deposit":
        const depUser = await this.guild.members.resolve(options.userID).user;
        if (!depUser) throw new Error("No user found");

        depUser.currency.model.wallet -= options.amount;
        this.model.amount += options.amount;

        await this.model.save();
        await depUser.currency.save();

        await this.update();
        return true;
        break;

      case "withdraw":
        const withUser = await this.guild.members.resolve(options.userID).user;
        if (!withUser) throw new Error("No user found");

        withUser.currency.model.wallet += options.amount;
        this.model.amount -= options.amount;

        await this.model.save();
        await withUser.currency.save();

        await this.update();
        return true;
        break;

      default:
        return false;
    }
  }

  async deposit(options = {}) {
    this.model.amount += options.amount;

    const user = await this.guild.members.resolve(options.userID).user;
    if (!user) throw new Error("Could not get user");

    user.currency.model.wallet -= options.amount;

    await this.model.save();
    await user.currency.model.save();

    await this.update();
    return this.model;
  }

  async withdraw(options) {
    this.model.amount -= options.amount;

    const user = await this.guild.members.resolve(options.userID).user;
    if (!user) throw new Error("Could not get user");

    user.currency.model.wallet += options.amount;

    await this.model.save();
    await user.currency.model.save();

    await this.update();
    return this.model;
  }

  async add(amount) {
    this.model.amount += amount;

    await this.model.save();

    await this.update();
    return this.model;
  }

  async remove(amount) {
    this.model.amount -= amount;

    await this.model.save();

    await this.update();
    return this.model;
  }
};
