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
    triggerAutoAttack: "autoAttk",

    syncTransform: "syncTrsform",

    playerHit: "phit",
    playerDie: "pdie",
    playerStatus: "pstt",

    switchItem: "swtItm",
    spawnnStructures: "spwnStrc",
    removeStructures: "rmvStrc",

    upgradeItem: "ugdItem",
    syncItem: "syncItem"
}

module.exports = {
    ServerCode: servercode,
    GameCode: gamecode
}