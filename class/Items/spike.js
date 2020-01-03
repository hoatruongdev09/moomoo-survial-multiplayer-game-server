const GameSpike = require('../Structures/spike')

class Spike {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let spike = new GameSpike(id, player.idGame, position, this.info)
        player.game.addStructure(player, spike)
    }
}
module.exports = Spike