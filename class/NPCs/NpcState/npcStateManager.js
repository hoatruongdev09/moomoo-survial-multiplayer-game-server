class NpcStateManager {
    constructor() {
        this.currentState = null
        this.lastState = null
    }
    start(initState) {
        this.currentState = initState
        this.currentState.enter()
    }
    changeState(nextState, enterOption) {
        this.lastState = this.currentState
        this.currentState.exit();
        this.currentState = nextState
        this.currentState.enter(enterOption)
    }
    changeState(nextState) {
        this.lastState = this.currentState
        this.currentState.exit()
        this.currentState = nextState
        this.currentState.enter()
    }
}
module.exports = NpcStateManager