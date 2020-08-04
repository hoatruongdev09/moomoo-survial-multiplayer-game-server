const SAT = require('sat')
const BaseStructure = require('./baseStructure')

class GameSpike extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.damage = info.damage
    }
    toString() {
        return "Spike"
    }
    interact(player, callback) {
        if (player.idGame != this.userId) {
            callback(true)
        }
    }
}


module.exports = GameSpike