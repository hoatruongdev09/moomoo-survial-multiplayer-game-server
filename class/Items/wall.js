const GameWall = require('../Structures/wall')

class Wall {
    constructor(info) {

        this.info = info
    }
    use(player, direct) {
        let id = player.game.generateStructeId()
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let wall = new GameWall(id, player.idGame, position, this.info)
        player.game.addStructure(player, wall)
    }
}
module.exports = Wall