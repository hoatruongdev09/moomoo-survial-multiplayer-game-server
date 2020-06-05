const NpcState = require('./npcState')
const Mathf = require('../../../GameUtils/mathfPlus')

class EscapeState extends NpcState {
    constructor(npc, stateManager) {
        super(npc, stateManager)

        this.target = null

        this.destinePosition = null
        this.moveDirect = null
        this.fleeSpeed = 2

        this.checkSafeStateInterval = null
    }

    enter() {
        if (this.target == null || !this.target.isJoinedGame) {
            this.stateManager.changeState(this.npc.standState)
            return
        }

        this.npc.speed = this.npc.baseSpeed + this.fleeSpeed
        this.findHidingPlace()
        this.checkSafeArea()
    }

    update(deltaTime) {
        this.npc.translate(this.moveDirect, deltaTime)
    }

    onHit(fromTarget) {
        this.target = fromTarget
        this.findHidingPlace()
    }
    exit() {
        this.target = null
        this.npc.speed = this.npc.baseSpeed
        if (this.checkSafeStateInterval != null) {
            clearInterval(this.checkSafeStateInterval)
        }
    }
    checkSafeArea() {
        let intervalTime = 3 * 1000
        this.checkSafeStateInterval = setInterval(() => {
            this.checkDistanceTarget()
        }, intervalTime)
    }
    findHidingPlace() {
        this.destinePosition = this.npc.getRandomPosition()
        this.moveDirect = this.destinePosition.clone().sub(this.npc.position)
    }
    checkDistanceTarget() {
        let safeSqrDistance = 100
        if (this.target == null || !this.target.isJoinedGame) {
            this.stateManager.changeState(this.npc.standState)
            return
        }
        let distanceFromTarget = this.npc.position.clone().sub(this.target.position).sqrMagnitude()
        if (safeSqrDistance > distanceFromTarget) { // danger
            this.findHidingPlace()
        } else { // safe 
            if (this.target == null) {
                this.stateManager.changeState(this.npc.standState)
                return
            }
        }
    }

}
module.exports = EscapeState