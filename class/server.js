const io = require('socket.io')
const ws = require('ws')

const Game = require('./game')
const Player = require('./player')
const Time = require('../GameUtils/time')

const ServerCode = require('../transmitcode').ServerCode
const GameCode = require('../transmitcode').GameCode
const gameconfig = require('./gameconfig')

class Server {
    constructor(config) {
        this.config = config
        this.currentPlayerCount = 0;
        this.players
        this.games

        this.time = new Time()
        this.init()
    }

    init() {
        setInterval(() => this.update(), this.config.updateRate)
        this.initializeSocket()
        this.players = new Array(this.config.maxPlayerSupport)
        this.initialzeGames()
    }
    initialzeGames() {
        this.games = new Array(this.config.maxGamesSupport)
        this.createGame(gameconfig, "GAME 1")
    }
    initializeSocket() {
        let wss = new ws.Server({
            port: 5050
        });
        wss.on('connection', ws => {
            let id = ws.protocol.replace(/[^0-9A-Za-z_\-]/g, '');
            for (let i of this.players) {
                if (i && i.socket && i.socket.id == id) {
                    this.handleEval(i, ws);
                    break;
                }
            }
            console.log("connection");
        });
        this.evalWss = wss;

        let port = process.env.PORT || 8080
        console.log("game running on port: ", port);
        io(port).on("connection", socket => {
            console.log("an io connection")
            this.handleSocket(socket)

        })
    }
    handleSocket(socket) {
        let slot = this.findEmptyPlayersSlot()
        if (slot != null) {
            let player = new Player(slot, this, socket)
            this.players[slot] = player
            this.currentPlayerCount++;
        } else {
            socket.emit(ServerCode.OnFailedToConnect, {
                reason: "Server is full"
            })
        }

    }
    handleEval(player, web) {
        console.log("WTF")
        player.remote = web;
    }
    // PLAYER
    findEmptyPlayersSlot() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                console.log(`return slot ${i}`)
                return i;
            }
        }
        return null
    }
    removePlayer(player) {
        // console.log("WTF", player) 
        this.players[player.idServer] = null
        this.currentPlayerCount--
    }
    // GAME
    findEmptyGameSlot() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.games[i] == null) {
                return i;
            }
        }
        return null
    }
    createGame(gameconfig, name) {
        let slot = this.findEmptyGameSlot()
        if (slot != null) {
            let game = new Game(slot, this, gameconfig, name)
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