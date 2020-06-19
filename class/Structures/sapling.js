const SAT = require('sat')
const ResourceType = require('../resource').ResourceType
const BaseStructure = require('./baseStructure')

class GameSapling extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.idType = ResourceType.Wood
    }
    toString() {
        return "Sapling"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {
        callback(this.idType)
    }
}

class old_GameSapling {
    constructor(id, userId, position, info) {
        this.id = id
        this.position = position
        this.size = info.size
        this.itemId = info.id
        this.userId = userId
        this.idType = ResourceType.Wood
        this.bodyCollider
        this.initCollider()

    }
    destroy() {

    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    toString() {
        return "Sapling"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {
        callback(this.idType)
    }
    get rotation() {
        return 0
    }
}
module.exports = GameSapling