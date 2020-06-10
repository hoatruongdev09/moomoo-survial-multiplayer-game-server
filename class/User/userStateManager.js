class UserStateManager {
    constructor() {
        this.lastState = null
        this.currentState = null
    }
    start(initState, initOptions) {
        this.currentState = initState
        this.currentState.enter(initOptions)
    }
    changeState(nextState, enterOptions, exitOptions) {
        this.currentState.exit(exitOptions)
        this.lastState = this.currentState
        this.currentState = nextState
        this.currentState.enter(enterOptions)
    }
}

module.exports = UserStateManager