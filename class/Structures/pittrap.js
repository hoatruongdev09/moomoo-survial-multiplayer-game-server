const SAT = require('sat')
const BaseStructure = require('./baseStructure')
class GamePitTrap extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)

        this.trappedPlayer = []
        this.trappedNpc = []
    }
    toString() {
        return "PitTrap"
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
    interact(player, callback) {
        if (player.idGame != this.userId) {
            this.trapPlayer(player)
            callback(true)
        }
    }
    trapPlayer(player) {
        if (this.checkPlayerTrapped(player.idGame)) {
            return
        }
        this.trappedPlayer.push(player)
        player.isTrapped = true
    }
    trapNpc(npc) {
        if (this.checkNpcTrapped(npc.id)) {
            return
        }
        this.trappedNpc.push(npc)
        npc.isTrapped = true
    }
    unTrapPlayer(player) {
        player.isTrapped = false
    }
    unTrapNpc(npc) {
        npc.isTrapped = false
    }
    destroy() {
        this.trappedPlayer.forEach(p => {
            if (p != null) {
                p.isTrapped = false
            }
        })
        this.trappedNpc.forEach(n => {
            if (n != null) {
                n.isTrapped = false
            }
        })
    }
}
class old_GamePitTrap {
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
    interact(player, callback) {
        if (player.idGame != this.userId) {
            this.trapPlayer(player)
            callback(true)
        }
    }
    trapPlayer(player) {
        if (this.checkPlayerTrapped(player.idGame)) {
            return
        }
        this.trappedPlayer.push(player)
        // console.log("trapped player: ", this.trappedPlayer)
        player.isTrapped = true
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
        player.isTrapped = false
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
                p.isTrapped = false
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
    takeDamage(damage, callback) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
            callback()
        }
    }
    hitInteract(player, callback) {

    }
    get rotation() {
        return 0
    }
}
module.exports = GamePitTrap