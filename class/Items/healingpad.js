const GameHealingPad = require('../Structures/healingpad')

class HealingPad {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let healingPad = new GameHealingPad(id, player.idGame, position, this.info, player.game)
        player.game.addStructure(player, healingPad)
    }
}

module.exports = HealingPad