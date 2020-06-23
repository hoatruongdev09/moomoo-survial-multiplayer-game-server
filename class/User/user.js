const TransmitCode = require('../../transmitcode')

const ResourceManager = require('../Player/resourcesManager')
const StructureManager = require('../Player/structureManager')
const LevelManager = require('../Player/levelManager')


const StateManager = require('./userStateManager')
const InitState = require('./userInitState')
const MenuState = require('./mainMenuState')
const GameState = require('./inGameState')
const LevelDescription = require("../levelInfo");
const EffectManager = require('../Player/effectManager')


class User {
    constructor(server, socket, serverIndex) {
        this.server = server
        this.socket = socket
        this.serverIndex = serverIndex
        this.id = ''

        this.isJoinedGame = false
        this.game = null
        this.idGame = null
        this.skinId = null
        this.clanId = null
        this.name = ''
        this.clientScreenSize = { width: 60, height: 30 }

        // MOVEMENT PROPERTIES
        this.moveSpeed = null

        // TRANSFORM
        this.position = null
        this.moveDirect = null // vector
        this.lookDirect = null // angle
        this.lastMovement = null  // angle
        this.lastLook = null // angle

        // BODYPART
        this.bodyCollider = null

        // WEAPONS
        this.weapons = []
        this.ownedItems = []

        this.currentItem = null

        // HEALTH
        this.healthPoint = null
        this.kills = null
        this.scores = null

        this.levelInfo = new LevelManager()

        this.basicResources = new ResourceManager()

        /* #region  MOVEMENT EFFECTS */
        this.speedModifier = 1
        this.environmentSpeedModifier = 1
        this.isWaterMoveNormal = false
        this.platformStanding = false
        this.isSnowMoveNormal = false
        this.isTrapped = false
        /* #endregion */
        /* #region  EFFECT OVER TIME */
        this.effectManger = new EffectManager(this)
        /* #endregion */

        /* #region  ATTACK EFFECT */
        this.projectileSpeedModifier = 0
        this.projectileRangeModifier = 0
        this.projectileCostModifier = 1
        this.attackSpeedModifier = 0
        this.damageTakenModifier = 0
        this.selfDamage = 0
        this.poisonResistant = false
        this.meleeDealPoison = false
        this.damageModifier = 0
        this.structureDamageModifier = 0
        this.damageReflect = 0
        this.forceReflect = 0
        this.lifeSteal = 0
        /* #endregion */
        /* #region  ANOTHER EFFECT */
        this.farmGoldBonus = 0
        this.turretIgnored = false
        this.bullIgnored = false
        this.killBonusGold = 0
        this.wearThiefGear = false
        this.isInvisible = false
        this.currentInvisible = false
        /* #endregion */
        // STRUCTURES
        this.spawnPad = null
        this.structures = new StructureManager()
        // OWNED HATS & ACCESSORIES
        this.ownedHat = []
        this.ownedAccessories = []
        this.equippedHat = null
        this.equippedAccessory = null
        // MISC
        this.stateManager = new StateManager()
        this.iniState = new InitState(this, this.stateManager)
        this.menuState = new MenuState(this, this.stateManager)
        this.gameState = new GameState(this, this.stateManager)

        this.stateManager.start(this.iniState, { socket: this.socket })
        this.registerEvent()
    }
    resetMovementEffects() {
        this.speedModifier = 1
        this.environmentSpeedModifier = 1
        this.isWaterMoveNormal = false
        this.platformStanding = false
        this.isSnowMoveNormal = false
        this.isTrapped = false
    }
    resetAttackEffects() {
        this.projectileSpeedModifier = 0
        this.projectileRangeModifier = 0
        this.projectileCostModifier = 1
        this.attackSpeedModifier = 0
        this.damageTakenModifier = 0
        this.selfDamage = 0
        this.poisonResistant = false
        this.meleeDealPoison = false
        this.damageModifier = 0
        this.structureDamageModifier = 0
        this.damageReflect = 0
        this.forceReflect = 0
        this.lifeSteal = 0
    }
    resetAnotherEffects() {
        this.farmGoldBonus = 0
        this.turretIgnored = false
        this.bullIgnored = false
        this.killBonusGold = 0
        this.wearThiefGear = false
        this.isInvisible = false
    }
    resetEffects() {
        this.effectManger.reset()
        this.resetMovementEffects()
        this.resetAttackEffects()
        this.resetAnotherEffects()
    }
    update(deltaTime) {
        this.stateManager.currentState.update(deltaTime)
    }
    enterMenu(data) {
        this.stateManager.changeState(this.menuState, { socket: this.socket, user: this, options: data })
    }
    enterGame(data) {
        this.stateManager.changeState(this.gameState, { gameData: data, user: this })
    }
    movementEffect() {
        if (this.isTrapped) {
            return 0
        }
        this.environmentSpeedModifier = (this.platformStanding || this.isSnowMoveNormal) ? 1 : this.environmentSpeedModifier
        return this.speedModifier * this.environmentSpeedModifier
    }
    takePoisonDamage() {

    }
    takeDamage(damage, dieCallback, reflect) {
        console.log("take damage")
        let damageTaking = damage * (1 - this.damageTakenModifier)
        this.healthPoint -= damageTaking
        reflect(damageTaking * this.damageReflect, this.forceReflect)
        if (this.healthPoint <= 0) {
            dieCallback(this.idGame)
            this.onDie()
        } else {
            this.game.onPlayerGetHit({
                id: this.idGame,
                hp: this.healthPoint
            })
        }
    }
    selfTakeDamage(damage, dieCallback) {
        let damageTaking = (damage * this.selfDamage) * (1 - this.damageTakenModifier)
        this.healthPoint -= damageTaking
        if (this.healthPoint <= 0) {
            dieCallback(this.idGame)
            this.onDie()
        } else {
            this.game.onPlayerGetHit({
                id: this.idGame,
                hp: this.healthPoint
            })
        }
    }
    lifeStealing(damage) {
        this.healthPoint += damage * this.lifeSteal
        if (this.healthPoint >= 100) {
            this.healthPoint = 100
        }
    }
    onDie() {
        this.isJoinedGame = false
        this.game.onPlayerDie(this.idGame)
        this.enterMenu(null)
    }
    receiveGameData(data) {
        this.game = data.game
        this.idGame = data.idGame
        this.send(TransmitCode.GameCode.gameData, data.gameData)
    }
    send(event, args) {
        this.socket.emit(event, args)
    }
    movePlayer(direct, deltaTime) {
        this.stateManager.currentState.movePlayer(direct, deltaTime)
    }
    getCurrentItems() {
        let data = []
        this.weapons.forEach((w) => {
            if (w != null) data.push(w.id)
        })
        this.ownedItems.forEach((i) => {
            data.push(i.id)
        })
        return data
    }
    receiveResource(amount, type) {
        this.basicResources[type] += amount
    }

    addXP(value) {
        this.stateManager.currentState.addXP(value)
    }
    addGold(value) {
        this.basicResources.Gold += value
        this.scores += value
    }
    loseResource(resource) {
        let woodRs = (this.basicResources.Wood - resource.Wood > 0) ? resource.Wood : this.basicResources.Wood
        let foodRs = (this.basicResources.Food - resource.Food > 0) ? resource.Food : this.basicResources.Food
        let stoneRs = (this.basicResources.Stone - resource.Stone > 0) ? resource.Stone : this.basicResources.Stone
        let goldRs = (this.basicResources.Gold - resource.Gold > 0) ? resource.Gold : this.basicResources.Gold
        this.basicResources.decreaseResource({
            Wood: woodRs,
            Food: foodRs,
            Stone: stoneRs,
            Gold: goldRs
        })
        this.updateStatus()
        return {
            Wood: woodRs,
            Food: foodRs,
            Stone: stoneRs,
            Gold: goldRs
        }
    }
    takeResource(resource) {
        this.basicResources.increaseResource(resource)
        this.updateStatus()
    }
    takeHP(value) {
        if (this.healthPoint >= 100) {
            this.healthPoint = 100
            return
        }
        this.healthPoint += value
        this.game.onPlayerGetHit({
            id: this.idGame,
            hp: this.healthPoint
        })
    }

    takeBonus(data) {
        this.kills += data.kills
        this.addGold(data.gold)
        this.addXP(data.xp)
        this.stateManager.currentState.updateStatus()
    }
    getCurrentGoldAmount() {
        return this.basicResources.Gold
    }
    equipHoldItem(item) {
        this.currentItem = item
        this.speedModifier = item.info.movement
    }
    updateStatus() {
        this.send(TransmitCode.GameCode.playerStatus, {
            scores: this.scores,
            kills: this.kills,
            level: this.levelInfo.level,
            xp:
                this.levelInfo.xp /
                LevelDescription[this.levelInfo.level].nextLevelUpXp,
            wood: this.basicResources.Wood,
            food: this.basicResources.Food,
            stone: this.basicResources.Stone,
            gold: this.basicResources.Gold,
        });
    }
    registerEvent() {
        this.socket.on("disconnect", () => this.onDisconnect())
        this.socket.on(TransmitCode.ServerCode.OnPing, () => this.onPing())
    }
    onDisconnect() {
        if (this.isSuspend) {
            return
        }
        this.stateManager.currentState.onDisconnected()
        if (this.game != null) {
            this.game.removePlayer(this)
        }
        this.server.removePlayer(this)
    }
    onPing() {
        this.send(TransmitCode.ServerCode.OnPing, null)
    }
    get isVisible() {
        return (this.isInvisible && this.currentInvisible)
    }
}

module.exports = User