const SAT = require('sat')
const ResourceType = require('../resource').ResourceType
const BaseStructure = require('./baseStructure')

class GameSapling extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.idType = ResourceType.Wood
    }
    toString() {
        return "Sapling"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {
        callback(this.idType)
    }
}

module.exports = GameSapling