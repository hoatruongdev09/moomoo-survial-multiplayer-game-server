const SAT = require('sat')
const ResourceType = require('../resource').ResourceType
const BaseStructure = require('./baseStructure')
class GameMineStone extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.idType = ResourceType.Stone
    }
    toString() {
        return "MineStone"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {
        callback(this.idType)
    }
}
class old_GameMineStone {
    constructor(id, userId, position, info) {
        this.id = id
        this.position = position
        this.size = info.size
        this.itemId = info.id
        this.userId = userId
        this.idType = ResourceType.Stone
        this.bodyCollider
        this.initCollider()

    }
    destroy() {

    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    toString() {
        return "MineStone"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {

    }
    get rotation() {
        return 0
    }
}
module.exports = GameMineStone