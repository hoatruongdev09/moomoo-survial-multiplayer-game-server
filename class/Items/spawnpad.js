const GameSpawnpad = require('../Structures/spawnpad')

class Spawnpad {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let spawnpad = new GameSpawnpad(null, player, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, spawnpad)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, spawnpad)
        spawnpad.id = id
        player.spawnPad = spawnpad
        return true
    }
}
module.exports = Spawnpad