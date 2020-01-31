const GameWindmill = require('../Structures/windmill')
class Windmill {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let windmill = new GameWindmill(null, player, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, windmill)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, windmill)
        windmill.id = id
        return true
    }
}
module.exports = Windmill