module.exports = class CurrencyManager {
  constructor(client) {
    // Set properties
    this.client = client;
  }

  /**
   * Fetch a user
   * @param {String} [id] The ID of the user to fetch
   */
  async getUser(id) {
    let user;
    try {
      user = await this.client.users.fetch(id);
    } catch (err) {}

    return user;
  }

  /**
   * Fetch a bank
   * @param {String} [guildID] The ID of the guild to fetch the bank for
   */
  async getBank(guildID) {
    const bank = await this.client.models.bank.findOne({
      guildID: guildID
    });
    return bank;
  }
};
