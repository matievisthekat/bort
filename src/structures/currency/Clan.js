const { clan } = require("../../constants/models");

module.exports = class Clan {
  constructor(name, leader) {
    this.name = name;
    this.leader = leader;
  }

  async load() {
    this.model = new clan({
      name: this.name,
      leaderID: this.leader.id,
      memberIDs: [],
      bank: 0,
      pets: [],
      health: 20,
      maxHealth: 20,
      wallLevel: 1
    });

    await this.update();

    await this.model.save();
    return this.model;
  }

  async unload() {
    if (!this.model) return true;

    await this.model.delete();

    return true;
  }

  async update() {
    if (!this.model) await this.load();

    this.bank = this.model.bank;
    this.members = this.model.memberIDs;
    this.name = this.model.name;
    this.iconURL = this.model.iconURL;
    this.wallLevel = this.model.wallLevel;
    this.pets = this.model.pets;
    this.health = this.model.health;
    this.maxHealth = this.model.maxHealth;

    return this;
  }
};
