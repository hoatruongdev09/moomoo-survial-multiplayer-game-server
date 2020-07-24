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
    update(deltaTime) {

    }
    getMemberPositionData() {
        let data = []
        data.push(this.master)
        data.push(...this.member)
        return data.map(mem => {
            return {
                id: mem.idGame,
                pos: {
                    x: mem.position.x,
                    y: mem.position.y
                }
            }
        })
    }
    syncClanMemberPosition() {
        let data = this.member.map(mem => {
            return {
                id: mem.idGame,
                pos: mem.position
            }
        })
        data.push({
            id: this.master.idGame,
            pos: this.master.position
        })
        this.sendPositionData(data)
    }
    sendPositionData(data) {
        this.broadcast(ClanCode.syncMemberPosition, {
            pos: data
        })
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
    getAllMemberData() {
        let data = []
        data.push(this.master)
        data.push(...this.member)
        return data
    }
    getAllMember() {
        let data = this.member.map(mem => {
            return {
                id: mem.idGame,
                idClan: this.id,
                role: 0
            }
        })
        data.push({
            id: this.master.idGame,
            idClan: this.id,
            role: 1
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
        let members = []
        members.push(...this.member)
        members.push(this.master)
        members.forEach(m => {
            if (m != null) {
                m.send(event, args)
            }
        })
    }
}
module.exports = Clan