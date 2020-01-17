const ServerCode = require('../transmitcode').ServerCode
const GameCode = require('../transmitcode').GameCode


const Vector = require('../GameUtils/vector')
const SAT = require('sat')

const Melee = require('./weapon/melee')
const Ranged = require('./weapon/ranged')
const Item = require('./Items/item')

const levelDescription = require('./levelInfo')
class Player {
    constructor(idServer, server, socket) {
        // SERVER IDENTITIES 
        this.idServer = idServer
        this.server = server
        this.socket = socket

        // SERVER FUNCTION
        this.handleSocket(socket)

        // GAME IDENTITIES
        this.game = null
        this.idGame = -1
        this.isJoinedGame = false
        this.name = ""
        this.skinId = 0

        // MOVEMENT PROPERTIES
        this.moveSpeed

        // TRANSFORM 
        this.position
        this.moveDirect // vector
        this.lookDirect // angle
        this.lastMovement // angle
        this.lastLook // angle

        // BODYPART
        this.bodyCollider

        // VIEWS
        this.resourcesView = []
        this.playersView = []
        this.npcView = []
        this.structuresView = []

        // WEAPONS
        this.weapons = []
        this.onwedItems = []

        this.currentItem = null

        // HEALTH
        this.healthPoint = 100
        this.kills = 0
        this.scores = 0

        this.levelInfo = {
            xp: 0,
            level: 1,
            reset() {
                this.xp = 0
                this.level = 1
            }
        }

        this.basicResources = {
            Wood: 0,
            Food: 0,
            Stone: 0,
            Gold: 0,
            addAll(amount) {
                this.Wood += amount
                this.food += amount
                this.Stone += amount
                this.Gold += amount
            },
            reset() {
                this.Wood = this.Food = this.Stone = this.Gold = 0
            }
        }
        // EFFECT
        this.speedModifier = 1
        this.inviromentSpeedModifier = 1
        // STRUCTURES
        this.structures = {
            Wall: 0,
            Windmill: 0,
            Spike: 0,
            PitTrap: 0,
            BoostPad: 0,
            HealingPad: 0,
            MineStone: 0,
            Sapling: 0,

            reset() {
                this.Windmill = 0
                this.Wall = 0
                this.Spike = 0
                this.PitTrap = 0
                this.BoostPad = 0
                this.HealingPad = 0
                this.MineStone = 0
                this.Sapling = 0
            }
        }

        // MISC
        this.isAutoAttack = false
        this.intervalAutoAttack

    }
    enterGame(data) {
        this.isJoinedGame = true
        this.moveSpeed = data.moveSpeed
        this.position = data.position
        this.lookDirect = data.lookDirect

        this.healthPoint = 100
        this.kills = 0
        this.scores = 0
        this.levelInfo.reset()
        this.basicResources.reset()

        this.onwedItems = data.items.items
        this.weapons = data.items.weapons
        this.currentItem = this.createWeapon(this.weapons[0])

        this.isAutoAttack = false
        clearInterval(this.intervalAutoAttack)

        this.structures.reset()
        if (this.bodyCollider == null) {
            this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)

        } else {
            this.bodyCollider.pos.x = this.position.x
            this.bodyCollider.pos.y = this.position.y
            // this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)
        }
        this.updateStatus()
        this.syncItem()
    }
    createWeapon(info) {
        if (info.type == "Melee") {
            return new Melee(info)
        }
        if (info.type == "Ranged") {
            return new Ranged(info)
        }
    }
    createItem(info) {
        return new Item(info)
    }
    update(deltaTime) {
        this.updatePosition(deltaTime)
        this.updateRotation()
    }
    updatePosition(deltaTime) {
        if (this.lastMovement == null) {
            return
        }
        this.moveDirect = new Vector(
            Math.cos(this.lastMovement),
            Math.sin(this.lastMovement)
        )

        this.position.add(this.moveDirect.clone().scale(this.moveSpeed * this.speedModifier * this.inviromentSpeedModifier * deltaTime))
        // console.log(this.position)

        this.bodyCollider.pos.x = this.position.x
        this.bodyCollider.pos.y = this.position.y

        this.checkCollider()
    }
    movePlayer(direct, deltaTime) {
        this.lastMovement = direct
        this.moveDirect = new Vector(
            Math.cos(this.lastMovement),
            Math.sin(this.lastMovement)
        )
        this.position.add(this.moveDirect.clone().scale(this.moveSpeed * deltaTime))
        this.bodyCollider.pos.x = this.position.x
        this.bodyCollider.pos.y = this.position.y

        this.checkCollider()
    }
    updateRotation() {
        if (this.lastLook == null) {
            return
        }
        this.lookDirect = this.lastLook

    }
    checkCollider() {
        this.checkColliderWithResources()
        this.checkColliderWithStructures()
    }
    checkColliderWithResources() {
        this.resourcesView = this.game.getResourceFromView(this.position)
        for (const r of this.resourcesView) {
            this.game.testCollisionCircle2Cirle(this, r, (response, objectCollide) => this.onCollisionWithResource(response, objectCollide))
        }
        // console.log("resource: ", this.resourcesView)
    }
    checkColliderWithStructures() {
        this.structuresView = this.game.getStructureFromView(this.position)
        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Cirle(this, s, (response, objectCollide) => this.onCollisionWithStructures(response, objectCollide, s))
        }
    }
    checkAttackToResource() {
        this.resourcesView = this.game.getResourceFromView(this.position)
        for (const r of this.resourcesView) {
            this.game.testCollisionPoligon2Cirle(this.currentItem, r, (response, objectCollide) => this.onHitResource(response, objectCollide, r))
        }

        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Cirle(this.currentItem, s, (response, objectCollide) => this.onHitStructure(response, objectCollide, s))
        }
    }

    onHitStructure(response, object, objectInfo) {
        this.game.playerAttackStructure(this.idGame, objectInfo.id, this.currentItem)
    }
    onHitResource(response, object, objectInfo) {
        this.game.playerAttackResource(this, objectInfo.id, this.currentItem)
    }
    checkAttackToPlayer() {
        this.playersView = this.game.getPlayersFromView(this.position)
        for (const p of this.playersView) {
            this.game.testCollisionPoligon2Cirle(this.currentItem, p, (response, objectCollide) => this.onHitPlayer(response, objectCollide, p))
        }
    }
    checkAttackToNpc() {
        this.npcView = this.game.getNpcFromView(this.position)
        for (const n of this.npcView) {
            this.game.testCollisionPoligon2Cirle(this.currentItem, n, (response, objectCollide) => this.onHitNpc(response, objectCollide, n))
        }
    }
    onHitNpc(response, object, objectInfo) {
        this.game.playerHitNpc(this.idGame, objectInfo.id, this.currentItem.info.damage)
    }
    onHitPlayer(response, object, objectInfo) {
        // console.log("hit player: ", objectInfo.id)
        if (objectInfo.id != this.idGame) {
            this.game.playerHitPlayer(this.idGame, objectInfo.id, this.currentItem.info.damage)
        }
    }
    onCollisionWithStructures(response, object, objectInfo) {
        if (["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"].includes(objectInfo.type)) {
            // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
            let overlapPos = response.overlapV
            this.position.x -= overlapPos.x
            this.position.y -= overlapPos.y
        }
        this.game.playerHitStructures(this.idGame, objectInfo.id)
    }
    onCollisionWithResource(response, object) {
        let overlapPos = response.overlapV
        this.position.x -= overlapPos.x
        this.position.y -= overlapPos.y
    }
    handleSocket(socket) {
        socket.emit(ServerCode.OnConnect, {
            id: this.idServer,
            listGame: this.server.listGame()
        })
        this.registerListenter()
    }
    registerListenter() {
        this.socket.on('disconnect', () => this.onDisconnect())
        this.socket.on(ServerCode.OnRequestJoin, (data) => this.OnJoin(data))
        this.socket.on(GameCode.receivedData, (data) => this.OnRecievedGameData(data))
        this.socket.on(GameCode.syncLookDirect, (data) => this.syncLookDirect(data))
        this.socket.on(GameCode.syncMoveDirect, (data) => this.syncMoveDirect(data))
        this.socket.on(GameCode.triggerAttack, (data) => this.useItem(data))
        this.socket.on(GameCode.triggerAutoAttack, (data) => this.autoAttack(data))
        this.socket.on(GameCode.switchItem, (data) => this.switchItem(data))
        this.socket.on(GameCode.upgradeItem, (data) => this.upgradeItem(data))
        this.socket.on(GameCode.playerChat, (data) => this.chat(data))
        this.socket.on(GameCode.scoreBoard, () => this.sendScore())
    }

    OnJoin(data) {
        // console.log("on join: ", data)
        this.skinId = data.skinId
        this.server.playerJoinGame(this, data)
    }
    OnRecievedGameData(data) {
        this.game.playerJoin(this)
    }
    onDisconnect() {
        if (this.game != null) {
            this.game.removePlayer(this)
        }

        this.server.removePlayer(this)
    }

    syncLookDirect(data) {
        this.lastLook = data
    }
    syncMoveDirect(data) {
        this.lastMovement = data
    }
    useItem(data) {
        // console.log("current item: ", this.currentItem)
        if (this.currentItem.toString() == "Melee") {
            this.triggerMeleeAttack()
            return
        } else if (this.currentItem.toString() == "Ranged") {
            this.triggerRangedAttack()
        } else {
            if (data.isbtn)
                this.triggerUseItem()
        }

    }
    autoAttack(data) {
        if (this.currentItem.toString() == "Melee") {
            this.isAutoAttack = data.action
            if (!this.isAutoAttack) {
                clearInterval(this.intervalAutoAttack)
            } else {
                this.startMeleeAutoAttack()
            }
            return
        } else if (this.currentItem.toString() == "Ranged") {
            this.isAutoAttack = data.action
            if (!this.isAutoAttack) {
                clearInterval(this.intervalAutoAttack)
            } else {
                this.startRangeAutoAttack()
            }
        }
    }
    startMeleeAutoAttack() {
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack)
        }
        this.intervalAutoAttack = setInterval(() => {
            this.triggerMeleeAttack()
        }, this.currentItem.info.attackSpeed)
    }
    startRangeAutoAttack() {
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack)
        }
        this.intervalAutoAttack = setInterval(() => {
            this.triggerRangedAttack()
        }, this.currentItem.info.attackSpeed)
    }
    switchItem(data) {
        // console.log("swithc item: ", data)
        // console.log("last item: ", this.currentItem)
        if (this.currentItem.info.id == data.code) {
            return
        }
        let type = data.code.charAt(0)
        if (type == "w") {
            let weapon = this.findWeapon(data.code)
            if (weapon != null) {
                this.currentItem = this.createWeapon(weapon)
            }
        } else if (type == "i") {
            let item = this.findItem(data.code)
            if (item != null) {
                this.currentItem = this.createItem(item)
            }
        }
        // console.log("current Item: ", this.currentItem)
        this.game.broadcast(GameCode.switchItem, {
            id: this.idGame,
            item: this.currentItem.info.id
        })
    }
    upgradeItem(data) {
        // console.log("weapon: ", this.weapons)
        let itemType = data.code.charAt(0)
        if (itemType == "w") {
            let info = this.game.getWeaponByCode(data.code)
            this.upgradeWeapon(info)
        } else if (itemType == "i") {
            let info = this.game.getItemByCode(data.code)
            this.upgradeOwnedItem(info)
            this.currentItem = this.createItem(info)
        }
        this.game.broadcast(GameCode.switchItem, {
            id: this.idGame,
            item: this.currentItem.info.id
        })
        this.syncItem()
    }
    syncItem() {
        this.send(GameCode.syncItem, {
            items: this.getCurrentItems()
        })
    }
    upgradeWeapon(info) {
        if (info.main) {
            this.weapons[0] = info
        } else {
            this.weapons[1] = info
        }
        this.currentItem = this.createWeapon(info)
    }
    upgradeOwnedItem(info) {
        if (info.type == "Windmill" || info.type == "Wall" || info.type == "Spike" || info.type == "Consume") {
            for (let i = 0; i < this.onwedItems.length; i++) {
                if (this.onwedItems[i].type == info.type) {
                    this.onwedItems.splice(i, 1)
                    break
                }
            }
        }
        this.onwedItems.push(info)
    }
    getCurrentItems() {
        let data = []
        this.weapons.forEach(w => {
            if (w != null)
                data.push(w.id)
        })
        this.onwedItems.forEach(i => {
            data.push(i.id)
        })
        return data
    }
    findWeapon(id) {
        let weapon = null
        this.weapons.forEach(w => {
            if (w != null && w.id == id) {
                weapon = w
            }
        })
        return weapon
    }
    findItem(id) {
        let item = null
        this.onwedItems.forEach(i => {
            if (i.id == id) {
                item = i
            }
        })
        return item
    }
    triggerMeleeAttack() {
        if (!this.currentItem.canUse) {
            return
        }
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect))
        this.currentItem.use(this, direct)
        this.checkAttackToResource()
        this.checkAttackToNpc()
        this.checkAttackToPlayer()
        this.game.broadcast(GameCode.triggerAttack, {
            idGame: this.idGame,
            type: this.currentItem.idType
        })
    }
    triggerRangedAttack() {
        if (!this.currentItem.canUse) {
            return
        }
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect))
        this.currentItem.use(this, direct)
    }
    triggerUseItem() {
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect))
        this.currentItem.use(this, direct)
    }
    receiveResource(amount, type) {
        this.basicResources[type] += amount
    }
    addGold(value) {
        this.basicResources.Gold += value
        this.scores += value
    }
    addXP(value) {
        this.levelInfo.xp += value
        if (this.levelInfo.xp >= levelDescription[this.levelInfo.level].nextLevelUpXp) {
            this.levelInfo.level++
            this.levelInfo.xp = 0
            this.onLevelUp()
        }
        this.updateStatus()
    }
    onLevelUp() {
        let lvUpItem = []
        let itemByLevel = this.game.getItemsByLevel(this.levelInfo.level)
        itemByLevel.weapons.forEach(w => {
            if (w != null) {
                lvUpItem.push(w.id)
            }
        })
        itemByLevel.items.forEach(i => {
            if (i != null) {
                lvUpItem.push(i.id)
            }
        })
        this.send(GameCode.upgradeItem, {
            items: lvUpItem
        })
    }
    updateStatus() {
        this.send(GameCode.playerStatus, {
            scores: this.scores,
            kills: this.kills,
            level: this.levelInfo.level,
            xp: this.levelInfo.xp / levelDescription[this.levelInfo.level].nextLevelUpXp,
            wood: this.basicResources.Wood,
            food: this.basicResources.Food,
            stone: this.basicResources.Stone,
            gold: this.basicResources.Gold
        })
    }
    chat(data) {
        console.log(data)
        this.game.sendChat(data)
        if (data.text == "rss") {
            this.basicResources.addAll(1000)
            this.updateStatus()
        } else if (data.text == "exp") {
            this.addXP(1000)
        }

    }
    sendScore() {
        let data = this.game.getPlayerScore()
        this.send(GameCode.scoreBoard, {
            data: data
        })
    }
    // Transmit
    send(event, args) {
        this.socket.emit(event, args)
    }
}
module.exports = Player