const SAT = require("../../GameUtils/modifiedSAT").sat;
class BaseStructure {
  constructor(id, position, direct, owner, info) {
    this.id = id;
    this.owner = owner;
    this.position = position;
    this.direct = direct;

    this.hp = info.health;
    this.size = info.size;
    this.itemId = info.id;

    this.bodyCollider;
    this.initCollider();
  }
  initCollider() {
    this.bodyCollider = new SAT.Circle(
      new SAT.Vector(this.position.x, this.position.y),
      this.size
    );
  }
  interact(user, callback) {}
  hitInteract(player, callback) {}
  takeDamage(damage, callback) {
    this.hp -= damage;
    console.log("hp: ", this.hp);
    if (this.hp <= 0) {
      this.destroy();
      callback();
    }
  }
  destroy() {}
  toString() {
    return "base-structure";
  }

  get userId() {
    return this.owner.idGame;
  }
  get rotation() {
    return Math.atan2(this.direct.y, this.direct.x);
  }
}
module.exports = BaseStructure;