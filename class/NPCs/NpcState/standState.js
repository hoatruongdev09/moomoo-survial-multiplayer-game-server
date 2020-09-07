const NpcState = require('./npcState')
const Mathf = require('../../../GameUtils/mathfPlus')

class NpcStandState extends NpcState {

    constructor(npc, stateManager) {
        super(npc, stateManager)
        this.restTimeOut = null
    }
    enter() {
        this.rest()
    }
    exit() {
        if (this.restTimeOut != null) {
            clearTimeout(this.restTimeOut)
        }
    }
    onHit(fromTarget) {
        if (this.npc.isHostile) {
            this.npc.huntState.target = fromTarget
            this.stateManager.changeState(this.npc.huntState, { target: fromTarget })
        } else {
            this.npc.escapeState.target = fromTarget
            this.stateManager.changeState(this.npc.escapeState)
        }
    }

    rest() {
        let restTime = Mathf.RandomRange(5, 10) * 1000
        this.restTimeOut = setTimeout(() => {
            if (this.npc.isHostile) {
                if (Mathf.RandomRange(0, 4) < 1) {
                    this.stateManager.changeState(this.npc.preyState)
                    return
                }

            }
            this.stateManager.changeState(this.npc.walkState)
        }, restTime)
    }
}

module.exports = NpcStandState