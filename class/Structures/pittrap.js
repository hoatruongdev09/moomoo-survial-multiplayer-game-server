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
        this.trappedNpc = []
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
    checkNpcTrapped(id) {
        let result = false
        this.trappedNpc.forEach(n => {
            if (n != null && n.id == id) {
                result = true
            }
        })
        return result
    }
    trapPlayer(player) {
        if (this.checkPlayerTrapped(player.idGame)) {
            return
        }
        this.trappedPlayer.push(player)
        // console.log("trapped player: ", this.trappedPlayer)
        player.speedModifier = 0
    }
    trapNpc(npc) {
        if (this.checkNpcTrapped(npc.id)) {
            return
        }
        this.trappedNpc.push(npc)
        // console.log("trapped npc: ", this.trappedNpc)
        npc.isTrapped = true
    }
    unTrapPlayer(player) {
        player.speedModifier = 1
    }
    unTrapNpc(npc) {
        npc.isTrapped = false
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
        this.trappedNpc.forEach(n => {
            if (n != null) {
                n.isTrapped = false
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