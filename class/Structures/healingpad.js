const SAT = require('sat')

class GameHealingPad {
    constructor(id, userId, position, info, game) {
        this.id = id
        this.userId = userId
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.healRate = info.rate
        this.bodyCollider
        this.game = game

        this.healingPlayers = []
        this.init()
        this.update = {
            isRunning: false,
            id: null,
            run(callback) {
                if (this.id == null || this.isRunning == false) {
                    this.id = setInterval(callback, 1000)
                    this.isRunning = true
                }
            },
            stop() {
                this.isRunning = false
                clearInterval(this.id)
            }
        }
    }
    init() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)

    }
    destroy() {
        this.update.stop()
    }
    checkColliderPlayer() {
        let data = []
        let player
        if (this.healingPlayers.length == 0) {
            this.update.stop()
            return
        }
        for (let i = 0; i < this.healingPlayers.length; i++) {
            if (this.game.testCollisionCircle2Cirle(this, this.healingPlayers[i], (response, objectCollide) => this.collidePlayerInfo(i))) {
                player = this.healingPlayers[i]
                if (player.healthPoint < 100) {
                    this.heal(player)
                    data.push({
                        id: player.idGame,
                        hp: player.healthPoint
                    })
                }
            } else {
                this.healingPlayers.splice(i, 1)
                i--
            }
        }
        if (data.length != 0) {
            this.game.syncPlayerHealthpoint(data)
        }
    }
    heal(player) {
        player.healthPoint += this.healRate
        if (player.healthPoint >= 100) {
            player.healthPoint = 100
        }
    }
    collidePlayerInfo(index) {}
    healPlayer(player) {
        if (this.checkHealPlayer(player)) {
            return
        }
        this.healingPlayers.push(player)
        if (!this.update.isRunning) {
            this.update.run(() => this.checkColliderPlayer())
        }
    }
    checkHealPlayer(player) {
        for (let i = 0; i < this.healingPlayers.length; i++) {
            if (player.idGame == this.healingPlayers[i].idGame) {
                return true
            }
        }
        return false
    }
    toString() {
        return "HealingPad"
    }
    takeDamge(damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }
    get rotation() {
        return 0
    }
}
module.exports = GameHealingPad