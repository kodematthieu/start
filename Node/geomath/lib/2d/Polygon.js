const Vector = require("./Vector");

const gpoint = new WeakMap();

class Polygon {
    /* -------- Acessor Properties -------- */
    get points() {if(!gpoint.has(this)) return null; return Object.seal(gpoint.get(this))}

    /**
     * @constructor
     * @param  {...(Vector|[number,number]|{x:Number,y:Number})} points - The points of the polygon
     */
    constructor(...points) {
        points = points.map(e => new Vector(e));
        gpoint.set(this, []);
    }

    /* -------- Utility Methods -------- */
    rotate() {}

    /* -------- Static Methods -------- */
    static regular(radius, points, center = new Vector()) {
        radius = Number(radius);
        center = new Vector(center);
        points = Array(Number(points)).fill().map((e,i,{length}) => {
            let deg = (360/length)*i;
            let vec = Vector.fromAngle(deg);
            return vec.mult(radius).add(center);
        });
        return new this(...points);
    }
}