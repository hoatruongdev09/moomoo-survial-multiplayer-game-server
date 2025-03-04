const Consume = require('./consume')
const Pad = require('./pad')
const Spike = require('./spike')
const Wall = require('./wall')
const Windmill = require('./windmill')
const PitTrap = require('./pittrap')
const BoostPad = require('./boostpad')
const HealingPad = require('./healingpad')
const MineStone = require('./minestone')
const Sapling = require('./sapling')
const Platform = require('./platform')
const Turret = require('./turret')
const Teleporter = require('./teleporter')
const Spawnpad = require('./spawnpad')
const Blocker = require('./blocker')
class Item {
    constructor(info) {
        this.info = info
        this.item = null
        if (this.info.type == "Consume") {
            this.item = new Consume(this.info)
            return
        }
        if (this.info.type == "Wall") {
            this.item = new Wall(this.info)
            return
        }
        if (this.info.type == "Windmill") {
            this.item = new Windmill(this.info)
            return
        }
        if (this.info.type == "Spike") {
            this.item = new Spike(this.info)
            return
        }
        if (this.info.type == "PitTrap") {
            this.item = new PitTrap(this.info)
            return
        }
        if (this.info.type == "BoostPad") {
            this.item = new BoostPad(this.info)
            return
        }
        if (this.info.type == "HealingPad") {
            this.item = new HealingPad(this.info)
            return
        }
        if (this.info.type == "MineStone") {
            this.item = new MineStone(this.info)
            return
        }
        if (this.info.type == "Sapling") {
            this.item = new Sapling(this.info)
            return
        }
        if (this.info.type == "Platform") {
            this.item = new Platform(this.info)
            return
        }
        if (this.info.type == "Turret") {
            this.item = new Turret(this.info)
            return
        }
        if (this.info.type == "Teleporter") {
            this.item = new Teleporter(this.info)
            return
        }
        if (this.info.type == "Spawnpad") {
            this.item = new Spawnpad(this.info)
            return
        }
        if (this.info.type == "Blocker") {
            this.item = new Blocker(this.info)
            return
        }
    }

    new_use(player, direct, callback, consumeCallBack) {
        if (this.item == null || !this.checkPlayerCanUseItem(player)) {
            return
        }
        if (!this.new_useItem(player, direct)) {
            return
        }
        callback(this.info.cost)
        if (this.info.type == "Consume") {
            consumeCallBack()
        }
    }
    new_useItem(player, direct) {
        return this.item.use(player, direct)
    }
    use(player, direct) {
        if (this.item != null) {
            if (this.checkPlayerCanUseItem(player)) {
                this.useItem(player, direct)
            }
        }
    }
    useItem(player, direct) {
        if (this.item.use(player, direct)) {
            let keys = Object.keys(this.info.cost)
            keys.forEach(k => {
                player.basicResources[k] -= this.info.cost[k]
            })
            player.updateStatus()
        }
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
            // console.log("WTF");
            result = false
        }
        return result
    }
}
module.exports = Item