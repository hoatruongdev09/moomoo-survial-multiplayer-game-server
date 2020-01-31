const SAT = require('sat')

class GameBlocker {
    constructor(id, userId, position, info) {
        this.id = id
        this.userId = userId
        this.position = position

        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.range = info.range

        this.bodyCollider
        this.initCollider()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {

    }
    toString() {
        return "Blocker"
    }
    takeDamge(damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }
    get rotation() {
        return 0
    }
}
module.exports = GameBlocker