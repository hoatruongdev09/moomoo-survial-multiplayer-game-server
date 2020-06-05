class ResourceManager {
    constructor() {
        this.Wood = 0
        this.Food = 0
        this.Stone = 0
        this.Gold = 0
    }
    addAll(amount) {
        this.Wood += amount
        this.food += amount
        this.Stone += amount
        this.Gold += amount
    }
    reset() {
        this.Wood = this.Food = this.Stone = this.Gold = 0
    }
}

module.exports = ResourceManager