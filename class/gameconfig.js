const Victor = require('victor')

const gameConfig = {
    maxPlayer: 50,
    mapsize: new Victor(150, 150),
    playerSpeed: 7,
    defaultResourceRadius: 4,
    playColliderRadius: 1.5,
    maxNameLength: 15,

    viewSize: new Victor(15, 15),
    viewResourceRadius: 15,
    viewPlayerRadius: 15,

    woodCount: 10,
    foodCount: 10,
    rockCount: 10,
    goldCount: 5,

    resourceCount() {
        return this.woodCount + this.foodCount + this.rockCount + this.goldCount
    }
}
module.exports = gameConfig