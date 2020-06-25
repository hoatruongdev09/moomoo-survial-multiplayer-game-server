const SAT = require('sat')
const Bullet = require('../weapon/bullet')
const Mathf = require('mathf')
const BaseStructure = require('./baseStructure')

class GameTurret extends BaseStructure {
    constructor(id, position, direct, owner, info) {
        super(id, position, direct, owner, info)

        this.closeEnemies = []
        this.range = info.range
        this.isShooted = false
        this.fireRate = info.fireRate
        this.damage = info.damage
        this.bulletSpeed = info.bulletSpeed
        this.angle = 0
        this.game = this.owner.game

        this.update = this.updateLogic()
        this.update.run(() => this.findAndShoot())
    }
    destroy() {
        this.update.stop()
    }
    updateLogic() {
        return {
            isRunning: false,
            id: null,
            run(callback) {
                if (this.id == null || this.isRunning == false) {
                    this.id = setInterval(callback, 100)
                    this.isRunning = true
                }
            },
            stop() {
                this.isRunning = false
                clearInterval(this.id)
            }
        }
    }
    findAndShoot() {
        let enemy = this.findClosestEnemies()
        if (enemy != null) {
            this.shoot(enemy)
        }
    }
    shoot(target) {
        if (this.isShooted) {
            return
        }
        this.isShooted = true
        console.log("Shoot: ", target.idGame)
        let tempDirect = target.position.clone().sub(this.position).unitVector
        this.createBullet(tempDirect)
        this.angle = Math.atan2(tempDirect.y, tempDirect.x)
        setTimeout(() => {
            this.isShooted = false
        }, this.fireRate)
    }
    createBullet(direct) {
        let position = this.position.clone().add(direct.clone().scale(2))
        let idProjectile = this.game.getProjectileId()
        let bullet = new Bullet(idProjectile, 1, this.owner, direct, position, 0.6, this.bulletSpeed, this.range, this.damage)
        this.game.addProjectTile(bullet, Math.atan2(direct.y, direct.x))
    }
    findClosestEnemies() {
        this.closeEnemies = this.game.getPlayersFromViewInRange(this.position, this.range)
        this.closeEnemies.filter(enemy => { if (enemy.idGame != this.userId) return enemy })
        if (this.closeEnemies.length == 1) {
            let playerInfo = this.game.getPlayerInfo(this.closeEnemies[0].id)
            if (!playerInfo.turretIgnored && !this.game.checkBothPlayerAreInClan(playerInfo, this.game.getPlayerInfo(this.owner.idGame)))
                return playerInfo
        }

        let closest = Mathf.Infinity
        let target = null
        this.closeEnemies.forEach(p => {
            let playerInfo = this.game.getPlayerInfo(p.id)
            if (p.id != this.owner.idGame && !this.game.checkBothPlayerAreInClan(this.game.getPlayerInfo(this.owner.idGame), playerInfo) && !playerInfo.turretIgnored) {
                let temp = playerInfo.position.clone().sub(this.position).sqrMagnitude()
                if (temp < closest) {
                    closest = temp
                    target = this.game.getPlayerInfo(p.id)
                }
            }
        })
        return target
    }
    toString() {
        return "Turret"
    }
}
module.exports = GameTurret