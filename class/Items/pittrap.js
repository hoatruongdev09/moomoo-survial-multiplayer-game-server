const GamePittrap = require('../Structures/pittrap')

class PitTrap {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let id = player.game.generateStructureId()
        let structure = new GamePittrap(id, position, direct, player, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, structure)) {
            structure.destroy()
            return false
        }
        player.game.addStructure(player, structure)
        return true
    }
    old_use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let pittrap = new GamePittrap(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, pittrap)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, pittrap)
        pittrap.id = id
        return true
    }
}
module.exports = PitTrap