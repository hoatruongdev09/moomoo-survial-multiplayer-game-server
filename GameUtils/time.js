const performance = require('perf_hooks').performance
class Time {
    constructor() {
        this.lastRun = performance.now()
        this.deltaTime = 0
        this.update()
    }
    update() {
        let now = performance.now()
        this.deltaTime = (now - this.lastRun) / 1000
        this.lastRun = now
    }
}

module.exports = Time