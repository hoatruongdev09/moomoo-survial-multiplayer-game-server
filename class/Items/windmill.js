const GameWindmill = require('../Structures/windmill')
class Windmill {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let windmill = new GameWindmill(id, player.idGame, this.info.id, position, this.info.size, this.info.health)
        player.game.addStructure(player, windmill)
    }
}
module.exports = Windmill