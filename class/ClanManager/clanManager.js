const TransmitCode = require('../../transmitcode')
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode
const ServerCode = TransmitCode.ServerCode
const performance = require('perf_hooks').performance
const Clan = require('./clan')
class ClanManager {
    constructor(game) {
        this.game = game
        this.clans = []
        this.clansCount = 0
        this.updateInterval = 0.5
        this.currentUpdateCount = 0
    }
    update(deltaTime) {
        this.currentUpdateCount += deltaTime
        if (this.currentUpdateCount >= this.updateInterval) {
            this.currentUpdateCount = 0
            this.clans.forEach(clan => {
                clan.syncClanMemberPosition()
            })
        }
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
        console.log(`create clan: ${id} | ${master.clanId}`)
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
        if (clan == null) { return; }

        if (action) {
            console.log("accept request");
            let member = clan.getJoinRequest(idMember)
            if (member != null && member.clanId == null) {
                console.log("member: ", member.idGame)
                this.addMember(member, idClan)
            }
        } else {
            console.log("deny request")
        }
        clan.removeJoinRequest(idMember)

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
        let data = this.clans.map(clan => { return { id: clan.id, name: clan.name } })
        return data
    }
    old_getClanData() {
        let data = []
        this.clans.forEach(clan => {
            data.push({
                id: clan.id,
                name: clan.name,
            })
        })
        return data
    }
    getClanMembersData(clanId) {
        let clan = this.findClanById(clanId)
        if (clan == null) { return [] }
        return clan.getAllMemberData()
    }
    getClansMemberData() {
        let data = []
        this.clans.forEach(clan => {
            let memberData = clan.getAllMember()
            data.push(...memberData)
        })
        return data
    }
    old_getClansMemberData() {
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

module.exports = ClanManager
