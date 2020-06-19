const SAT = require("sat");

class PhysicEngine {
  constructor() { }
  testCircle2Circle(circle1, circle2, response) {
    let res = new SAT.Response();
    let collision = SAT.testCircleCircle(circle1, circle2, res);
    if (collision) {
      response(res, circle2);
    }
    return collision;
  }
  testPolygon2Circle(poli, circle, response) {
    let res = new SAT.Response();
    let collision = SAT.testPolygonCircle(poli, circle, res);
    if (collision) {
      response(res, circle);
    }
    return collision;
  }
}

module.exports = PhysicEngine;
