const SAT = require('sat')

class GamePitTrap {
    constructor(id, userId, position, info) {
        this.id = id
        this.userId = userId
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id

        this.bodyCollider
        this.initCollider()

        this.trappedPlayer = []
    }
    checkPlayerTrapped(id) {
        let result = false
        this.trappedPlayer.forEach(p => {
            if (p != null && p.idGame == id) {
                result = true
            }
        })
        return result
    }
    trapPlayer(player) {
        if (this.checkPlayerTrapped(player.idGame)) {
            return;
        }
        this.trappedPlayer.push(player)
        console.log("trapped player: ", this.trappedPlayer)
        player.speedModifier = 0
    }
    unTrapPlayer(player) {
        player.speedModifier = 1
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {
        this.trappedPlayer.forEach(p => {
            if (p != null) {
                p.speedModifier = 1
            }
        })
    }
    toString() {
        return "PitTrap"
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
module.exports = GamePitTrap