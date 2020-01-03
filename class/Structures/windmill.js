const SAT = require('sat')


class GameWindmill {
    constructor(id, userId, itemId, position, size, hp) {
        this.id = id
        this.userId = userId
        this.position = position
        this.size = size
        this.hp = hp
        this.itemId = itemId

        this.bodyCollider
        this.initCollider()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    toString() {
        return "windmill"
    }
}

module.exports = GameWindmill