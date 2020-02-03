const servercode = {
    OnConnect: "oncon",
    OnFailedToConnect: "onConFailed",
    OnRequestJoin: "onJoin",
    OnPing: "ping"
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
    syncItem: "syncItem",

    createProjectile: "prjti0",
    removeProjectile: "prjti1",
    syncPositionProjectile: "prjtiUp",

    playerChat: "chat",

    syncNpcTransform: "npcTrans",
    syncNpcHP: "npcHP",
    syncNpcDie: "npcDie",
    spawnNpc: "spwnNpc",

    scoreBoard: "scrBoard"
}
const clanCode = {
    createClan: "clCreate",
    removeClan: "clRemove",
    joinClan: "clJoin",
    kickMember: "clKick",
    member: "clMember",
    listClan: "clList"
}
module.exports = {
    ServerCode: servercode,
    GameCode: gamecode,
    ClanCode: clanCode
}