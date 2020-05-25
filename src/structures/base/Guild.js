const { Structures } = require("discord.js"),
  Bank = require("../currency/Bank"),
  { bank } = require("../../constants/models");

module.exports = Structures.extend("Guild", (Guild) =>
    class GuildExtension extends Guild {
      constructor(...args) {
        super(...args);

        this.bank = new Bank({
          guild: this,
          schema: bank,
        });
      }
    }
);
