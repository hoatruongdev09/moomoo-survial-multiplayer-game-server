const SAT = require('sat')
const BaseStructure = require('./baseStructure')

class GameSpike extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.damage = info.damage
    }
    toString() {
        return "Spike"
    }
    interact(player, callback) {
        if (player.idGame != this.userId) {
            callback(true)
        }
    }
}

class old_GameSpike {
    constructor(id, userId, position, info) {
        this.id = id
        this.userId = userId
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.damage = info.damage


        this.bodyCollider
        this.initCollider()
    }
    // constructor(id, userId, itemId, position, size, hp) {
    //     this.id = id
    //     this.userId = userId
    //     this.position = position
    //     this.size = size
    //     this.hp = hp
    //     this.itemId = itemId

    //     this.bodyCollider
    //     this.initCollider()
    // }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {

    }
    toString() {
        return "Spike"
    }
    interact(player, callback) {
        if (player.idGame != this.userId) {
            callback(true)
        }
    }
    takeDamage(damage, callback) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
            callback()
        }
    }
    hitInteract(player, callback) {

    }
    get rotation() {
        return 0
    }
}

module.exports = GameSpike