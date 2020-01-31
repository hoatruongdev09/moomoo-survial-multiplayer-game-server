const GamePlatform = require('../Structures/platform')

class Platform {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let platform = new GamePlatform(null, player.idGame, position, this.info, direct, player.game)
        if (!player.game.checkOverlapStructure(player.idGame, platform)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, platform)
        platform.id = id
        return true
    }
}

module.exports = Platform