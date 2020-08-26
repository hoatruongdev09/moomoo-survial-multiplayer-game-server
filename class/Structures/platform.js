const BaseStructure = require('./baseStructure')

class GamePlatform extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.game = owner.game

        this.standingPlayer = []
        this.update = this.standLogic()
    }
    toString() {
        return ("Platform")
    }
    standLogic() {
        return {
            isRunning: false,
            id: null,
            run(callback) {
                if (this.id == null || this.isRunning == false) {
                    this.id = setInterval(callback, 500)
                    this.isRunning = true
                }
            },
            stop() {
                this.isRunning = false
                clearInterval(this.id)
            }
        }
    }
    interact(player, callback) {
        this.addStandingPlayer(player)
    }
    addStandingPlayer(player) {
        // console.log("add standing player: ", player)
        if (this.checkStandingPlayer(player)) {
            return
        }
        player.addStandingPlayer = true
        this.standingPlayer.push(player)
        if (!this.update.isRunning) {
            this.update.run(() => this.checkColliderPlayer())
        }
    }
    checkColliderPlayer() {
        if (this.standingPlayer.length == 0) {
            this.update.stop()
            return
        }
        this.standingPlayer.forEach((player, index, obj) => {
            if (this.game.testCollisionCircle2Circle(this, player, (res, objCol) => {})) {
                player.platformStanding = true
            } else {
                player.platformStanding = false
                this.standingPlayer.splice(index, 1)
            }
        })
    }
    collidePlayerInfo(index) {

    }
    destroy() {
        this.update.stop()
        this.standingPlayer.forEach(p => {
            if (p != null) {
                p.platformStanding = false
            }
        })
    }
    toString() {
        return ("Platform")
    }
    checkStandingPlayer(player) {
        for (let i = 0; i < this.standingPlayer.length; i++) {
            if (player.idGame == this.standingPlayer[i].idGame) {
                return true
            }
        }
        return false
    }
}
module.exports = GamePlatform