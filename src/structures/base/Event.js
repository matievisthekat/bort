module.exports = class Event {
  constructor (name = undefined, type = undefined) {
    this.name = name
    this.type = type
  }

  async run (client, ...args) {
    client.logger.warn('Event not implemented')
  }
}
