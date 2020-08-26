const BaseStructure = require('./baseStructure')

class GameWall extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
    }
    toString() {
        return "Wall"
    }
}

module.exports = GameWall