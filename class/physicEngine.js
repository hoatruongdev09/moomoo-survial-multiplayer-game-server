const SAT = require("../GameUtils/modifiedSAT").sat;
const firebase = require('../firebase')
const ip = require('ip')
class PhysicEngine {
  constructor() {}
  testCircle2Circle(circle1, circle2, response) {
    try {
      let res = new SAT.Response();
      let collision = SAT.testCircleCircle(circle1, circle2, res);
      if (collision) {
        response(res, circle2);
      }
      return collision;
    } catch (err) {
      console.error('handled: ', err)
      firebase.uploadError({
        type: "uncaughtException - handled",
        time: new Date(),
        detail: {
          name: err.name,
          message: err.message,
          stack: err.stack
        },
        host: ip.address()
      })
      return false
    }
  }
  testPolygon2Circle(poly, circle, response) {
    try {
      let res = new SAT.Response();
      let collision = SAT.testPolygonCircle(poly, circle, res);
      if (collision) {
        response(res, circle);
      }
      return collision;
    } catch (err) {
      console.error('handled: ', err)
      firebase.uploadError({
        type: "uncaughtException - handled",
        time: new Date(),
        detail: {
          name: err.name,
          message: err.message,
          stack: err.stack
        },
        host: ip.address()
      })
      return false
    }
  }
}

module.exports = PhysicEngine;