const Mathf = require('mathf')

class Map {
    constructor(size, offset) {
        this.size = size
        this.offset = offset
    }

    randomPosition() {
        let X = Mathf.RandomeRange(0, this.size.x)
        let Y = Mathf.RandomeRange(0, this.size.y)
        return {
            x: X,
            y: Y
        }
    }

    rangdomAngle() {
        return Mathf.RandomeRangeFloat(0, 360) * Mathf.Deg2Rad
    }
    roundPositionToMap(position) {
        let newPosition = position
        if (position.x < 0) {
            newPosition.x = 0 + this.offset.x
        } else if (position.x > this.mapSize.x) {
            newPosition.x = this.mapSize.x - this.offset.x
        }
        if (position.y < 0) {
            newPosition.y = 0 + this.offset.y
        } else if (position.y > this.mapSize.y) {
            newPosition.y = this.mapSize.y - this.offset.y
        }
        return newPosition
    }

}

module.exports = Map