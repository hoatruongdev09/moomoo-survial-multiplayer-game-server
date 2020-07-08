class Time {
    constructor() {
        this.lastRun = Date.now()
        this.deltaTime = 0
        this.update()
    }
    update() {
        let now = Date.now()
        this.deltaTime = (now - this.lastRun) / 1000
        this.lastRun = now
    }
}

module.exports = Time