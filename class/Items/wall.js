const GameWall = require('../Structures/wall')

class Wall {
    constructor(info) {

        this.info = info
    }
    use(player, direct) {
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        let wall = new GameWall(null, player.idGame, position, this.info)
        if (!player.game.checkOverlapStructure(player.idGame, wall)) {
            return false
        }
        let id = player.game.generateStructeId()
        player.game.addStructure(player, wall)
        wall.id = id
        return true
    }
}
module.exports = Wall