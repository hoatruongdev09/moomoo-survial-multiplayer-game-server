const GamePlatform = require('../Structures/platform')

class Platform {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let id = player.game.generateStructureId()
        let structure = new GamePlatform(id, position, direct, player, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, structure)) {
            structure.destroy()
            return false
        }
        player.game.addStructure(player, structure)
        return true
    }
    old_use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let platform = new GamePlatform(null, player.idGame, position, this.info, direct, player.game)
        if (!player.game.checkOverlapStructure(player.idGame, platform)) {
            structure.destroy()
            return false
        }
        let id = player.game.generateStructureId()
        player.game.addStructure(player, platform)
        platform.id = id
        return true
    }
}

module.exports = Platform