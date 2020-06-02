const Mathf = require('mathf')
class MathfPlus extends Mathf {
    static RandomeRange(start, end) {
        return Math.floor(Math.random() * end) + start;
    }
    static RandomeRangeFloat(start, end) {
        return Math.random() * end + start
    }
}
module.exports = MathfPlus;