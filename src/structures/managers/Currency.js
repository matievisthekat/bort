module.exports = class CurrencyManager {
  constructor(client) {
    this.client = client;

    this.client.web.app.get(`/api/${this.client.config.apiVersion}/currencyUser/:id`, async (req, res) => {
      const user = await this.getUser(req.params.id);
      if (user) {
        if (!user.currency.wallet) await user.currency.load();
        res.send(user.currency).status(200);
      } else
        res
          .send({ error: "No user with that ID was found", status: 404 })
          .status(404);
    });
  }

  async getUser(id) {
    let user;
    try {
      user = await this.client.users.fetch(id);
    } catch (err) {}

    return user;
  }

  async getBank(guildID) {
    const bank = await this.client.models.bank.findOne({
      guildID: guildID
    });
    return bank;
  }
};
