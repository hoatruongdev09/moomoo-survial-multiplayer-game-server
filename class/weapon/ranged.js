const Bullet = require('./bullet')

class Ranged {
    constructor(info) {
        this.info = info
        this.canUse = true
    }
    use(player, direct, callback, effect) {
        if (!this.canUse || !this.checkPlayerCanUseItem(player)) {
            return
        }
        let bullet = this.createBullet(player.game.getProjectileId(), player, player.position, direct)
        player.game.addProjectTile(bullet, Math.atan2(direct.y, direct.x))
        if (callback != null) {
            callback(this.info.cost)
        }
        this.coolDown(player.attackSpeedModifier)
    }
    createBullet(id, player, shootPosition, direct) {
        let projectileSpeed = this.info.bulletSpeed * (player.projectileSpeedModifier + 1)
        let projectileRange = this.info.range * (player.projectileRangeModifier + 1)
        let projectileDamage = this.info.damage * (player.damageModifier + 1)
        let position = shootPosition.clone().add(direct.clone().scale(2))
        return new Bullet(id, 0, player, direct, position, 0.2, projectileSpeed, projectileRange, projectileDamage)
    }
    coolDown(bonus) {
        this.canUse = false
        let attackSpeed = this.info.attackSpeed * (1 - bonus)
        setTimeout(() => {
            this.canUse = true
        }, attackSpeed)
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
    stealResourceEffect(stealCallback) {
        if (this.info.stealCost != null) {
            stealCallback(this.info.stealCost)
        }
    }
    new_useItem(player, callback) {
        callback(this.info.cost)
    }
    toString() {
        return "Ranged"
    }
}
module.exports = Ranged