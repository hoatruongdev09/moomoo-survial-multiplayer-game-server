const servercode = require('../transmitcode').ServerCode
const gamecode = require('../transmitcode').GameCode
const Map = require('./map')
const Resource = require('./resource').Resource
const ResourceType = require('./resource').ResourceType

const PhysicEngine = require('./physicEngine')

const Mathf = require('mathf')
const Vector = require('../GameUtils/vector')

const WeaponInfo = require('./weapon/weaponInfo')
const ItemInfo = require('./Items/itemInfo')

const NPC = require('./NPCs/hostitleNpc')
class Game {
    constructor(id, server, gameConfig, name) {
        this.name = name
        this.id = id
        this.server = server
        this.gameConfig = gameConfig

        this.players
        this.npc
        this.currentPlayerCount = 0

        this.resources
        this.userResources = []
        this.structures = []
        this.projectile = []


        this.projectileCount = 0
        this.structuresCount = 0

        this.map = new Map(this.gameConfig.mapsize, {
            x: 2,
            y: 2
        }, this.gameConfig.snowSize, this.gameConfig.riverSize)

        this.physic = new PhysicEngine()
        this.init()
    }
    /* #region  INITIALIZE  */

    init() {
        this.players = new Array(this.gameConfig.maxPlayer)
        this.npc = new Array(this.gameConfig.npcCount())
        this.initializeResources()
        this.initializeNPC()
    }
    initializeResources() {
        this.resources = new Array(this.gameConfig.resourceCount())
        this.initializeResource(0, this.gameConfig.woodCount, ResourceType.Wood)
        this.initializeResource(10, this.gameConfig.foodCount, ResourceType.Food)
        this.initializeResource(20, this.gameConfig.rockCount, ResourceType.Stone)
        this.initializeResource(30, this.gameConfig.goldCount, ResourceType.Gold)
    }
    initializeResource(startId, count, type) {
        for (let i = startId; i < startId + count; i++) {
            let rs = new Resource(i, type, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius)
            this.resources[i] = rs
        }
    }
    initializeNPC() {
        let j = 0;
        for (let i = 0; i < this.gameConfig.npcDuckCount; i++, j++) { // DUCK
            this.npc[j] = new NPC(j, 4, false, this.getRandomPosition(), this, 2)
        }
        for (let i = 0; i < this.gameConfig.npcChickenCount; i++, j++) { // CHICKEN
            this.npc[j] = new NPC(j, 3, false, this.getRandomPosition(), this, 2)
        }
        for (let i = 0; i < this.gameConfig.npcCowCount; i++, j++) { // COW
            this.npc[j] = new NPC(j, 0, false, this.getRandomPosition(), this, 2.4)
        }
        for (let i = 0; i < this.gameConfig.npcBullCount; i++, j++) { // BULL
            this.npc[j] = new NPC(j, 5, false, this.getRandomPosition(), this, 2.4)
        }
        for (let i = 0; i < this.gameConfig.npcSheepCount; i++, j++) { // SHEEP
            this.npc[j] = new NPC(j, 2, false, this.getRandomPosition(), this, 2.4)
        }
        for (let i = 0; i < this.gameConfig.npcPigCount; i++, j++) { // PIG
            this.npc[j] = new NPC(j, 1, false, this.getRandomPosition(), this, 2.4)
        }
        for (let i = 0; i < this.gameConfig.npcBullyCount; i++, j++) { // BULLY
            this.npc[j] = new NPC(j, 6, false, this.getRandomPosition(), this, 2.4)
        }
        for (let i = 0; i < this.gameConfig.npcWolfCount; i++, j++) { // COW
            this.npc[j] = new NPC(j, 7, false, this.getRandomPosition(), this, 2.4)
        }
    }
    /* #endregion */

    /* #region  PLAYER MANAGER */
    isFull() {
        return this.currentPlayerCount >= this.gameConfig.maxPlayer
    }
    canJoin(data) {
        if (data.name.length >= this.gameConfig.maxNameLength) {
            return {
                result: false,
                reason: "Name is over 15 characters"
            }
        }
        if (this.currentPlayerCount >= this.gameConfig.maxPlayer) {
            return {
                result: false,
                reason: "Game is full"
            }
        }
        return {
            result: true,
            reason: ""
        }
    }
    addPlayer(player, data) {
        let slot = this.findEmptySlot()
        if (slot != null) {
            this.players[slot] = player
            this.currentPlayerCount++
            player.name = data.name
            player.game = this
            player.idGame = slot
            player.send(gamecode.gameData, this.getCurrentGameData())
        } else {
            console.log("game slot is null")
        }
    }
    playerJoin(player) {
        let tempPosition = this.map.randomPosition()
        player.enterGame({
            moveSpeed: this.gameConfig.playerSpeed,
            position: new Vector(tempPosition.x, tempPosition.y),
            lookDirect: this.map.rangdomAngle(),
            bodyRadius: this.gameConfig.playColliderRadius,
            items: this.getStarterPack()
        })
        this.broadcast(gamecode.spawnPlayer, {
            clientId: player.idServer,
            id: player.idGame,
            name: player.name,
            skinId: player.skinId,
            pos: {
                x: player.position.x,
                y: player.position.y
            }
        })
    }
    removePlayer(player) {
        if (player.isJoinedGame) {
            this.broadcast(gamecode.playerQuit, {
                id: player.idGame
            })
        }
        this.removePlayerStructures(player.idGame)
        this.players[player.idGame] = null
        this.currentPlayerCount--
    }
    findEmptySlot() {
        for (let slot = 0; slot < this.players.length; slot++) {
            if (this.players[slot] == null) {
                return slot
            }
        }
        return null
    }
    updatePlayers(deltaTime) {
        var positionData = []
        var lookData = []

        let temp = null
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                p.update(deltaTime)
                temp = this.syncSinglePlayerPosition(p, deltaTime)
                if (temp.pos != null) {
                    positionData.push(temp.pos)
                }
                if (temp.rot != null) {
                    lookData.push(temp.rot)
                }
            }
        })
        if (positionData.length != 0 || lookData.length != 0) {
            this.broadcast(gamecode.syncTransform, {
                pos: positionData,
                rot: lookData
            })
        }
    }
    updateNPC(deltaTime) {
        let positionData = []
        let temp = null
        this.npc.forEach(n => {
            if (n != null && n.isJoined) {
                n.update(deltaTime)
                temp = this.syncSingleNpcPosition(n, deltaTime)
                if (temp != null) {
                    positionData.push(temp)
                }
            }
        })
        if (positionData.length != 0) {
            this.broadcast(gamecode.syncNpcTransform, {
                pos: positionData
            })
        }
    }
    syncSingleNpcPosition(n, deltaTime) {
        let data = null
        if (n != null && n.isJoined) {
            if (n.lastMoveDirect != null) {
                n.position = this.map.clampPositionToMap(n.position)
                data = {
                    id: n.id,
                    pos: {
                        x: n.position.x,
                        y: n.position.y
                    },
                    rot: n.lookAngle
                }
            }
        }
        return data
    }
    // syncNpcPosition(deltaTime) {
    //     var positionData = []

    //     this.npc.forEach(n => {
    //         if (n != null && n.isJoined) {
    //             if (n.lastMoveDirect != null) {
    //                 n.position = this.map.clampPositionToMap(n.position)
    //                 positionData.push({
    //                     id: n.id,
    //                     pos: {
    //                         x: n.position.x,
    //                         y: n.position.y
    //                     },
    //                     rot: n.lookAngle
    //                 })
    //             }
    //         }
    //     })
    //     if (positionData.length != 0) {
    //         this.broadcast(gamecode.syncNpcTransform, {
    //             pos: positionData
    //         })
    //     }
    // }
    syncSinglePlayerPosition(p, deltaTime) {
        let syncTransform = {
            pos: null,
            rot: null
        }
        if (this.map.checkIfPlayerIsInRiver(p.position)) {
            p.inviromentSpeedModifier = this.gameConfig.riverSpeedModifier
            p.movePlayer(0, deltaTime)
        } else if (this.map.checkIfPlayerIsInSnow(p.position)) {
            p.inviromentSpeedModifier = this.gameConfig.snowSpeedModifier
        } else {
            p.inviromentSpeedModifier = 1
        }
        if (p.lastMovement != null) {
            p.position = this.map.clampPositionToMap(p.position)
            syncTransform.pos = {
                id: p.idGame,
                pos: {
                    x: p.position.x,
                    y: p.position.y
                }
            }
        }
        if (p.lastLook != null) {
            syncTransform.rot = {
                id: p.idGame,
                angle: p.lookDirect
            }
        }
        return syncTransform
    }
    // syncPlayerPosition(deltaTime) {
    //     var positionData = []
    //     var lookData = []

    //     this.players.forEach(p => {
    //         if (p != null && p.isJoinedGame) {
    //             if (this.map.checkIfPlayerIsInRiver(p.position)) {
    //                 p.inviromentSpeedModifier = this.gameConfig.riverSpeedModifier
    //                 p.movePlayer(0, deltaTime)
    //             } else if (this.map.checkIfPlayerIsInSnow(p.position)) {
    //                 p.inviromentSpeedModifier = this.gameConfig.snowSpeedModifier
    //             } else {
    //                 p.inviromentSpeedModifier = 1
    //             }
    //             if (p.lastMovement != null) {

    //                 p.position = this.map.clampPositionToMap(p.position)
    //                 positionData.push({
    //                     id: p.idGame,
    //                     pos: {
    //                         x: p.position.x,
    //                         y: p.position.y
    //                     }
    //                 })
    //             }
    //             if (p.lastLook != null) {
    //                 lookData.push({
    //                     id: p.idGame,
    //                     angle: p.lookDirect
    //                 })
    //             }
    //         }
    //     })
    //     if (positionData.length != 0 || lookData.length != 0) {
    //         this.broadcast(gamecode.syncTransform, {
    //             pos: positionData,
    //             rot: lookData
    //         })
    //     }
    // }
    getNpcFromView(position) {
        let viewObjects = []
        let temp = new Vector(0, 0)
        this.npc.forEach(n => {
            if (n != null && n.isJoined) {
                temp.x = position.x - n.position.x
                temp.y = position.y - n.position.y
                if (temp.sqrMagnitude() < Math.pow(this.gameConfig.viewPlayerRadius, 2)) {
                    viewObjects.push({
                        id: n.id,
                        bodyCollider: n.bodyCollider
                    })
                }
            }
        })
        return viewObjects
    }
    getPlayersFromView(position) {
        let viewObjects = []
        let temp = new Vector(0, 0)

        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                temp.x = position.x - p.position.x
                temp.y = position.y - p.position.y
                if (temp.sqrMagnitude() < Math.pow(this.gameConfig.viewPlayerRadius, 2)) {
                    viewObjects.push({
                        id: p.idGame,
                        bodyCollider: p.bodyCollider
                    })
                }
            }
        })
        return viewObjects
    }

    /* #endregion */

    /* #region  GAME DATA */
    getCurrentGameData() {
        let gameData = {
            maxPlayer: this.gameConfig.maxPlayer,
            maxNpcCount: this.gameConfig.npcCount(),
            mapSize: {
                x: this.gameConfig.mapsize.x,
                y: this.gameConfig.mapsize.y
            },
            snowSize: this.gameConfig.snowSize,
            riverSize: this.gameConfig.riverSize,
            resource: this.getResourceInfo(),
            players: this.getPlayersInfo(),
            structures: this.getStructuresInfo(),
            npc: this.getNpcInfo()
        }

        return gameData
    }
    getPlayersInfo() {
        let data = []
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                data.push({
                    id: p.idGame,
                    name: p.name,
                    skinId: p.skinId,
                    pos: {
                        x: p.position.x,
                        y: p.position.y
                    }
                })
            }
        })
        return data
    }
    getNpcInfo() {
        let data = []
        this.npc.forEach(n => {
            data.push({
                id: n.id,
                skinId: n.skinId,
                pos: {
                    x: n.position.x,
                    y: n.position.y
                },
                rot: n.lookAngle
            })
        })
        return data
    }
    getStructuresInfo() {
        let data = []
        this.structures.forEach(item => {
            data.push({
                id: item.id,
                itemId: item.itemId,
                pos: {
                    x: item.position.x,
                    y: item.position.y
                },
                rot: item.rotation
            })
        })
        return data
    }
    getResourceInfo() {
        let data = []
        this.resources.forEach(r => {
            data.push({
                id: r.id,
                type: r.idType,
                pos: r.position
            })
        })
        return data
    }
    /* #endregion */
    /* #region  GAME WEAPON AND STRUCTURE */

    getStarterPack() {
        let mainWeapon = WeaponInfo.getInfoByAge(1) //WeaponInfo.getInfoByStringId("w0")
        let items = ItemInfo.getInfoByAge(1)

        return {
            weapons: mainWeapon,
            items: items
        }
    }
    getItemsByLevel(level) {
        let weapons = WeaponInfo.getInfoByAge(level)
        let items = ItemInfo.getInfoByAge(level)
        return {
            weapons: weapons,
            items: items
        }
    }
    getWeaponByCode(code) {
        return WeaponInfo.getInfoByStringId(code)
    }
    getItemByCode(code) {
        return ItemInfo.getInfoByStringId(code)
    }
    /* #endregion */
    update(deltaTime) {
        this.updatePlayers(deltaTime)
        this.updateNPC(deltaTime)
        // this.syncPlayerPosition(deltaTime)
        // this.syncNpcPosition(deltaTime)
        this.updatePositionProjectile(deltaTime)
    }
    /* #region  GAME EVIROMENT VIEW */
    getResourceFromView(position) {
        let viewObjects = []
        let temp = new Vector(0, 0)
        this.resources.forEach(r => {
            temp.x = position.x - r.position.x
            temp.y = position.y - r.position.y
            if (temp.sqrMagnitude() < Math.pow(this.gameConfig.viewResourceRadius, 2)) {
                viewObjects.push({
                    id: r.id,
                    bodyCollider: r.bodyCollider
                })
            }
        })
        return viewObjects
    }
    getStructureFromView(position) {
        let viewObjects = []
        let temp = new Vector(0, 0)
        this.structures.forEach(s => {
            temp.x = position.x - s.position.x
            temp.y = position.y - s.position.y
            if (temp.sqrMagnitude() < Math.pow(this.gameConfig.viewResourceRadius, 2)) {
                viewObjects.push({
                    id: s.id,
                    type: s.toString(),
                    bodyCollider: s.bodyCollider
                })
            }
        })
        return viewObjects
    }
    /* #endregion */

    /* #region  COLLIDER TESTER */
    testCollisionCircle2Cirle(object1, object2, response) {
        return this.physic.testCircle2Cirle(object1.bodyCollider, object2.bodyCollider, response)
    }
    testCollisionPoligon2Cirle(poliObj, circleObj, response) {
        return this.physic.testPoligon2Cirle(poliObj.bodyCollider, circleObj.bodyCollider, response)
    }
    /* #endregion */
    /* #region   COLLISION CHECK*/
    playerHitPlayer(idFrom, idTarget, damage) {
        console.log("player hit damage: ", damage)
        this.players[idTarget].healthPoint -= damage
        if (this.players[idTarget].healthPoint <= 0) {
            this.players[idTarget].isJoinedGame = false
            this.removePlayerStructures(idTarget)
            this.broadcast(gamecode.playerDie, {
                id: idTarget
            })
            if (this.players[idFrom] != null && this.players[idFrom].isJoinedGame) {
                this.players[idFrom].kills++
                this.players[idFrom].scores += 25
                this.players[idFrom].updateStatus()
            }
        } else {
            let data = []
            data.push({
                id: idTarget,
                hp: this.players[idTarget].healthPoint
            })
            this.syncPlayerHealthpoint(data)
        }
    }
    playerHitNpc(idFrom, idTarget, damage) {
        this.playerStructureHitNpc(idFrom, idTarget, damage)
    }
    playerStructureHitNpc(idFrom, idTarget, damage) {
        this.npc[idTarget].healthPoint -= damage
        this.npc[idTarget].onHit()
        if (this.npc[idTarget].healthPoint <= 0) {
            this.npc[idTarget].isJoined = false
            // BROAD CAST EVENT NPC DIE
            this.broadcast(gamecode.syncNpcDie, {
                id: idTarget
            })
            if (this.players[idFrom] != null && this.players[idFrom].isJoinedGame) {
                this.players[idFrom].scores += 25
                this.players[idFrom].updateStatus()
            }
        } else {
            let data = []
            data.push({
                id: idTarget,
                hp: this.npc[idTarget].healthPoint
            })
            // BROAD CAST EVENT HP
            this.syncNpcHealthpoint(data)
        }
    }
    syncNpcHealthpoint(data) {
        this.broadcast(gamecode.syncNpcHP, {
            data: data
        })
    }
    playerStructureHitPlayer(idFrom, idTarget, damage) {
        this.players[idTarget].healthPoint -= damage
        if (this.players[idTarget].healthPoint <= 0) {
            this.players[idTarget].isJoinedGame = false
            this.broadcast(gamecode.playerDie, {
                id: idTarget
            })
            if (this.players[idFrom] != null && this.players[idFrom].isJoinedGame) {
                this.players[idFrom].kills++
                this.players[idFrom].scores += 25
                this.players[idFrom].updateStatus()
            }
        } else {
            let data = []
            data.push({
                id: idTarget,
                hp: this.players[idTarget].healthPoint
            })
            this.syncPlayerHealthpoint(data)
        }
    }
    syncPlayerHealthpoint(data) {
        this.broadcast(gamecode.playerHit, {
            data: data
        })
    }
    npcHitStructures(id, idStructure) {
        let structure = this.findStructureWithId(idStructure)
        if (structure == null) {
            return
        }
        if (structure.toString() == "PitTrap") {
            structure.trapNpc(this.npc[id])
            return
        }
        if (structure.toString() == "Spike") {
            this.playerStructureHitNpc(structure.userId, id, structure.damage)
            this.pushNpcBack(this.npc[id], this.npc[id].position.clone().sub(structure.position), 5)
        }
    }
    playerHitStructures(idFrom, idStructure) {
        let structure = this.findStructureWithId(idStructure)
        if (structure == null) {
            return
        }
        if (structure.toString() == "BoostPad") {
            this.pushPlayerBack(this.players[idFrom], structure.direct, structure.force)
            return
        }
        if (structure.toString() == "HealingPad") {
            structure.healPlayer(this.players[idFrom])
            return
        }
        if (structure.userId == idFrom) {
            return
        }
        if (structure.toString() == "Spike") {
            this.playerStructureHitPlayer(idStructure.userId, idFrom, structure.damage)
            this.pushPlayerBack(this.players[idFrom], this.players[idFrom].position.clone().sub(structure.position), 5)
            return
        }
        if (structure.toString() == "PitTrap") {
            structure.trapPlayer(this.players[idFrom])
            return
        }


    }
    playerAttackStructure(idPlayer, idStructure, weapon) {
        let damage = weapon.info.structureDamge
        let structure = this.findStructureWithId(idStructure)
        // console.log("structure: ", structure)
        if (structure == null) {
            return
        }
        if (structure.toString() == "MineStone" || structure.toString() == "Sapling") {
            let key = this.getKeyByValue(ResourceType, structure.idType)
            this.players[idPlayer].receiveResource(weapon.info.gatherRate, key)
            this.players[idPlayer].addXP(weapon.info.goldGatherRate)
        }
        if (idPlayer == structure.userId) {
            return
        }
        structure.takeDamge(damage)
        if (structure.hp <= 0) {
            this.removeStructure(structure.id)
        }
    }
    playerAttackResource(idPlayer, idResource, weapon) {
        let key = this.getKeyByValue(ResourceType, this.resources[idResource].idType)
        if (key == "Gold") {
            this.players[idPlayer].addGold(weapon.info.goldGatherRate)
        } else {
            this.players[idPlayer].receiveResource(weapon.info.gatherRate, key)
        }
        this.players[idPlayer].addXP(weapon.info.goldGatherRate)
    }
    /* #endregion */

    /* #region  STRUCTURE MANAGER */

    findStructureWithId(id) {
        let structure = null
        for (let s of this.structures) {
            if (s.id == id) {
                structure = s
                break
            }
        }
        return structure
    }
    generateStructeId() {
        return this.structuresCount++
    }
    addStructure(user, item) {
        this.structures.push(item)
        user.structures[item.toString()] += 1
        this.broadcast(gamecode.spawnnStructures, {
            id: item.id,
            itemId: item.itemId,
            pos: {
                x: item.position.x,
                y: item.position.y
            },
            rot: item.rotation
        })
    }
    removeStructure(id) {
        for (let i = 0; i < this.structures.length; i++) {
            if (this.structures[i].id == id) {
                this.structures[i].destroy()
                this.structures.splice(i, 1)
                this.broadcast(gamecode.removeStructures, {
                    id: [id],
                })
                return;
            }
        }
    }
    removePlayerStructures(idPlayer) {
        let data = []
        for (let i = 0; i < this.structures.length; i++) {
            if (this.structures[i].userId == idPlayer) {
                this.structures[i].destroy()
                this.structures.splice(i, 1)
                data.push(i)
                i--
            }
        }
        this.broadcast(gamecode.removeStructures, {
            id: data
        })
    }
    /* #endregion */
    /* #region  PROJECTILE */

    getProjectileId() {
        return this.projectileCount++;
    }
    addProjectTile(item, direct) {
        this.projectile.push(item)
        this.broadcast(gamecode.createProjectile, {
            id: item.id,
            pos: {
                x: item.position.x,
                y: item.position.y
            },
            angle: direct
        })
    }
    removeProjectile(id) {
        for (let i = 0; i < i < this.projectile.length; i++) {
            if (this.projectile[i].id == id) {
                this.projectile[i].destroy()
                this.projectile.splice(i, 1)
                this.broadcast(gamecode.removeProjectile, {
                    id: [id]
                })
                return
            }
        }
    }
    updatePositionProjectile(deltaTime) {
        let data = []
        this.projectile.forEach(p => {
            if (p.isDestroy) {
                this.removeProjectile(p.id)
            } else {
                p.updatePosition(deltaTime)
                data.push({
                    id: p.id,
                    pos: {
                        x: p.position.x,
                        y: p.position.y
                    }
                })
            }
        })
        if (data.length != 0) {
            this.broadcast(gamecode.syncPositionProjectile, {
                pos: data
            })
        }
    }
    /* #endregion */
    getRandomPosition() {
        let pos = this.map.randomPosition()
        return new Vector(pos.x, pos.y)
    }
    sendChat(data) {
        this.broadcast(gamecode.playerChat, data)
    }
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
    pushNpcBack(npc, direct, range) {
        npc.position.add(direct.unitVector.scale(range))
        var positionData = []
        positionData.push({
            id: npc.id,
            pos: {
                x: npc.position.x,
                y: npc.position.y
            },
            rot: npc.lookAngle
        })
        this.broadcast(gamecode.syncNpcTransform, {
            pos: positionData
        })
    }
    pushPlayerBack(player, direct, range) {
        player.position.add(direct.unitVector.scale(range))
        var positionData = []
        var lookData = []
        positionData.push({
            id: player.idGame,
            pos: {
                x: player.position.x,
                y: player.position.y
            }
        })
        lookData.push({
            id: player.idGame,
            angle: player.lookDirect
        })
        this.broadcast(gamecode.syncTransform, {
            pos: positionData,
            rot: lookData
        })
    }
    broadcast(event, args) {
        this.players.forEach(p => {
            if (p != null) {
                p.send(event, args)
            }
        })
    }
}

module.exports = Game