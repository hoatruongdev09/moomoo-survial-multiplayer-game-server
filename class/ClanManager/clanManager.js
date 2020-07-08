const TransmitCode = require('../../transmitcode')
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode
const ServerCode = TransmitCode.ServerCode

const Clan = require('./clan')
class ClanManager {
    constructor(game) {
        this.clans = []
        this.clanID = 0
    }
    update(deltaTime) {

    }
    createClan(clanMaster, clanName, createCallback) {
        let id = this.clanID++
        let clan = new Clan(id, clanName, clanMaster)
        this.clans.push(clan)
        createCallback()
    }
    removeClan(clanID) {
        let clan = this.getClanByID(clanID)
        if (clan != null) {
            this.clans = this.clans.filter(clan => clan.id != clanID)
            return true
        }
        return false
    }
    kickMember(memberID, clanID) {
        let clan = this.getClanByID(clanID)
        if (clan != null) {
            if (!clan.checkMemberIsMasterByID(memberID)) { return false }
            return clan.removeMemberByID(memberID)
        }
        return false
    }

    checkClanExisted(ID) {
        let clan = this.getClanByID(ID)
        return clan != null
    }
    getClanByID(ID) {
        let clan = this.clans.find(c => c.id == id)
        return clan
    }
    getClansInfo() {
        let data = this.clans.map(clan => {
            return {
                id: clan.id,
                name: clan.name,
                masterName: clan.master.name
            }
        })
        return data
    }
    requestJoin(member, clanID) {
        let clan = this.getClanByID(clanID)
        if (clan == null) { return false }
        if (!clan.canRequestJoin(member.idGame)) { return false }
        clan.requestJoin(member)
        return true
    }

}

module.exports = ClanManager
