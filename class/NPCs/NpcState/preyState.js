const NpcState = require('./npcState')
const Mathf = require('../../../GameUtils/mathfPlus')

class PreyState extends NpcState {
    constructor(npc, stateManager) {
        super(npc, stateManager)

        this.preyInterval = null
        this.preyTimeOut = null
    }
    enter() {
        this.startFindTarget()
        this.stopPreying()
    }
    exit() {
        if (this.preyInterval != null) {
            clearInterval(this.preyInterval)
        }
        if (this.preyTimeOut != null) {
            clearTimeout(this.preyTimeOut)
        }
    }
    findTarget() {
        let playerInView = this.npc.getPlayersInView()
        if (playerInView.length != 0) {
            let target = playerInView[Mathf.RandomRange(0, playerInView.length)]
            if (this.npc.game.getPlayerInfo(target.idGame).bullIgnored && this.npc.tag == "bully") {
                return
            }
            this.npc.huntState.target = target
            this.stateManager.changeState(this.npc.huntState)
        }
    }
    startFindTarget() {
        let refreshTime = 1000
        this.preyInterval = setInterval(() => {
            this.findTarget()
        }, refreshTime)
    }
    stopPreying() {
        let preyTime = Mathf.RandomRange(5, 10) * 1000
        this.preyTimeOut = setTimeout(() => {
            this.stateManager.changeState(this.npc.walkState)
        }, preyTime)
    }
}
module.exports = PreyState