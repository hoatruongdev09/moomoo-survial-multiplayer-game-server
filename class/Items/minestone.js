const GameMineStone = require('../Structures/minestone')

class MineStone {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let mine = new GameMineStone(id, player.idGame, position, this.info)
        player.game.addStructure(player, mine)
    }
}
module.exports = MineStone