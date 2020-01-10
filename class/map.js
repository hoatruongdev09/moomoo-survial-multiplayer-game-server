const Mathf = require('mathf')

class Map {
    constructor(size, offset) {
        console.log("init size: ", size);
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