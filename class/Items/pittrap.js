const GamePittrap = require('../Structures/pittrap')

class PitTrap {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let pittrap = new GamePittrap(id, player.idGame, position, this.info)
        player.game.addStructure(player, pittrap)
    }
}
module.exports = PitTrap