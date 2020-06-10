const TransmitCode = require('../../../transmitcode')
const ServerCode = TransmitCode.ServerCode
const GameCode = TransmitCode.GameCode

const PlayerState = require('./playerState.js')

class MenuState extends PlayerState {
    constructor(player, stateManager) {
        super(player, stateManager)
    }
    enter() {
        this.sendServerInfo()
        this.registerEvents()
    }
    update(deltaTime) {

    }
    exit() {
        this.removeEvents()
    }

    registerEvents() {
        this.socket.on(ServerCode.OnRequestJoin, (data) => this.onJoinGame(data))
        this.socket.on(GameCode.receivedData, (data) => this.onReceiveGameData(data))
    }
    removeEvents() {
        this.socket.removeListener(ServerCode.OnRequestJoin, this.onJoinGame)
        this.socket.removeListener(GameCode.receivedData, this.onReceiveGameData)
    }
    sendServerInfo() {
        this.player.send(ServerCode.OnConnect, {
            id: this.player.idServer,
            listGame: this.player.server.listGame()
        })
    }
    onJoinGame(data) {
        this.player.skinId = data.skinId;
        this.player.clientScreenSize.width = data.screenSizeX
        this.player.clientScreenSize.height = data.screenSizeY
        this.player.server.playerJoinGame(this.player, data);
    }
    onReceiveGameData(data) {
        this.player.game.playerJoin(this.player)
    }
}
module.exports = MenuState