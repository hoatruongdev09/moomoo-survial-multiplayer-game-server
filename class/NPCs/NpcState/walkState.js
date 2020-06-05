const NpcState = require('./npcState')
const Mathf = require('../../../GameUtils/mathfPlus')

class WalkState extends NpcState {
    constructor(npc, stateManager) {
        super(npc, stateManager)
        this.speed = this.npc.baseSpeed
        this.rotateSpeed = this.npc.baseRotateSpeed

        this.destinePosition = null
        this.moveDirect = null

        this.walkTimeOut = null
    }
    enter() {
        this.destinePosition = this.npc.getRandomPosition()
        this.moveDirect = this.destinePosition.clone().sub(this.npc.position)

        this.walk()
    }
    update(deltaTime) {
        if (!this.npc.isTrapped) {
            this.npc.translate(this.moveDirect, deltaTime)
        }
    }
    exit() {
        if (this.walkTimeOut != null) {
            clearTimeout(this.walkTimeOut)
        }
    }
    onHit(fromTarget) {
        if (this.npc.isHostile) {
            this.npc.huntState.target = fromTarget
            this.stateManager.changeState(this.npc.huntState)
        } else {
            this.npc.escapeState.target = fromTarget
            this.stateManager.changeState(this.npc.escapeState)
        }
    }

    walk() {
        let walkTime = Mathf.RandomeRangeFloat(5, 10) * 1000
        this.walkTimeOut = setTimeout(() => {
            this.stateManager.changeState(this.npc.standState)
        }, walkTime)
    }

}

module.exports = WalkState