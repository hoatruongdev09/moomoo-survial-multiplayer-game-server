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


module.exports = GameWindmill