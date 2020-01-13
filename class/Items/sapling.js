const GameSapling = require('../Structures/sapling')

class Sapling {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let mine = new GameSapling(id, player.idGame, position, this.info)
        player.game.addStructure(player, mine)
    }
}
module.exports = Sapling