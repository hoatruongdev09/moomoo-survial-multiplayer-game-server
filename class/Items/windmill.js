const GameWindmill = require('../Structures/windmill')
class Windmill {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let id = player.game.generateStructureId()
        let structure = new GameWindmill(id, position, direct, player, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, structure)) {
            structure.destroy()
            return false
        }
        player.game.addStructure(player, structure)
        return true
    }
    old_use(player, direct) {
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