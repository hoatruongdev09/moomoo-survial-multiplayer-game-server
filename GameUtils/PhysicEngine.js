// const SAT = require('../../GameUtils/modifiedSAT')
const Sat = require("./modifiedSAT").sat;

const Vector = require("./vector");
const Victor = require("victor");
const SatVector = Sat.Vector;
const Poligon = Sat.Polygon;

class PhysicEngine {
    constructor() {
        this.response = new Sat.Response();
    }
    testCollider(object1, object2, response) {
        this.response.clear();
        // let res = new Sat.Response()
        let collision = Sat.testPolygonPolygon(
            object1.boxCollider.boxCollider,
            object2.boxCollider.boxCollider,
            this.response
        );
        if (collision) {
            response(this.response, object2);
        }
        return collision;
    }
    objectCollision(poligon, otherObject) {
        let otherCollider = new Poligon(new SatVector(), []);
        let poliVertices = [];
        let collidedObjects = [];
        for (let poli in poligon) {
            poliVertices.push(new SatVector(poli.x, poli.y));
        }
        let mainCollider = new Poligon(new SatVector(0, 0), poliVertices);
        for (let obj in otherObject) {
            let pointsTemp = [];
            for (let poli in obj) {
                pointsTemp.push(new SatVector(poli.x, poli.y));
            }
            otherCollider.points = pointsTemp;

            let collided = Sat.testPolygonPolygon(mainCollider, otherCollider);
            if (collided) {
                collidedObjects.push(obj.ids);
            }
        }
        return collidedObjects;
    }
}

module.exports = PhysicEngine;