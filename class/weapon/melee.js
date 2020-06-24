const WeaponType = require('./weaponType').WeaponType
const SAT = require('sat')


class Melee {
    constructor(info) {
        this.info = info

        this.bodyCollider
        this.canUse = true
    }
    use(player, direct) {
        if (!this.canUse) {
            return
        }
        let position = player.position.clone().add(direct.clone().scale(this.info.range))
        if (this.bodyCollider == null) {
            this.bodyCollider = new SAT.Box(new SAT.Vector(position.x, position.y), this.info.size.x, this.info.size.y).toPolygon()
        }
        let angle = Math.atan2(direct.y, direct.x)
        this.bodyCollider.pos = new SAT.Vector(position.x, position.y)
        this.bodyCollider.setOffset(new SAT.Vector(-this.info.size.x / 2, -this.info.size.y / 2))
        this.bodyCollider.setAngle(angle)
        this.coolDown(player.attackSpeedModifier)
    }
    coolDown(bonus) {
        this.canUse = false
        let attackSpeed = this.info.attackSpeed * (1 - bonus)
        setTimeout(() => {
            this.canUse = true
        }, attackSpeed)
    }
    stealResourceEffect(stealCallback) {
        if (this.info.stealCost != null) {
            stealCallback(this.info.stealCost)
        }
    }
    toString() {
        return "Melee"
    }
}

module.exports = Melee