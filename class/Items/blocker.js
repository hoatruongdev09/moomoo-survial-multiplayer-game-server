const GameBlocker = require('../Structures/blocker')

class Blocker {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {

        let position = player.position.clone().add(direct.clone().scale(2))
        let blocker = new GameBlocker(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, blocker)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, blocker)
        blocker.id = id
        return true
    }
}
module.exports = Blocker