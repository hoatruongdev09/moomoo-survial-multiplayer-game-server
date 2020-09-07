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
        if (player.idGame == this.userId) {
            return
        }
        if (player.clanId != null && player.clanId == this.owner.clanId) {
            return
        }

        this.trapPlayer(player)
        callback(true)

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
module.exports = GamePitTrap