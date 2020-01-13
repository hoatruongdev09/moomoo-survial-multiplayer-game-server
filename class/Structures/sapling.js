const SAT = require('sat')
const ResourceType = require('../resource').ResourceType
class GameSapling {
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
    takeDamge(damage) {

    }
    get rotation() {
        return 0
    }
}
module.exports = GameSapling