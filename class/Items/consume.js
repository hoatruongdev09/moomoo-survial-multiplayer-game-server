const gamecode = require('../../transmitcode').GameCode
class Consume {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        if (player.currentHealthPoint >= 1) {
            return false
        }
        player.takeHP(this.info.restore)
        return true
    }
}
module.exports = Consume