const SAT = require('sat')
const Vector = require('../../GameUtils/vector')
const Mathf = require('../../GameUtils/mathfPlus')
const StateManager = require('./NpcState/npcStateManager')

const StandState = require('./NpcState/standState')
const WalkState = require('./NpcState/walkState')
const EscapeState = require('./NpcState/escapeState')
const HuntState = require('./NpcState/huntState')
const PreyState = require('./NpcState/preyState')

class NPC {
    constructor(id, skinId, isHostile, maxHp, position, game, size, tag) {
        this.id = id
        this.skinId = skinId
        this.isHostile = isHostile
        this.maxHp = maxHp
        this.game = game
        this.tag = tag

        this.healthPoint = maxHp

        this.baseSpeed = 6
        this.baseRotateSpeed = 1.2
        this.environmentSpeedModifier = 1

        this.speed = this.baseSpeed
        this.rotateSpeed = this.baseRotateSpeed

        this.position = position
        this.size = size

        this.moveDirect = Vector.zero()
        this.lookAngle

        this.bodyCollider = null
        this.initCollider()

        this.isJoined = true
        this.isTrapped = false

        this.stateManager = new StateManager()

        this.standState = new StandState(this, this.stateManager)
        this.walkState = new WalkState(this, this.stateManager)
        this.escapeState = new EscapeState(this, this.stateManager)
        this.huntState = new HuntState(this, this.stateManager)
        this.preyState = new PreyState(this, this.stateManager)
        this.stateManager.start(this.standState)
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(this.position, this.size)
    }
    reset() {
        this.healthPoint = this.maxHp
    }
    update(deltaTime) {
        if (this.isJoined && !this.isTrapped) {
            this.stateManager.currentState.update(deltaTime)
        }
    }
    onBeingHit(fromTarget, damage, dieCallback) {
        this.healthPoint -= damage
        if (this.healthPoint <= 0) {
            dieCallback(fromTarget, this)
        }
        this.onHit(fromTarget)
    }
    onHit(fromTarget) {
        this.game.onNpcHit(this)
        this.stateManager.currentState.onHit(fromTarget)
    }
    translate(direct, deltaTime) {
        this.moveDirect.x = Mathf.lerp(this.moveDirect.x, direct.unitVector.x, this.rotateSpeed * deltaTime)
        this.moveDirect.y = Mathf.lerp(this.moveDirect.y, direct.unitVector.y, this.rotateSpeed * deltaTime)

        this.position.add(this.moveDirect.unitVector.scale(this.speed * this.environmentSpeedModifier * deltaTime))

        this.lookAngle = Math.atan2(this.moveDirect.y, this.moveDirect.x)


        this.updateCollider()
    }
    updateCollider() {
        this.bodyCollider.pos.x = this.position.x
        this.bodyCollider.pos.y = this.position.y

        this.checkCollider()
    }
    checkCollider() {
        this.checkColliderWithResources()
        this.checkColliderWithStrucures()
    }
    checkColliderWithResources() {
        let resourcesView = this.game.getResourceFromView(this.position)
        for (const r of resourcesView) {
            this.game.testCollisionCircle2Circle(this, r, (res, obj) => this.onCollisionWithResource(res, obj))
        }
    }
    checkColliderWithStrucures() {
        let structureView = this.game.getStructureFromView(this.position)
        // console.log("structure: ", this.structureView)
        for (const r of structureView) {
            this.game.testCollisionCircle2Circle(this, r, (res, obj) => this.onCollisionWithStructure(res, obj, r))
        }
    }
    onCollisionWithStructure(response, object, objInfo) {
        if (["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"].includes(objInfo.type)) {
            // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
            let overlapPos = response.overlapV
            this.position.x -= overlapPos.x
            this.position.y -= overlapPos.y
        }
        this.game.npcHitStructures(this.id, objInfo.id)
    }
    onCollisionWithResource(response, object) {
        let overlapPos = response.overlapV
        this.position.x -= overlapPos.x
        this.position.y -= overlapPos.y
    }
    getRandomPosition() {
        return this.game.getRandomPosition();
    }
    moveNpc(direct, deltaTime) {
        if (this.isTrapped) {
            return
        }
        this.position.add(direct.unitVector.scale(this.speed * this.environmentSpeedModifier * deltaTime))
        this.updateCollider()

    }
    getHpPercent() {
        return this.healthPoint / this.maxHp
    }
    getPlayersInView() {
        return this.game.getPlayerFromScreenView(this.position, {
            width: 25,
            height: 15
        })
    }
}
module.exports = NPC