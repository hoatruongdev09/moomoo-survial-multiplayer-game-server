const SAT = require('sat')
const BaseStructure = require('./baseStructure')

class GameWall extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)
    }
    toString() {
        return "Wall"
    }
}

class old_GameWall {
    constructor(id, userId, position, info) {
        this.id = id
        this.userId = userId
        this.position = position
        this.size = info.size
        this.hp = info.health
        this.itemId = info.id


        this.bodyCollider
        this.initCollider()
    }
    // constructor(id, userId, itemId, position, size, hp) {
    //     this.id = id
    //     this.userId = userId
    //     this.position = position
    //     this.size = size
    //     this.hp = hp
    //     this.itemId = itemId

    //     this.bodyCollider
    //     this.initCollider()
    // }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {

    }
    toString() {
        return "Wall"
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

module.exports = GameWall