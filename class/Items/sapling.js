const GameSapling = require('../Structures/sapling')

class Sapling {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let sapling = new GameSapling(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, sapling)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, sapling)
        sapling.id = id
        return true
    }
}
module.exports = Sapling