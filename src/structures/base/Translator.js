const axios = require("axios");
const { Collection } = require("discord.js");

module.exports = class Translator {
  constructor(client, key) {
    // Set properties
    this.key = key;
    this.client = client;
    this.cache = new Collection();

    // Initialize the langs array and the default langauge
    this.langs = [];
    this.defaultLang = "en";
  }

  /**
   * Load available languages
   */
  async load() {
    const res = await axios.get(
      "https://translate.yandex.net/api/v1.5/tr.json/getLangs",
      {
        params: {
          key: this.key,
          ui: this.defaultLang
        }
      }
    );

    Object.entries(res.data.langs).map((langPair) =>
      this.langs.push({ code: langPair[0], name: langPair[1] })
    );

    return {
      message: `Loaded ${this.langs.length} languages`,
      status: 200
    };
  }

  /**
   * Translate some text
   * @param {String} [text] The text to translate
   * @param {String} [to] The langauge to translate to
   */
  async translate(text, to) {
    const cachedTranslation = this.cache.get(`${to}_${text}`);
    if (cachedTranslation) return cachedTranslation;

    const res = await axios.get(
      "https://translate.yandex.net/api/v1.5/tr.json/translate",
      {
        params: {
          key: this.key,
          text,
          lang: to
        }
      }
    );

    this.cache.set(`${to}_${text}`, res.data);
    return res.data;
  }

  /**
   * Dectect what langauge was input
   * @param {String} [text] The text to detect from
   */
  async detectLang(text) {
    const cachedTranslation = this.cache.get(text);
    if (cachedTranslation) return cachedTranslation.lang;

    const res = await axios.get(
      "https://translate.yandex.net/api/v1.5/tr.json/detect",
      {
        params: {
          key: this.key,
          text
        }
      }
    );

    this.cache.set(text, res.data);
    return res.data.lang;
  }
};
