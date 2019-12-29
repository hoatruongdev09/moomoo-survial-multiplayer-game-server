const ServerCode = require('../transmitcode').ServerCode
const GameCode = require('../transmitcode').GameCode

const Mathf = require('mathf')
const Vector = require('../GameUtils/vector')
const SAT = require('sat')

const Melee = require('./weapon/melee')
const WeaponInfo = require('./weapon/weaponInfo')
const WeaponType = require('./weapon/weaponType')
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
        this.resourcesView
        this.playersView

        // WEAPONS
        this.mainWeapon = new Melee(0, WeaponInfo[0])
        this.subWeapon = null
        this.onwedItems = []

        this.currentItems = this.mainWeapon

        // HEALTH
        this.healthPoint = 100
        this.kills = 0
        this.scores = 0

    }
    enterGame(data) {
        this.isJoinedGame = true
        this.moveSpeed = data.moveSpeed
        this.position = data.position
        this.lookDirect = data.lookDirect
        this.healthPoint = 100
        this.kills = 0
        this.scores = 0

        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)
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

        this.position.add(this.moveDirect.clone().scale(this.moveSpeed * deltaTime))
        // console.log(this.position)

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
    }
    checkColliderWithResources() {
        this.resourcesView = this.game.getResourceFromView(this.position)
        for (const r of this.resourcesView) {
            this.game.testCollisionCircle2Cirle(this, r, (response, objectCollide) => this.onCollisionWithResource(response, objectCollide))
        }
        // console.log("resource: ", this.resourcesView)
    }
    checkAttackToResource() {
        if (this.resourcesView == null) {
            this.resourcesView = this.game.getResourceFromView(this.position)
        }
        for (const r of this.resourcesView) {
            this.game.testCollisionPoligon2Cirle(this.currentItems, r, (response, objectCollide) => this.onHitResource(response, objectCollide, r))
        }
    }
    onHitResource(response, object, objectInfo) {
        console.log("hit resource: ", objectInfo)
    }
    checkAttackToPlayer() {
        this.playersView = this.game.getPlayersFromView(this.position)
        for (const p of this.playersView) {
            this.game.testCollisionPoligon2Cirle(this.currentItems, p, (response, objectCollide) => this.onHitPlayer(response, objectCollide, p))
        }
    }
    onHitPlayer(response, object, objectInfo) {
        if (objectInfo.id != this.idGame) {
            this.game.playerHitPlayer(this.idGame, objectInfo.id, this.currentItems)
        }
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
        this.socket.on('disconnect', () => {
            this.onDisconnect()
        });
        this.socket.on(ServerCode.OnRequestJoin, (data) => {
            this.OnJoin(data)
        });
        this.socket.on(GameCode.receivedData, (data) => {
            this.OnRecievedGameData(data)
        })
        this.socket.on(GameCode.syncLookDirect, (data) => {
            this.syncLookDirect(data)
        })
        this.socket.on(GameCode.syncMoveDirect, (data) => {
            this.syncMoveDirect(data);
        })
        this.socket.on(GameCode.triggerAttack, () => {
            this.useItem()
        })
    }

    OnJoin(data) {
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
        this.lastMovement = data;
    }
    useItem() {
        if (this.currentItems.toString() == "Melee") {
            this.triggerAttack()
        }
    }
    triggerAttack() {
        if (!this.currentItems.canUse) {
            return
        }
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect))
        this.currentItems.use(this.position, direct)
        this.checkAttackToResource()
        this.checkAttackToPlayer()
        this.game.broadcast(GameCode.triggerAttack, {
            idGame: this.idGame,
            type: this.currentItems.idType
        })
    }

    // Transmit
    send(event, args) {
        this.socket.emit(event, args)
    }
}
module.exports = Player