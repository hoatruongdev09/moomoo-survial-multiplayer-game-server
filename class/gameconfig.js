const Victor = require('victor')

const gameConfig = {
    maxPlayer: 50,
    mapsize: new Victor(350, 350),
    snowSize: 0.2, // percent
    riverSize: 0.05, // percent
    snowSpeedModifier: 0.6,
    riverSpeedModifier: 0.6,
    playerSpeed: 7,
    defaultResourceRadius: 3,
    playColliderRadius: 1,
    maxNameLength: 15,

    viewSize: new Victor(15, 15),
    viewResourceRadius: 5,
    viewPlayerRadius: 8,

    woodCount: 10,
    foodCount: 10,
    rockCount: 10,
    goldCount: 5,

    resourceCount() {
        return this.woodCount + this.foodCount + this.rockCount + this.goldCount
    }
}
module.exports = gameConfig