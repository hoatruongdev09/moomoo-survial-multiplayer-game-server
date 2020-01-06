const SAT = require('sat')

class Resource {
    constructor(id, idType, position, amount, colliderRadius) {
        this.id = id
        this.idType = idType;
        this.position = position
        this.amount = amount

        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), colliderRadius)
    }

    reward(damage) {
        return {
            amount: damage,
            idType: this.idType
        }
    }
}



const ResourceType = {
    Wood: 0,
    Rock: 1,
    Gold: 2,
    Food: 3
}

module.exports = {
    Resource: Resource,
    ResourceType: ResourceType
}