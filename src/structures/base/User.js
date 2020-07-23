const { Structures } = require('discord.js')
const CurrencyUser = require('../currency/User')
const { UserLang } = require('../../constants/models')

module.exports = Structures.extend(
  'User',
  (User) =>
    class UserExtension extends User {
      constructor (...args) {
        super(...args)

        this.currency = new CurrencyUser(this)

        this.lang = 'en'
      }

      async loadLang (lang = this.lang) {
        if (this.langModel && this.langModel.lang === lang) { return this.langModel }

        this.langModel =
          (await UserLang.findOne({
            userID: this.id
          })) ||
          new UserLang({
            userID: this.id
          })

        this.langModel.lang = lang
        this.lang = this.langModel.lang
        await this.langModel.save()

        return this.langModel
      }

      async updateLang (lang) {
        const model = await UserLang.findOne({
          userID: this.id
        })
        if (!this.langModel || !model) { this.langModel = await this.loadLang(lang) }

        this.langModel.lang = lang
        this.lang = this.langModel.lang
        await this.langModel.save()

        return this.langModel
      }
    }
)
