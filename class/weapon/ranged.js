const Bullet = require('./bullet')

class Ranged {
    constructor(info) {
        this.info = info
        this.canUse = true
    }
    use(player, direct) {
        if (!this.canUse) {
            return
        }
        if (!this.checkPlayerCanUseItem(player)) {
            return
        }
        let position = player.position.clone().add(direct.clone().scale(2))
        let idProjectile = player.game.getProjectileId()
        let bullet = new Bullet(idProjectile, 0, player, direct, position, 0.2, this.info.bulletSpeed, this.info.range, this.info.damage)
        player.game.addProjectTile(bullet, Math.atan2(direct.y, direct.x))
        this.useItem(player)
        this.canUse = false
        setTimeout(() => {
            this.canUse = true
        }, this.info.attackSpeed)
    }
    checkPlayerCanUseItem(player) {
        let keys = Object.keys(this.info.cost)
        let result = true
        keys.forEach(k => {
            if (player.basicResources[k] < this.info.cost[k]) {
                result = false
            }
        })
        return result
    }
    useItem(player) {
        let keys = Object.keys(this.info.cost)
        keys.forEach(k => {
            player.basicResources[k] -= this.info.cost[k]
        })
        player.updateStatus()
    }
    toString() {
        return "Ranged"
    }
}
module.exports = Ranged