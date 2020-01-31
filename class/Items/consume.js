const gamecode = require('../../transmitcode').GameCode
class Consume {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        if (player.healthPoint >= 100) {
            return false
        }
        player.healthPoint += this.info.restore
        if (player.healthPoint > 100) {
            player.healthPoint = 100
        }

        player.game.broadcast(gamecode.playerHit, {
            data: [{
                id: player.idGame,
                hp: player.healthPoint
            }]
        })
        return true
    }
}
module.exports = Consume