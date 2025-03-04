const GameTeleporter = require('../Structures/teleporter')

class Teleporter {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let id = player.game.generateStructureId()
        let structure = new GameTeleporter(id, position, direct, player, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, structure)) {
            structure.destroy()
            return false
        }
        player.game.addStructure(player, structure)
        return true
    }
    old_use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let teleporter = new GameTeleporter(null, player.idGame, position, this.info, player.game)
        if (!player.game.checkOverlapStructure(player.idGame, teleporter)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, teleporter)
        teleporter.id = id
        return true
    }

}
module.exports = Teleporter