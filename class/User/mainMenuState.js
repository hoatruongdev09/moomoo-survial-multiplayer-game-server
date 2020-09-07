const TransmitCode = require('../../transmitcode')

const BaseState = require('./baseUserState')

class MenuState extends BaseState {
    constructor(user, stateManager) {
        super(user, stateManager)

        this.socket = null
        this.server = null
        this.game = null
    }
    enter(options) {
        this.socket = options.socket
        this.user = options.user
        this.server = this.user.server
        this.game = this.user.game
        this.registerEvent()
        console.log("enter menu state")
    }
    exit(options) {
        this.removeEvent()
        console.log("exit menu state")
    }
    registerEvent() {
        this.socket.on(TransmitCode.ServerCode.OnRequestJoin, (data) => this.onJoin(data))
        this.socket.on(TransmitCode.GameCode.receivedData, (data) => this.onReceivedGameData(data))
    }
    removeEvent() {
        this.socket.removeAllListeners(TransmitCode.ServerCode.OnRequestJoin)
        this.socket.removeAllListeners(TransmitCode.GameCode.receivedData)
    }
    /* #region  EVENTS */
    onJoin(data) {
        console.log("join game: ", data, ` time: ${new Date()}`)
        this.user.skinId = data.skinId
        this.user.name = data.name
        this.user.clientScreenSize.width = data.screenSizeX
        this.user.clientScreenSize.height = data.screenSizeY
        this.server.new_playerJoinGame(this.user, data.gameId)
    }
    onReceivedGameData(data) {
        this.user.game.new_playerJoin(this.user)
    }


    /* #endregion */
}
module.exports = MenuState