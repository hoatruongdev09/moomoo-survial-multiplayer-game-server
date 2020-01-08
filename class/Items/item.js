const Consume = require('./consume')
const Pad = require('./pad')
const Spike = require('./spike')
const Wall = require('./wall')
const Windmill = require('./windmill')
const PitTrap = require('./pittrap')

class Item {
    constructor(info) {
        this.info = info
        this.item = null
        if (this.info.type == "Consume") {
            this.item = new Consume(this.info)
        }
        if (this.info.type == "Wall") {
            this.item = new Wall(this.info)
        }
        if (this.info.type == "Windmill") {
            this.item = new Windmill(this.info)
        }
        if (this.info.type == "Spike") {
            this.item = new Spike(this.info)
        }
        if (this.info.type == "PitTrap") {
            this.item = new PitTrap(this.info)
        }
    }

    use(player, direct) {
        if (this.item != null) {
            if (this.checkPlayerCanUseItem(player)) {
                this.useItem(player, direct)
            }
        }
    }
    useItem(player, direct) {
        let keys = Object.keys(this.info.cost)
        keys.forEach(k => {
            player.basicResources[k] -= this.info.cost[k]
        })
        player.updateStatus()
        this.item.use(player, direct)
    }
    checkPlayerCanUseItem(player) {
        let keys = Object.keys(this.info.cost)
        let result = true
        keys.forEach(k => {
            if (player.basicResources[k] < this.info.cost[k]) {
                result = false
            }
        })
        if (player.structures[this.info.type] >= this.info.limit) {
            result = false
        }
        return result
    }
}
module.exports = Item