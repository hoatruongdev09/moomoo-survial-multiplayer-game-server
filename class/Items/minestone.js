const GameMineStone = require('../Structures/minestone')

class MineStone {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let mine = new GameMineStone(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, mine)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, mine)
        mine.id = id
        return true
    }
}
module.exports = MineStone