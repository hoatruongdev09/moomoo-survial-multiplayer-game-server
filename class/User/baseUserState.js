class BaseUserState {
    constructor(user, stateManager) {
        this.user = user
        this.stateManager = stateManager
    }

    enter(options) {

    }
    update(deltaTime, options) {

    }
    exit(options) {

    }
    movePlayer(direct, deltaTime) {

    }
    addXP(value) {

    }
    onDisconnected() {

    }
    updateStatus() {

    }
}

module.exports = BaseUserState