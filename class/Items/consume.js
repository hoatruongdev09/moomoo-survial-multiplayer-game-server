const gamecode = require('../../transmitcode').GameCode
class Consume {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        player.healthPoint += this.info.restore
        if (player.healthPoint > 100) {
            player.healthPoint = 100
        }
        player.game.broadcast(gamecode.playerHit, {
            id: player.idGame,
            hp: player.healthPoint
        })
    }
}
module.exports = Consume