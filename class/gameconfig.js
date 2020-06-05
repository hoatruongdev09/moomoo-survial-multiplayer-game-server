const Victor = require('victor')

const gameConfig = {
    maxPlayer: 50,
    mapsize: new Victor(250, 250),
    snowSize: 0.2, // percent
    riverSize: 0.05, // percent
    snowSpeedModifier: 0.6,
    riverSpeedModifier: 0.6,
    playerSpeed: 7,
    defaultResourceRadius: 3,
    playColliderRadius: 1,
    maxNameLength: 15,


    npcDuckCount: 2,
    npcChickenCount: 2,
    npcCowCount: 3,
    npcBullCount: 3,
    npcSheepCount: 2,
    npcPigCount: 3,
    npcBullyCount: 4,
    npcWolfCount: 4,

    viewSize: new Victor(15, 15),
    viewScale: 0.8,
    viewResourceRadius: 5,
    viewPlayerRadius: 8,

    woodCount: 25,
    foodCount: 25,
    rockCount: 20,
    goldCount: 15,

    resourceCount() {
        return this.woodCount + this.foodCount + this.rockCount + this.goldCount
    },
    npcCount() {
        return this.npcDuckCount + this.npcChickenCount + this.npcCowCount + this.npcBullCount +
            this.npcSheepCount + this.npcPigCount + this.npcBullyCount + this.npcWolfCount
    }

}
module.exports = gameConfig