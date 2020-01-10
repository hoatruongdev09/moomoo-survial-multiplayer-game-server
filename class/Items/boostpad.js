const GameBoostPad = require('../Structures/boostpad')

class BoostPad {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let spike = new GameBoostPad(id, player.idGame, position, this.info, direct)
        player.game.addStructure(player, spike)
    }
}
module.exports = BoostPad