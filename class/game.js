const servercode = require('../transmitcode').ServerCode
const gamecode = require('../transmitcode').GameCode
const Map = require('./map')
const Resource = require('./resource').Resource
const ResourceType = require('./resource').ResourceType

const PhysicEngine = require('./physicEngine')

const Mathf = require('mathf')
const Vector = require('../GameUtils/vector')

class Game {
    constructor(id, server, gameConfig, name) {
        this.name = name
        this.id = id
        this.server = server
        this.gameConfig = gameConfig

        this.players
        this.currentPlayerCount = 0

        this.resources
        this.userResources = []

        this.map = new Map(this.gameConfig.mapsize, {
            x: 2,
            y: 2
        })

        this.physic = new PhysicEngine()
        this.init()
    }
    init() {
        this.players = new Array(this.gameConfig.maxPlayer)
        this.initializeResources()
    }
    initializeResources() {
        this.resources = new Array(this.gameConfig.resourceCount())
        this.initializeResource(0, this.gameConfig.woodCount, ResourceType.Wood)
        this.initializeResource(10, this.gameConfig.foodCount, ResourceType.Food)
        this.initializeResource(20, this.gameConfig.rockCount, ResourceType.Rock)
        this.initializeResource(30, this.gameConfig.goldCount, ResourceType.Gold)
    }
    initializeResource(startId, count, type) {
        for (let i = startId; i < startId + count; i++) {
            let rs = new Resource(i, type, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius)
            this.resources[i] = rs
        }
    }

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
            player.skinId = data.skinId
            player.send(gamecode.gameData, this.getCurrentGameData())
        } else {
            console.log("game slot is null")
        }
    }
    getCurrentGameData() {
        let gameData = {
            maxPlayer: this.gameConfig.maxPlayer,
            resource: this.getResourceInfo(),
            players: this.getPlayersInfo(),
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
    playerJoin(player) {
        let tempPosition = this.map.randomPosition()
        player.enterGame({
            moveSpeed: this.gameConfig.playerSpeed,
            position: new Vector(tempPosition.x, tempPosition.y),
            lookDirect: this.map.rangdomAngle(),
            bodyRadius: this.gameConfig.playColliderRadius
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

    update(deltaTime) {
        this.updatePlayers(deltaTime)
        this.syncPlayerPosition()
    }
    updatePlayers(deltaTime) {
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                p.update(deltaTime)
            }
        })
    }
    syncPlayerPosition() {
        var positionData = []
        var lookData = []

        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                if (p.lastMovement != null) {
                    positionData.push({
                        id: p.idGame,
                        pos: {
                            x: p.position.x,
                            y: p.position.y
                        }
                    })
                }
                if (p.lastLook != null) {
                    lookData.push({
                        id: p.idGame,
                        angle: p.lookDirect
                    })
                }
            }
        })
        this.broadcast(gamecode.syncTransform, {
            pos: positionData,
            rot: lookData
        })
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
    testCollisionCircle2Cirle(object1, object2, response) {
        return this.physic.testCircle2Cirle(object1.bodyCollider, object2.bodyCollider, response)
    }
    testCollisionPoligon2Cirle(poliObj, circleObj, response) {
        return this.physic.testPoligon2Cirle(poliObj.bodyCollider, circleObj.bodyCollider, response)
    }

    playerHitPlayer(idFrom, idTarget, weapon) {
        this.players[idTarget].healthPoint -= weapon.info.damage
        if (this.players[idTarget].healthPoint <= 0) {
            this.players[idTarget].isJoinedGame = false
            this.players[idFrom].kills++
            this.players[idFrom].scores += 25 // example bonus
            this.broadcast(gamecode.playerDie, {
                id: idTarget
            })
            this.players[idFrom].send(gamecode.playerStatus, {
                score: this.players[idFrom].scores,
                kills: this.players[idFrom].kills
            })
        } else {
            this.broadcast(gamecode.playerHit, {
                id: idTarget,
                hp: this.players[idTarget].healthPoint
            })
        }
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