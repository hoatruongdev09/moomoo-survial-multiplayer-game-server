const SAT = require('sat')

class GamePlatform {
    constructor(id, userId, position, info, direct, game) {
        this.id = id
        this.userId = userId
        this.position = position
        this.direct = direct
        this.game = game

        this.hp = info.health
        this.size = info.size
        this.itemId = info.id

        this.standingPlayer = []
        this.update = {
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
        this.bodyCollider
        this.initCollider()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
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
        for (let i = 0; i < this.standingPlayer.length; i++) {
            // console.log("checking player: ", this.standingPlayer[i])
            if (this.game.testCollisionCircle2Cirle(this, this.standingPlayer[i], (res, objCol) => this.collidePlayerInfo(i))) {
                this.standingPlayer[i].platformStanding = true
            } else {
                this.standingPlayer[i].platformStanding = false
                this.standingPlayer.splice(i, 1)
                i--
            }
        }
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
    takeDamge(damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }
    get rotation() {
        return Math.atan2(this.direct.y, this.direct.x)
    }
}
module.exports = GamePlatform