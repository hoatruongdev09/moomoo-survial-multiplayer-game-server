const Mathf = require('mathf')

class Map {
    constructor(size, offset, snowSize, riverSize) {
        this.size = size
        this.offset = offset

        this.snowSize = {
            hi: this.size.y,
            lo: this.size.y - this.size.y * snowSize
        }
        this.riverSize = {
            hi: this.size.y / 2 + this.size.y * riverSize,
            lo: this.size.y / 2 - this.size.y * riverSize
        }
    }

    randomPosition() {
        let X = Mathf.RandomeRange(0, this.size.x)
        let Y = Mathf.RandomeRange(0, this.size.y)
        return {
            x: X,
            y: Y
        }
    }
    checkIfIsInSnow(position) {
        return position.y > this.snowSize.lo
    }
    checkIfIsInRiver(position) {
        return position.y < this.riverSize.hi && position.y > this.riverSize.lo
    }

    rangdomAngle() {
        return Mathf.RandomeRangeFloat(0, 360) * Mathf.Deg2Rad
    }
    roundPositionToMap(position) {
        let newPosition = position
        if (position.x < 0) {
            newPosition.x = 0 + this.offset.x
        } else if (position.x > this.size.x) {
            newPosition.x = this.size.x - this.offset.x
        }
        if (position.y < 0) {
            newPosition.y = 0 + this.offset.y
        } else if (position.y > this.size.y) {
            newPosition.y = this.size.y - this.offset.y
        }
        return newPosition
    }
    clampPositionToMap(position) {
        if (position.x < this.offset.x) {
            position.x = this.offset.x
        } else if (position.x > this.size.x - this.offset.x) {
            position.x = this.size.x - this.offset.x
        }
        if (position.y < this.offset.y) {
            position.y = this.offset.y
        } else if (position.y > this.size.y - this.offset.y) {
            position.y = this.size.y - this.offset.y
        }
        return position
    }
}

module.exports = Map