class Consume {
    constructor(info) {
        this.info = info
    }
    use(player, direct) {
        console.log("Heal")
        if (player.healthPoint == 100) {
            return
        }
        if (player.food <= this.info.cost.food) {
            player.healthPoint += this.info.restore
            if (player.healthPoint > 100) {
                player.healthPoint = 100
            }
        }
    }
}
module.exports = Consume