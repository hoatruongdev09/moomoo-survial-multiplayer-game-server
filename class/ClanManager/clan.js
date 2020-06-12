const TransmitCode = require('../../transmitcode')
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode
const ServerCode = TransmitCode.ServerCode

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
module.exports = Clan