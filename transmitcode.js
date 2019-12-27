const servercode = {
    OnConnect: "oncon",
    OnFailedToConnect: "onConFailed",
    OnRequestJoin: "onJoin",
}
const gamecode = {
    gameData: "gameData",
    receivedData: "rvGameData",

    spawnPlayer: "spwnPlayer",

    playerQuit: "plQuit",

    syncLookDirect: "syncLook",
    syncMoveDirect: "syncMove",
    triggerAttack: "attk",

    syncTransform: "syncTrsform"
}

module.exports = {
    ServerCode: servercode,
    GameCode: gamecode
}