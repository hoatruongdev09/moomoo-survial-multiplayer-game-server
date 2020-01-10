const SAT = require('sat')


class GameWindmill {
    constructor(id, user, position, info) {
        this.id = id
        this.userId = user.idGame
        this.user = user
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.gold = info.gold
        this.xp = info.xp

        this.update = setInterval(() => {
            this.user.addGold(this.gold)
            this.user.addXP(this.xp)
        }, 1000)

        this.bodyCollider
        this.initCollider()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {
        clearInterval(this.update)
    }
    toString() {
        return "Windmill"
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

module.exports = GameWindmill