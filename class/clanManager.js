const GameCode = require('../transmitcode').GameCode
const ClanCode = require('../transmitcode').ClanCode
const ServerCode = require('../transmitcode').ServerCode

class ClanManager {
    constructor(game) {
        this.game = game
        this.clans = []
        this.clansCount = 0
    }
    generateClanId() {
        return this.clansCount++
    }

    checkIsMasterOfClan(idMember, idClan) {
        let clan = this.findClanById(idClan)
        if (clan == null) {
            return false
        }
        return clan.master.idGame == idMember
    }
    findClanById(id) {
        for (let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].id == id) {
                return this.clans[i]
            }
        }
        return null
    }
    checkIfClanHaveSameName(name) {
        for (let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].name == name) {
                return true
            }
        }
        return false
    }
    createClan(name, master) {
        if (this.checkIfClanHaveSameName(name)) {
            master.send(ServerCode.Error, {
                reason: "Clan name existed"
            })
            return
        }
        let id = this.generateClanId()
        let clan = new Clan(id, name, master)
        this.clans.push(clan)
        this.broadcast(ClanCode.createClan, {
            id: clan.id,
            name: clan.name
        })
        this.broadcast(ClanCode.joinClan, {
            id: master.idGame,
            idClan: id,
            role: 1
        })
    }
    kickMember(id, clanId) {
        let clan = this.findClanById(clanId)
        if (clan != null) {
            clan.kickMember(id)
            this.broadcast(ClanCode.kickMember, {
                id: [id]
            })
        }
    }
    addRequestJoin(player, idClan) {
        let clan = this.findClanById(idClan)
        if (clan != null) {
            clan.addRequestJoin(player)
        }
    }
    respondRequestJoin(idMember, idClan, action) {
        let clan = this.findClanById(idClan)
        if (clan != null) {
            if (action) {
                console.log("accept request");
                let member = clan.getJoinRequest(idMember)
                if (member != null) {
                    console.log("member: ", member.idGame)
                    this.addMember(member, idClan)
                }
            } else {
                console.log("deny request")
            }
            clan.removeJoinRequest(idMember)
        }
    }
    addMember(member, clanId) {
        let clan = this.findClanById(clanId)
        if (clan != null) {
            clan.addMember(member)
            this.broadcast(ClanCode.joinClan, {
                id: member.idGame,
                idClan: clanId,
                role: 0
            })
        }
    }
    removeClan(clanId) {
        for (let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].id == clanId) {
                let kickData = []
                this.clans[i].getAllMember().forEach(m => {
                    kickData.push(m.id)
                })
                if (kickData.length != 0) {
                    this.broadcast(ClanCode.kickMember, {
                        id: kickData
                    })
                }
                this.broadcast(ClanCode.removeClan, {
                    id: clanId
                })
                this.clans[i].onRemove()
                this.clans.splice(i, 1);
                break
            }
        }
    }

    getClanData() {
        let data = []
        this.clans.forEach(clan => {
            data.push({
                id: clan.id,
                name: clan.name,
            })
        })
        return data
    }
    getClansMemberData() {
        let data = []
        this.clans.forEach(clan => {
            clan.getAllMember().forEach(member => {
                data.push({
                    id: member.id,
                    idClan: member.idClan,
                    role: member.role
                })
            })
        })
        return data
    }
    broadcast(event, args) {
        this.game.broadcast(event, args)
    }

}

class Clan {
    constructor(id, name, master) {
        this.id = id
        this.name = name
        this.master = master
        this.master.clanId = this.id
        this.member = []
        this.requestJoin = []
    }
    checkExistedMember(id) {
        let trueMember = this.getAllMember()
        for (let i = 0; i < trueMember.length; i++) {
            if (trueMember[i].id == id) {
                return true
            }
        }
        return false
    }
    kickMember(id) {
        if (this.checkExistedMember(id)) {
            for (let i = 0; i < this.member.length; i++) {
                if (this.member[i].idGame == id) {
                    this.member[i].clanId = null
                    this.member.splice(i, 1)
                    break
                }
            }
        }
    }
    addRequestJoin(player) {
        if (this.checkExistedMember(player.idGame)) {
            return
        }
        this.requestJoin.push(player)
        this.sendToMaster(ClanCode.requestJoin, {
            id: player.idGame
        })
    }
    getJoinRequest(id) {
        for (let i = 0; i < this.requestJoin.length; i++) {
            if (this.requestJoin[i].idGame == id) {
                return this.requestJoin[i]
            }
        }
        return null
    }
    removeJoinRequest(id) {
        for (let i = 0; i < this.requestJoin.length; i++) {
            if (this.requestJoin[i].idGame == id) {
                this.requestJoin.splice(i, 1);
                return
            }
        }
    }
    addMember(newMember) {
        if (this.checkExistedMember(newMember.idGame)) {
            return;
        }
        newMember.clanId = this.id
        this.member.push(newMember)
    }
    getAllMember() {
        let data = []
        data.push({
            id: this.master.idGame,
            idClan: this.id,
            role: 1
        })
        this.member.forEach(m => {
            data.push({
                id: m.idGame,
                idClan: this.id,
                role: 0
            })
        })
        return data
    }
    onRemove() {
        this.member.push(this.master)
        this.member.forEach(m => {
            m.clanId = null
        })
    }
    sendToMaster(event, args) {
        this.master.send(event, args)
    }
    broadcast(event, args) {
        let members = this.member
        members.push(this.master)
        members.forEach(m => {
            if (m != null) {
                m.send(event, args)
            }
        })
    }
}

module.exports = {
    ClanManager: ClanManager,
    Clan: Clan
}