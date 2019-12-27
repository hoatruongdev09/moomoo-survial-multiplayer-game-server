const Sat = require('sat')

const Box = Sat.Box
const Poligon = Sat.Polygon
const SatVector = Sat.Vector
const Victor = require('victor')
const Vector = require('./vector')
const Mathf = require('mathf')

class BoxCollider {
    constructor(position, size) {
        this.boxCollider = new Poligon(new SatVector(position.x, position.y), [
            new SatVector(size.x / 2, size.y / 2),
            new SatVector(size.x / 2, -size.y / 2),
            new SatVector(-size.x / 2, -size.y / 2),
            new SatVector(-size.x / 2, size.y / 2)
        ])
    }
    setSize(size) {
        let vertices = [new SatVector(size.x / 2, size.y / 2),
            new SatVector(size.x / 2, -size.y / 2),
            new SatVector(-size.x / 2, -size.y / 2),
            new SatVector(-size.x / 2, size.y / 2)
        ]
        this.boxCollider.setPoints(vertices)
    }
    setPosition(vector) {
        this.boxCollider.pos = new SatVector(vector.x, vector.y)
    }
    setRotation(angleRad) {
        // this.boxCollider.rotate(angleRad)
        this.boxCollider.setAngle(angleRad)
    }
    getTransform() {
        return {
            position: this.boxCollider.pos,
            points: this.boxCollider.calcPoints
        }
    }
    getNormalTransfrom() {
        return {
            position: this.boxCollider.pos,
            points: this.boxCollider.points
        }
    }
}

module.exports = BoxCollider