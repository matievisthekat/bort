module.exports = class ProgressBar {
  constructor (percentage) {
    this.percent = percentage / 4

    const prepend = '∎'.repeat(this.percent)
    const str = [...`${'‒'.repeat(100 / 4)}`].slice(this.percent)
    str.unshift(prepend)
    this.bar = `[${str.join('')}]`
  }
}
