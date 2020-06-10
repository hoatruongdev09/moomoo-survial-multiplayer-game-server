const TransmitCode = require('../../transmitcode')

const BaseState = require('./baseUserState')

class InitState extends BaseState {
    constructor(user, stateManager) {
        super(user, stateManager)
        this.socket = null
    }
    enter(options) {
        this.socket = options.socket
        this.user.id = this.socket.id
        this.handleSocket(this.socket)
        this.user.enterMenu()
    }
    exit(options) {

    }

    handleSocket(socket) {
        this.sendConnectInfo()
    }
    sendConnectInfo() {
        let data = {
            serverIndex: this.user.serverIndex,
            id: this.user.id,
            listGame: this.user.server.listGame()
        }
        this.user.send(TransmitCode.ServerCode.OnConnect, data)
    }
}

module.exports = InitState