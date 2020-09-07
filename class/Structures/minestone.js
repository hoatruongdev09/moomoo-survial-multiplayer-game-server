const ResourceType = require('../resource').ResourceType
const BaseStructure = require('./baseStructure')
class GameMineStone extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.idType = ResourceType.Stone
    }
    toString() {
        return "MineStone"
    }
    takeDamage(damage) {

    }
    hitInteract(player, callback) {
        callback(this.idType)
    }
}
module.exports = GameMineStone