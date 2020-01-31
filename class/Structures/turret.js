const SAT = require('sat')
const Bullet = require('../weapon/bullet')
const Mathf = require('mathf')
class GameTurret {
    constructor(id, player, position, info, game) {
        this.id = id
        this.userId = player.idGame
        this.player = player
        this.position = position
        this.game = game

        this.hp = info.health
        this.size = info.size
        this.itemId = info.id

        this.closeEnemy = []
        this.range = info.range
        this.isShooted = false
        this.fireRate = info.fireRate
        this.damage = info.damage
        this.bulletSpeed = info.bulletSpeed
        this.angle = 0

        this.update = {
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
        this.bodyCollider
        this.initCollider()
        this.init()
    }
    initCollider() {
        this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), this.size)
    }
    destroy() {
        this.update.stop()
    }
    init() {
        this.update.run(() => this.findAndShoot())
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
        let bullet = new Bullet(idProjectile, 1, this.player, direct, position, 0.6, this.bulletSpeed, this.range, this.damage)
        this.game.addProjectTile(bullet, Math.atan2(direct.y, direct.x))
    }
    findClosestEnemies() {
        this.closeEnemy = this.game.getPlayersFromViewInRange(this.position, this.range)
        if (this.closeEnemy.length == 1) {
            if (this.game.getPlayerInfo(this.closeEnemy[0].id).idGame != this.player.idGame) {
                return this.game.getPlayerInfo(this.closeEnemy[0].idGame)
            } else {
                return null
            }
        }
        let closest = Mathf.Infinity
        let target = null
        this.closeEnemy.forEach(p => {
            if (p.id != this.player.idGame) {
                let temp = this.game.getPlayerInfo(p.id).position.clone().sub(this.position).sqrMagnitude()
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
    takeDamge(damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }
    get rotation() {
        return this.angle
    }
}
module.exports = GameTurret