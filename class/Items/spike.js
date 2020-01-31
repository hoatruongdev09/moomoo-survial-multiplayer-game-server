const GameSpike = require('../Structures/spike')

class Spike {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let spike = new GameSpike(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, spike)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, spike)
        spike.id = id
        return true
    }
}
module.exports = Spike