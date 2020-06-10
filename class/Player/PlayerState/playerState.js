class PlayerState {
    constructor(player, stateManager) {
        this.player = player
        this.stateManager = stateManager
        this.socket = this.player.socket
    }

    enter() {

    }
    update(deltaTime) {

    }
    exit() {

    }


    movePlayer(direct, deltaTime) {

    }
}
module.exports = PlayerState