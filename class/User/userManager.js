class UserManager {
    constructor(game, playerCount, config) {
        this.game = game
        this.playerCount = playerCount
        this.currentPlayerCount = 0
        this.players = new Array(this.playerCount)
        this.config = config
    }
    update(deltaTime) {
        this.players.forEach(p => {
            p.update(deltaTime)

        })
    }
    getPlayingPlayers() {
        return this.players.filter(player => {
            if (player != null && player.isJoinedGame) {
                return player
            }
        })
    }
    getEmptySlots() {
        return this.players.filter((player, index, obj) => {
            if (player == null) {
                return index
            }
        })
    }
    findEmptySlot() {
        let emptySlot = this.getEmptySlots()
        if (emptySlot.length == 0) {
            return null
        }
        return emptySlot[0]
    }
    getPlayersScore() {
        let inGamePlayer = this.getPlayingPlayers()
        return inGamePlayer.map(player => {
            return {
                id: player.idGame,
                name: player.name,
                skinId: player.skinId,
                score: player.scores
            }
        })
    }
    isFull() {
        return this.currentPlayerCount >= this.playerCount
    }
    canJoin() {
        if (this.isFull()) {
            return { result: false, reason: "Game is full" }
        }
        return { result: true, reason: "" }
    }
    addPlayer(player, callback) {
        let slot = this.findEmptySlot()
        if (slot == null) {
            console.log("game slot is null")
        }
        this.players[slot] = player
        this.currentPlayerCount++
        callback()
    }
    removePlayer(player, callback) {
        this.players[player.idGame] = null
        this.currentPlayerCount--
        callback()
    }
    getOtherPlayersInPlayerView(player) {
        return this.getPlayerFromScreenView(player.position, player.clientScreenSize)
    }
    getPlayerFromScreenView(position, screenView) {
        let inGamePlayers = this.getPlayingPlayers()
        return inGamePlayers.filter(player => {
            if (this.checkIfPositionIsInScreenView(player.position, position, screenView)) {
                return player
            }
        })
    }
    checkIfPositionIsInScreenView(position, center, screenView) {
        let deltaX = Math.abs(position.x - center.x)
        let deltaY = Math.abs(position.y - center.y)

        return deltaX < screenView.width && deltaY < screenView.height
    }
}
module.exports = UserManager