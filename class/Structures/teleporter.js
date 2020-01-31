const SAT = require('sat')

class GameTeleporter {
    constructor(id, userId, position, info, game) {
        this.id = id
        this.userId = userId
        this.position = position
        this.hp = info.hp
        this.size = info.size
        this.itemId = info.id
        this.game = game
        this.bodyCollider

        this.initCollider()
        this.teleQueue = []

    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    addWaitToTeleporter(player) {
        if (this.checkInQueue(player.idGame)) {
            return
        }
        this.teleQueue.push(player)
        setTimeout(() => {
            if (player != null) {
                if (this.game.testCollisionCircle2Cirle(this, player, (res, obj) => {})) {
                    player.position = this.game.getRandomPosition()
                }
                this.game.syncPlayerPosition(player)
                this.removePlayerQueue(player)
            }
        }, 3000)
    }
    checkInQueue(id) {
        let result = false
        this.teleQueue.forEach(p => {
            if (p != null && p.idGame == id) {
                result = true
            }
        })
        return result
    }
    removePlayerQueue(player) {
        for (let i = 0; i < this.teleQueue.length; i++) {
            if (this.teleQueue[i].idGame == player.idGame) {
                this.teleQueue.splice(i, 1)
                return
            }
        }
    }
    toString() {
        return ("Teleporter")
    }
    destroy() {
        for (let i = 0; i < this.teleQueue.length; i++) {
            this.teleQueue.splice(i, 1)
        }
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
module.exports = GameTeleporter