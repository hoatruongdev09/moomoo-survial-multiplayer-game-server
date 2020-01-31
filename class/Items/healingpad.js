const GameHealingPad = require('../Structures/healingpad')

class HealingPad {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let healingPad = new GameHealingPad(null, player.idGame, position, this.info, player.game)
        if (!player.game.checkOverlapStructure(player.idGame, healingPad)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, healingPad)
        healingPad.id = id
        return true
    }
}

module.exports = HealingPad