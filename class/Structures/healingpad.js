const BaseStructure = require('./baseStructure')
const {
    response
} = require('express')

class GameHealingPad extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.healRate = info.rate
        this.game = owner.game

        this.healingPlayers = []
        this.update = this.healLogic()
    }
    toString() {
        return "HealingPad"
    }
    interact(player, callback) {
        this.healPlayer(player)
    }
    healLogic() {
        return {
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
    syncPlayerHealth() {
        let data = this.healingPlayers.map((p) => {
            return p.getHealthPointData()
        })
        this.game.syncPlayerHP(data)
    }
    checkColliderPlayer() {
        if (this.healingPlayers.length == 0) {
            this.update.stop()
            return
        }
        this.healingPlayers.forEach((player, index, obj) => {
            if (this.game.testCollisionCircle2Circle(this, player, (res, obj) => {})) {
                this.heal(player)
            } else {
                this.healingPlayers.splice(index, 1)
            }
        })
    }
    heal(player) {
        player.takeHP(this.healRate)
    }
    healPlayer(player) {
        if (this.checkHealPlayer(player)) {
            return
        }
        this.healingPlayers.push(player)
        if (!this.update.isRunning) {
            this.update.run(() => {
                this.checkColliderPlayer()
                this.syncPlayerHealth()
            })
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
    destroy() {
        this.update.stop()
    }

}

module.exports = GameHealingPad