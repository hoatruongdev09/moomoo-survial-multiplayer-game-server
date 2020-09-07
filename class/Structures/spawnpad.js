const BaseStructure = require('./baseStructure')
class SpawnPad extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
    }
    toString() {
        return "Spawnpad"
    }
}
module.exports = SpawnPad