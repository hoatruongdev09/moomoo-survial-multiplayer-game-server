const TransmitCode = require('../../transmitcode')
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode
const ServerCode = TransmitCode.ServerCode

class Clan {
    constructor(id, name, master) {
        this.id = id
        this.name = name
        this.master = master
        this.masterID = master.idGame
        this.members = []
        this.members.push(this.master)
    }
    canRequestJoin(id) {
        return this.checkMemberExistedByID(id)
    }
    requestJoin(member) {
        // send master request

    }
    addMember(member) {
        if (this.checkMemberExistedByID(member.idGame)) {
            return false
        }
        this.members.push(member)
        return true
    }
    removeMemberByID(id) {
        if (this.checkMemberExistedByID(id)) {
            this.members = this.members.filter(p => p.idGame != id)
            return true
        }
        return false
    }
    removeMember(member) {
        if (this.checkMemberExistedByID(member.idGame)) {
            this.members = this.members.filter(p => p.idGame != member.idGame)
            return true
        }
        return false
    }
    checkMemberExistedByID(ID) {
        let member = this.findMemberWithID(ID)
        return member != null
    }
    checkMemberExisted(member) {
        let member = this.findMemberWithID(member.idGame)
        return member != null
    }
    findMemberWithID(id) {
        let member = this.members.find((p) => { return p.idGame == id })
        return member
    }
    checkMemberIsMaster(member) {
        return member.idGame == this.masterID
    }
    checkMemberIsMasterByID(id) {
        return id == this.masterID
    }
    getShortClanInfo() {
        return {
            id: this.id,
            name: this.name,
            masterName: this.master.name,
            masterID: this.masterID,
            memberCount: this.members.length
        }
    }
}
module.exports = Clan