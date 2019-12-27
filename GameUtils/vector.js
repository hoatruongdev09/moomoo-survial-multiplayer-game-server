class Vector {
    static random(lx, ly, hx, hy) {
        return new Vector(~~(Math.random() * (hx - lx)) + lx, ~~(Math.random() * (hy - ly)) + ly)
    }

    static zero() {
        return new Vector(0, 0);
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    subnt(v) { // sub but not change local
        let x = this.x - v.x
        let y = this.y - v.y
        return new Vector(x, y)
    }
    div(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    mult(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    scale(v) {
        this.x *= v;
        this.y *= v;
        return this;
    }
    shrink(v) {
        this.x /= v;
        this.y /= v;
        return this;
    }
    sqrMagnitude() {
        return this.x * this.x + this.y * this.y
    }
    moveTowards(v, amount) {
        return this.add(v.clone().sub(this).limitTo(amount));
    }
    limitTo(value) {
        return this.scale(value / this.length);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    angleFrom(v) {
        let angle = Math.atan2(v.y - this.y, v.x - this.x);
        if (angle < 0) angle += Math.PI * 2;
        return angle;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    equalTo(v) {
        return this.x === v.x && this.y === v.y;
    }
    constraint(lx, ly, hx, hy, min, max) {
        this.x = this.x < lx ? lx : this.x > hx ? hx : this.x;
        this.y = this.y < ly ? ly : this.y > hy ? hy : this.y;
        return this;
    }
    toAngle() {
        return Math.atan2(this.y, this.x);
    }
    get unitVector() {
        return new Vector(this.x / this.length, this.y / this.length);
    }
    get length() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }
        *[Symbol.iterator]() {
            // jshint ignore: start
            yield this.x;
            yield this.y;
            // jshint ignore: end
        }

}


module.exports = Vector;