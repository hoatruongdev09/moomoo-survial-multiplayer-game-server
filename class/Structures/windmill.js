const SAT = require('sat')
const BaseStructure = require('./baseStructure')
class GameWindmill extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
        this.gold = info.gold
        this.xp = info.xp
        this.update = setInterval(() => {
            this.addGold(this.gold)
            this.owner.addXP(this.xp)
        }, 1000)
    }
    updateLogic() {
        return {
            isRunning: false,
            idInterval: null,
            run(callback) {
                this.idInterval = setInterval(callback, 1000)
                this.isRunning = true
            },
            stop() {
                clearInterval(this.idInterval)
                this.isRunning = false
            }
        }
    }
    addGold(value) {
        if (this.owner != null) {
            this.owner.basicResources.Gold += value
            this.owner.scores += value
        }
    }
    destroy() {
        clearInterval(this.update)

    }
    toString() {
        return "Windmill"
    }
}

class old_GameWindmill {
    constructor(id, user, position, info) {
        this.id = id
        this.userId = user.idGame
        this.user = user
        this.position = position
        this.hp = info.health
        this.size = info.size
        this.itemId = info.id
        this.gold = info.gold
        this.xp = info.xp

        this.update = setInterval(() => {
            this.addGold(this.gold)
            this.user.addXP(this.xp)
        }, 1000)

        this.bodyCollider
        this.initCollider()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    addGold(value) {
        if (this.user != null) {
            this.user.basicResources.Gold += value
            this.user.scores += value
        }
    }
    destroy() {
        clearInterval(this.update)
    }
    toString() {
        return "Windmill"
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

module.exports = GameWindmill