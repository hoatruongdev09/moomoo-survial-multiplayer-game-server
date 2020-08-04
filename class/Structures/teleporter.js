const SAT = require('sat')
const BaseStructure = require('./baseStructure')

class GameTeleporter extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.game = owner.game
        this.teleQueue = []
    }
    toString() {
        return ("Teleporter")
    }
    interact(player, callback) {
        this.addWaitToTeleport(player)
    }
    addWaitToTeleport(player) {
        if (this.checkInQueue(player.idGame)) {
            return
        }
        this.teleQueue.push(player)
        setTimeout(() => {
            if (player != null) {
                if (this.game.testCollisionCircle2Circle(this, player, (res, obj) => { })) {
                    player.position = this.game.getRandomPosition()
                }
                // this.game.syncPlayerPosition(player)
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
    destroy() {
        this.teleQueue.length = 0
    }
}

module.exports = GameTeleporter