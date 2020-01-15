const SAT = require('sat')
const Vector = require('../../GameUtils/vector')
const Mathf = require('mathf')

class NPC {
    constructor(id, skinId, isHostitle, position, game, size) {
        this.id = id
        this.skinId = skinId
        this.size = size
        this.position = position
        this.game = game


        this.normalMoveSpeed = 7
        this.moveSpeed = this.normalMoveSpeed
        this.rotateSpeed = 0.7
        this.inviromentSpeedModifier = 1


        this.lastMoveDirect
        this.moveDirect = Vector.zero()
        this.lookAngle

        this.healthPoint = 100

        this.isHostitle = isHostitle
        this.isResting = true
        this.targetPosition = this.position.clone()
        this.isTiming = false
        this.isRunaway = false

        this.bodyCollider
        this.initCollider()

        this.isTrapped = false
        this.isJoined = true

        this.resourcesView = []
        this.structureView = []
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(this.position, this.size)
        // this.bodyCollider.setOffset(new SAT.Vector(this.size.x / 2, this.size.y / 2))
    }
    update(deltaTime) {
        this.logic(deltaTime)
        this.updatePosition(deltaTime)
    }
    logic(deltaTime) {
        if (this.isTrapped) {
            return
        }
        if (this.isHostitle) {

        } else {
            if (this.isResting) { // RESTING
                if (this.isTiming) {
                    return
                }
                // console.log("npc resting")
                this.lastMoveDirect = null
                this.isTiming = true
                setTimeout(() => {
                    this.isResting = false
                    this.setTarget(this.getRandomPosition())
                    this.setMove(this.targetPosition)
                    this.isTiming = false
                }, Mathf.RandomeRange(15, 20) * 1000) // REST TIME
            } else { // ACTIVE
                // console.log("npc move: ", this.position, ", lastMoveDirect: ", this.lastMoveDirect, ", move direct: ", this.moveDirect)
                if (this.position.clone().sub(this.targetPosition).sqrMagnitude() <= 1) {
                    this.setTarget(this.getRandomPosition())
                }
                if (this.isTiming) {
                    return
                }
                this.isTiming = true
                setTimeout(() => {
                    this.isResting = true
                    this.isTiming = false
                }, Mathf.RandomeRange(10, 12) * 1000) // ATIVE TIME
            }

        }
    }
    onHit() {
        if (!this.isHostitle) {
            this.setTarget(this.getRandomPosition())
            this.setMove(this.targetPosition)
            this.isResting = false
            if (!this.isRunaway) {
                this.isRunaway = true
                this.moveSpeed = this.normalMoveSpeed * 2
                setTimeout(() => {
                    this.isRunaway = false
                }, Mathf.RandomeRange(5, 7) * 1000)
            }
        }
    }
    updatePosition(deltaTime) {
        if (this.isTrapped) {
            return
        }
        if (this.lastMoveDirect == null) {
            return
        }
        this.moveDirect.x = Mathf.lerp(this.moveDirect.x, this.lastMoveDirect.x, this.rotateSpeed * deltaTime);
        this.moveDirect.y = Mathf.lerp(this.moveDirect.y, this.lastMoveDirect.y, this.rotateSpeed * deltaTime);

        this.position.add(this.moveDirect.unitVector.scale(this.moveSpeed * this.inviromentSpeedModifier * deltaTime))

        this.lookAngle = Math.atan2(this.moveDirect.y, this.moveDirect.x)

        this.bodyCollider.pos.x = this.position.x
        this.bodyCollider.pos.y = this.position.y
        // this.bodyCollider.setAngle(this.lookAngle)


        this.checkCollider()
    }
    checkCollider() {
        this.checkColliderWithResources()
        this.checkColliderWithStrucures()
    }
    checkColliderWithResources() {
        this.resourcesView = this.game.getResourceFromView(this.position)
        for (const r of this.resourcesView) {
            this.game.testCollisionCircle2Cirle(this, r, (res, obj) => this.onCollisionWithResource(res, obj))
        }
    }
    checkColliderWithStrucures() {
        this.structureView = this.game.getStructureFromView(this.position)
        // console.log("structure: ", this.structureView)
        for (const r of this.structureView) {
            this.game.testCollisionCircle2Cirle(this, r, (res, obj) => this.onCollisionWithStructure(res, obj, r))
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
    setTarget(target) {
        this.targetPosition = target
    }
    setMove(target) {
        if (target == null) {
            this.lastMoveDirect = null
            return
        }
        this.lastMoveDirect = target.clone().sub(this.position)
        // console.log("go to target: ", target, ", this position: ", this.position)
    }
    getRandomPosition() {
        return this.game.getRandomPosition();

    }

}
module.exports = NPC