const servercode = {
    OnConnect: "s0",
    OnRequestJoin: "s1",
    OnFailedToConnect: "s2",
    OnPing: "s3",
    Error: "s4",
    ClientStatus: "s5",
    ServerList: "s6",
}
const gamecode = {
    gameData: "g0",
    receivedData: "g1",
    spawnPlayer: "g2",

    playerQuit: "g3",

    syncLookDirect: "g4",
    syncMoveDirect: "g5",
    syncTransform: "g6",
    triggerAttack: "g7",
    triggerAutoAttack: "g8",
    playerHit: "g9",
    playerDie: "g10",
    playerStatus: "g11",
    switchItem: "g12",
    spawnnStructures: "g13",
    removeStructures: "g14",
    upgradeItem: "g15",

    syncItem: "g16",

    createProjectile: "g17",
    removeProjectile: "g18",
    syncPositionProjectile: "g19",
    playerChat: "g20",
    syncNpcTransform: "g21",
    syncNpcHP: "g22",
    syncNpcDie: "g23",
    spawnNpc: "g24",
    scoreBoard: "g25",
    syncShop: "g26",
    shopSelectItem: "g27",
    syncEquipItem: "g28",
    syncStructure: "g29"
}
const clanCode = {
    createClan: "c0",
    removeClan: "c1",
    requestJoin: "c2",
    joinClan: "c3",
    kickMember: "c4",
    member: "c5",
    listClan: "c6",
}
module.exports = {
    ServerCode: servercode,
    GameCode: gamecode,
    ClanCode: clanCode
}