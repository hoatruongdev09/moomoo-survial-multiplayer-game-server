const WeaponType = require('./weaponType').WeaponType
const SAT = require('sat')

class Melee {
    constructor(id, info) {
        this.id = id
        this.info = info
        this.idType = WeaponType.Melee
        // console.log("info mele: ", info)
        this.bodyCollider
    }

    attack(fromPosition, direct, angle) {
        let position = fromPosition.clone().add(direct.clone().scale(this.info.range))
        if (this.bodyCollider == null) {
            let vertices = [
                new SAT.Vector(this.info.size / 2, this.info.size / 2),
                new SAT.Vector(this.info.size / 2, -this.info.size / 2),
                new SAT.Vector(-this.info.size / 2, -this.info.size / 2),
                new SAT.Vector(-this.info.size / 2, this.info.size / 2)
            ]
            // console.log('vertices: ', vertices)
            this.bodyCollider = new SAT.Polygon(new SAT.Vector(position.x, position.y), vertices)
        }
        this.bodyCollider.pos = new SAT.Vector(position.x, position.y)
        this.bodyCollider.rotate(angle)

        // console.log("box: ", this.bodyCollider)
    }

}

module.exports = Melee