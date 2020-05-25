const { Structures } = require("discord.js"),
  CurrencyUser = require("../currency/User"),
  { money, userLang } = require("../../constants/models");

module.exports = Structures.extend(
  "User",
  (User) =>
    class UserExtension extends User {
      constructor(...args) {
        super(...args);
        this.currency = new CurrencyUser({
          userID: this.id,
          schema: money
        });

        this.langModel;
        this.lang = "en";
      }

      async loadLang(lang = this.lang) {
        if (this.langModel && this.langModel.lang === lang)
          return this.langModel;

        this.langModel =
          (await userLang.findOne({
            userID: this.id
          })) ||
          new userLang({
            userID: this.id
          });

        this.langModel.lang = lang;
        this.lang = this.langModel.lang;
        await this.langModel.save();

        return this.langModel;
      }

      async updateLang(lang) {
        const model = await userLang.findOne({
          userID: this.id
        });
        if (!this.langModel || !model)
          this.langModel = await this.loadLang(lang);

        this.langModel.lang = lang;
        this.lang = this.langModel.lang;
        await this.langModel.save();

        return this.langModel;
      }
    }
);
