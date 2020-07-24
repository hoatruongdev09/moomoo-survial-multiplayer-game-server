let io = require('socket.io')

const Game = require('./game')
const User = require('./User/user')
const Time = require('../GameUtils/time')

const ServerCode = require('../transmitcode').ServerCode
const gameConfig = require('./gameconfig')



class Server {
    constructor(config, expressServer) {
        this.config = config
        this.currentPlayerCount = 0;
        this.users
        this.games
        this.expressServer = expressServer
        this.time = new Time()
        this.init()

    }

    init() {
        setInterval(() => this.update(), this.config.updateRate)
        this.initializeSocket()
        this.users = new Array(this.config.maxPlayerSupport)
        this.initializeGames()
    }
    initializeGames() {
        this.games = new Array(this.config.maxGamesSupport)
        this.createGame(gameConfig, "GAME 1")
    }
    initializeSocket() {
        if (this.expressServer != null) {
            io = require('socket.io')(this.expressServer)
        } else {
            let port = process.env.PORT || 8080
            console.log("game running on port: ", port);
            io = io(port)
        }
        io.on("connection", socket => {
            console.log("an io connection")
            this.new_handleSocket(socket)

        })
    }
    // handleWebSocket(ws) {
    //     let slot = this.findEmptyGameSlot()
    //     if (slot != null) {
    //         let player = new Player(slot, this, ws, true)
    //         this.users[slot] = player
    //         this.currentPlayerCount++;
    //     } else {
    //         console.log("server is null")
    //         ws.emit(ServerCode.Error, {
    //             reason: "Server is full"
    //         })
    //     }
    // }
    new_handleSocket(socket) {
        let slot = this.findEmptyPlayersSlot()
        if (slot != null) {
            let user = new User(this, socket, slot)
            this.users[slot] = user
            this.currentPlayerCount++;
        } else {
            console.log("server is full")
            socket.emit(ServerCode.Error, {
                reason: "Server is full"
            })
        }
    }

    // handleSocket(socket) {
    //     let slot = this.findEmptyPlayersSlot()
    //     if (slot != null) {
    //         let player = new Player(slot, this, socket)
    //         this.users[slot] = player
    //         this.currentPlayerCount++;
    //     } else {
    //         console.log("server is full")
    //         socket.emit(ServerCode.OnFailedToConnect, {
    //             reason: "Server is full"
    //         })
    //     }

    // }
    handleEval(player, web) {
        console.log("handle eval")
        player.remote = web;
    }
    // PLAYER
    findEmptyPlayersSlot() {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] == null) {
                console.log(`return slot ${i}`)
                return i;
            }
        }
        return null
    }
    removePlayer(user) {
        console.log("removed player: ", user.serverIndex, " ", user.idGame)
        this.users[user.serverIndex] = null
        this.currentPlayerCount--
    }
    old_removePlayer(player) {
        console.log("removed player: ", player.idServer, " ", player.idGame)
        this.users[player.idServer] = null
        this.currentPlayerCount--
    }
    // GAME
    findEmptyGameSlot() {
        for (let i = 0; i < this.users.length; i++) {
            if (this.games[i] == null) {
                return i;
            }
        }
        return null
    }
    createGame(gameConfig, name) {
        let slot = this.findEmptyGameSlot()
        if (slot != null) {
            let game = new Game(slot, this, gameConfig, name)
            this.games[slot] = game
        }
    }
    listGame() {
        let list = []
        this.games.forEach(p => {
            list.push({
                id: p.id,
                name: p.name,
                full: p.isFull()
            })
        })
        return list
    }
    new_playerJoinGame(player, gameId) {
        if (player.isJoinedGame) {
            return
        }
        if (player.game == null) {
            let game = this.games[gameId]
            let joinCheck = game.new_canJoin()
            if (joinCheck.result) {
                game.new_addPlayer(player)
            } else {
                player.send(ServerCode.Error, {
                    reason: "Game is full"
                })
            }
        } else {
            player.game.new_playerJoin(player)
        }
    }
    playerJoinGame(player, data) {
        if (player.isJoinedGame) {
            return
        }
        if (player.game == null) {
            let game = this.games[data.gameId]
            let joinCheck = game.canJoin(data)
            if (joinCheck.result) {
                game.addPlayer(player, data)
            } else {

            }
        } else {
            player.game.playerJoin(player)
        }
    }
    //
    update() {
        this.time.update()
        this.games.forEach((p) => {
            p.update(this.time.deltaTime)
        })
    }
}

module.exports = Server