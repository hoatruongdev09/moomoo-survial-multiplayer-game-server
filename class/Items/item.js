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
            this.item.use(player, direct)
        }
    }
}
module.exports = Item