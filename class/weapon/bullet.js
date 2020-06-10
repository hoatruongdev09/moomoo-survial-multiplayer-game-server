const SAT = require('sat')

class Bullet {
    constructor(id, idSkin, user, moveDirect, startPosition, size, moveSpeed, range, damage) {
        this.id = id
        this.user = user
        this.startPosition = startPosition
        this.position = startPosition.clone()
        this.direct = moveDirect
        this.damage = damage
        this.moveSpeed = moveSpeed
        this.range = range
        this.idSkin = idSkin
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), size)
        this.isDestroy = false
        this.resourcesView = []
        this.playerView = []
        this.structureView = []
        this.npcView = []
    }
    updatePosition(deltaTime) {
        this.position.add(this.direct.clone().scale(this.moveSpeed * deltaTime))
        this.bodyCollider.pos.x = this.position.x
        this.bodyCollider.pos.y = this.position.y
        if (this.position.clone().sub(this.startPosition).sqrMagnitude() >= Math.pow(this.range, 2)) {
            this.isDestroy = true
        }
        this.checkCollider()
    }
    checkCollider() {
        this.checkColliderWithPlayer()
        this.checkColliderWithStructure()
        this.checkColliderWithResources()
        this.checkColliderWithNpc()
    }
    checkColliderWithNpc() {
        this.npcView = this.user.game.getNpcFromView(this.position)
        for (const n of this.npcView) {
            this.user.game.testCollisionCircle2Cirle(this, n, (response, objectCollider) => this.onHitNpc(response, objectCollider, n))
        }
    }
    checkColliderWithResources() {
        this.resourcesView = this.user.game.getResourceFromView(this.position)
        for (const r of this.resourcesView) {
            this.user.game.testCollisionCircle2Cirle(this, r, (response, objectCollider) => {
                this.isDestroy = true
            })
        }
    }
    checkColliderWithStructure() {
        this.structureView = this.user.game.getStructureFromView(this.position)
        for (const s of this.structureView) {
            this.user.game.testCollisionCircle2Cirle(this, s, (response, objectCollider) => {
                this.isDestroy = true
            })
        }
    }
    checkColliderWithPlayer() {
        this.playerView = this.user.game.getPlayersFromView(this.position)
        for (const p of this.playerView) {
            this.user.game.testCollisionCircle2Cirle(this, p, (response, objectCollider) => this.onHitPlayer(response, objectCollider, p))
        }
    }
    onHitNpc(response, object, objectInfo) {
        this.user.game.playerHitNpc(this.user.idGame, objectInfo.id, this.damage)
        this.isDestroy = true
    }
    onHitPlayer(response, object, objectInfo) {
        this.user.game.playerHitPlayer(this.user.idGame, objectInfo.id, this.damage)
        this.isDestroy = true
    }
    destroy() {

    }
}

module.exports = Bullet