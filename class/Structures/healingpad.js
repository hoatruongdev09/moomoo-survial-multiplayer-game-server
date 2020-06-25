const SAT = require('sat')
const BaseStructure = require('./baseStructure')
const { response } = require('express')

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
            if (this.game.testCollisionCircle2Circle(this, player, (res, obj) => { })) {
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

class old_GameHealingPad {
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
        // let data = []
        if (this.healingPlayers.length == 0) {
            this.update.stop()
            return
        }
        this.healingPlayers.forEach((player, index, arr) => {
            if (this.game.testCollisionCircle2Circle(this, player, (response, objectCollide) => this.collidePlayerInfo(index))) {
                this.heal(player)
                if (player.currentHealthPoint >= 1) {
                    this.healingPlayers.splice(index, 1)
                }
            }
        })
        // for (let i = 0; i < this.healingPlayers.length; i++) {
        //     if (this.game.testCollisionCircle2Circle(this, this.healingPlayers[i], (response, objectCollide) => this.collidePlayerInfo(i))) {
        //         player = this.healingPlayers[i]
        //         if (player.healthPoint < 100) {
        //             this.heal(player)
        //             data.push({
        //                 id: player.idGame,
        //                 hp: player.healthPoint
        //             })
        //         }
        //     } else {
        //         this.healingPlayers.splice(i, 1)
        //         i--
        //     }
        // }
        // if (data.length != 0) {
        //     this.game.syncPlayerHP(data)
        // }
    }
    interact(player, callback) {
        this.healPlayer(player)
    }
    heal(player) {
        player.takeHP(this.healRate)
        // player.healthPoint += this.healRate
        // if (player.healthPoint >= 100) {
        //     player.healthPoint = 100
        // }
    }
    collidePlayerInfo(index) { }
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
    takeDamage(damage, callback) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
            callback()
        }
    }
    hitInteract(player, callback) {

    }
    get rotation() {
        return 0
    }
}
module.exports = GameHealingPad