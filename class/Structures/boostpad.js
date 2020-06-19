const SAT = require('sat')
const BaseStructure = require('./baseStructure')
class GameBoostPad extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.force = info.force
    }
    interact(player, callback) {
        player.position.add(this.direct.unitVector.scale(this.force));
        callback(true)
    }
}

class old_GameBoostPad {
    constructor(id, userId, position, info, direct) {
        this.id = id
        this.userId = userId
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.direct = direct
        this.force = info.force
        this.bodyCollider
        this.initCollider()
    }
    // effect(player) {
    //     this.pushPlayer(player)
    // }
    // pushPlayer(player) {
    //     let destinatePosition = this.position.clone().add(this.direct.scale(this.force))
    //     player.position.add(destinatePosition)
    // }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    interact(player, callback) {
        player.position.add(this.direct.unitVector.scale(this.force));
        callback(true)
    }
    destroy() {

    }
    toString() {
        return "BoostPad"
    }
    takeDamage(damage, callback) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
            callback()
        }
    }
    takeDamge(damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }
    hitInteract(player, callback) {

    }
    get rotation() {
        return Math.atan2(this.direct.y, this.direct.x)
    }
}
module.exports = GameBoostPad