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
    old_use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(2))
        let turret = new GameTurret(null, player, position, this.info, player.game)
        if (!player.game.checkOverlapStructure(player.idGame, turret)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, turret)
        turret.id = id
        return true
    }
}

module.exports = Turret