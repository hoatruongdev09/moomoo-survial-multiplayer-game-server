const BaseStructure = require('./baseStructure')
class GameBoostPad extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.force = info.force
    }
    interact(player, callback) {
        player.position.add(this.direct.unitVector.scale(this.force));
        callback(true)
    }
}

module.exports = GameBoostPad