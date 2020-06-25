const GameTurret = require('../Structures/turret')
class Turret {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(2))
        let id = player.game.generateStructureId()
        let structure = new GameTurret(id, position, direct, player, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, structure)) {
            structure.destroy()
            return false
        }
        player.game.addStructure(player, structure)
        return true
    }
}

module.exports = Turret