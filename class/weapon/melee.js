const WeaponType = require('./weaponType').WeaponType
const SAT = require('sat')


class Melee {
    constructor(id, info) {
        this.id = id
        this.info = info
        this.idType = WeaponType.Melee

        this.bodyCollider
        this.canUse = true
    }

    use(fromPosition, direct) {
        if (!this.canUse) {
            return
        }
        let position = fromPosition.clone().add(direct.clone().scale(this.info.range))
        if (this.bodyCollider == null) {
            this.bodyCollider = new SAT.Box(new SAT.Vector(position.x, position.y), this.info.size.x, this.info.size.y).toPolygon()
        }
        this.bodyCollider.setOffset(new SAT.Vector(-this.info.size.x / 2, -this.info.size.y / 2))
        let angle = Math.atan2(direct.y, direct.x)
        this.bodyCollider.pos = new SAT.Vector(position.x, position.y)
        this.bodyCollider.setAngle(angle)
        // console.log("box: ", this.bodyCollider)
        this.canUse = false
        setTimeout(() => {
            this.canUse = true
        }, this.info.attackSpeed)
    }
    toString() {
        return "Melee"
    }
}

module.exports = Melee