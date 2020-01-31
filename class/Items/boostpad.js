const GameBoostPad = require('../Structures/boostpad')

class BoostPad {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let boostPad = new GameBoostPad(null, player.idGame, position, this.info, direct)
        if (!player.game.checkOverlapStructure(player.idGame, boostPad)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, boostPad)
        boostPad.id = id
        return true
    }
}
module.exports = BoostPad