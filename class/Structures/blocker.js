const SAT = require('sat')
const BaseStructure = require('./baseStructure')
class GameBlocker extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.range = info.range
    }
    toString() {
        return "Blocker"
    }
}
module.exports = GameBlocker