const NpcState = require('./npcState')
const Mathf = require('../../../GameUtils/mathfPlus')

class HuntState extends NpcState {
    constructor(npc, stateManager) {
        super(npc, stateManager)

        this.target = null

        this.destinePosition = null
        this.moveDirect = null
        this.huntSpeed = 3
        this.huntRotateSpeed = 0.6
        this.attackRange = 16
        this.attackDamage = 10
        this.escapeRange = 100

        this.checkTargetEscapeInterval = null
        this.huntTimeOut = null
    }
    enter() {
        if (this.target == null || !this.target.isJoinedGame) {
            this.stateManager.changeState(this.npc.standState)
            return
        }
        this.npc.speed = this.npc.baseSpeed + this.huntSpeed
        this.npc.rotateSpeed = this.npc.baseRotateSpeed + this.huntRotateSpeed
        this.watchTarget()
        this.rest()
    }
    update(deltaTime) {
        this.followTarget()
        if (!this.npc.isTrapped) {
            this.npc.translate(this.moveDirect, deltaTime)
            this.checkRangeToAttack()
        }
    }
    exit() {
        this.npc.speed = this.npc.baseSpeed
        this.npc.rotateSpeed = this.npc.baseRotateSpeed
        if (this.checkTargetEscapeInterval != null) {
            clearInterval(this.checkTargetEscapeInterval)
        }
        if (this.huntTimeOut != null) {
            clearTimeout(this.huntTimeOut)
        }
        console.log("exit hunt state")
    }
    followTarget() {
        if (this.target == null || !this.target.isJoinedGame) {
            return
        }
        this.destinePosition = this.target.position
        this.moveDirect = this.destinePosition.clone().sub(this.npc.position)
    }
    checkRangeToAttack() {
        if (this.moveDirect.sqrMagnitude() < this.attackRange) {
            this.makeAttack()
        }
    }
    makeAttack() {
        this.npc.game.npcHitPlayer(this.npc.id, this.target.idGame, this.attackDamage)
        this.npc.game.pushPlayerBack(this.target, this.target.position.clone().sub(this.npc.position), 5)
    }
    watchTargetStatus() {
        // console.log(this.target)
        if (this.target == null || !this.target.isJoinedGame) {
            this.stateManager.changeState(this.npc.standState)
            return
        }
        if (this.moveDirect.sqrMagnitude() >= this.escapeRange) {
            this.stateManager.changeState(this.npc.standState)
            return
        }
    }
    watchTarget() {
        let watchTime = 1 * 1000
        this.checkTargetEscapeInterval = setInterval(() => {
            this.watchTargetStatus()
        }, watchTime)
    }
    rest() {
        let huntTime = Mathf.RandomeRangeFloat(15, 30) * 1000
        this.huntTimeOut = setTimeout(() => {
            this.stateManager.changeState(this.npc.standState)
        }, huntTime)
    }

}
module.exports = HuntState