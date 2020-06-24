class EffectManager {
    constructor(player) {
        this.effects = []
    }
    getEffect(id) {
        return this.effects.find((p) => { return p.id === id })
    }
    contains(id) {
        return this.getEffect(id) != null
    }
    addEffect(effect) {
        if (this.contains(effect.id)) {
            return
        }
        this.effects.push(effect)
    }
    removeEffect(id) {
        if (!this.contains(id)) {
            return
        }
        this.effects = this.effects.filter((p) => { p.id != id })
    }
    reset() {
        this.effects.forEach(effect => {
            clearInterval(effect.effect)
        })
        this.effects.length = 0
    }
}
module.exports = EffectManager