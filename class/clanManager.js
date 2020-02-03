const GameCode = require('../transmitcode').GameCode
const ClanCode = require('../transmitcode').ClanCode

class ClanManager {
    constructor(game) {
        this.game = game
        this.clans = []
        this.clansCount = 0
    }
    generateClanId() {
        return this.clansCount++
    }
    removeClan(id) {
        for (let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].id == id) {
                this.clans.splice(i, 1)
                this.broadcast(ClanCode.listClan, this.AllClan)
                return
            }
        }
    }
    createClan(name, master) {
        if (this.checkIfClanHaveSameName(name)) {
            return false
        }
        let clan = new Clan(this.generateClanId(), name, master)
        this.clans.push(clan)
        this.broadcast(ClanCode.listClan, this.AllClan)
        return true
    }

    checkIfClanHaveSameName(name) {
        for (let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].name == name) {
                return true
            }
        }
        return false
    }
    broadcast(event, args) {
        this.game.broadcast(event, args)
    }
    get AllClan() {
        let allClan = []
        this.clans.forEach(c => {
            allClan.push({
                id: c.id,
                name: c.name,
                master: c.master.name,
                members: c.MemberCount
            })
        })
        return allClan
    }
}

class Clan {
    constructor(id, name, master) {
        this.id = id
        this.name = name
        this.master = master
        this.member = []

        this.broadcast(ClanCode.member, {
            member: this.AllMember
        })
    }
    checkExistedMember(id) {
        let trueMember = this.AllMember
        for (let i = 0; i < trueMember.length; i++) {
            if (trueMember[i].id == id) {
                return true
            }
        }
        return false
    }
    addMember(member) {
        if (this.checkExistedMember(member.idGame)) {
            return
        }
        this.member.clanId = this.id
        this.member.push(member)
        this.broadcast(ClanCode.member, {
            member: this.AllMember
        })
    }
    kickMember(id) {
        let trueMember = this.AllMember()
        for (let i = 0; i < trueMember.length; i++) {
            if (trueMember[i].id == id) {
                this.member[i].clanId = null
                this.member.splice(i, 1)
                this.broadcast(ClanCode.member, {
                    member: this.AllMember
                })
                return
            }
        }
    }
    broadcast(event, args) {
        let members = this.AllMember
        members.forEach(m => {
            if (m != null) {
                m.send(event, args)
            }
        })
    }

    get AllMember() {
        let trueMember = []
        trueMember.push({
            id: master.idGame,
            role: 1
        })
        this.member.forEach((m) => {
            trueMember.push({
                id: m.idGame,
                idClan: this.id,
                role: 0
            })
        })
        return trueMember
    }
    get MemberCount() {
        return this.AllMember.length
    }

}

module.exports = {
    ClanManager: ClanManager,
    Clan: Clan
}