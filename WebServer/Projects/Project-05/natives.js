(function($) {
    const xvec = new WeakMap();
    const yvec = new WeakMap();
    const anglemode = new WeakMap();
    
    const degrees = v => v * (180/Math.PI);
    const radians = v => v * (Math.PI/180);
    
    const round = (v, d=0) => Math.round(v*(10**d)) / (10**d);
    
    class Vector {
        /* -------- Accessor Properties -------- */
        get x() {if(!xvec.has(this)) return null;return xvec.get(this)}
        set x(v) {xvec.set(this,Number(v))}
        get y() {if(!yvec.has(this)) return null;return yvec.get(this)}
        set y(v) {yvec.set(this,Number(v))}
        get angleMode() {if(!anglemode.has(this)) return null;return anglemode.get(this)}
        set angleMode(v) {if(!["degrees", "radians"].includes(v)) return;anglemode.set(this, v)}
        get angle() {let a = (Math.atan2(this.x, -this.y));a = (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI) % 360;if(this.angleMode === "radians") return radians(a);return a}
        set angle(v) {let rotation = Number(v) - this.angle;this.rotate(rotation)}
        get length() {return Math.hypot(this.x, this.y)}
        set length(v) {this.set(this.normal.mult(v))}
        get negative() {return new Vector(-this.x, -this.y)}
        get normal() {return this.clone().div(this.length)}
        get absolute() {return this.clone().pow(2).root(2)}
    
        /**
         * @constructor
         * @param {number|number[]|{x: number, y: number}|Vector|'degrees'|'radians'} x - The x coordinate
         * @param {number|'degrees','radians'} [y=null] - The y coordinate
         * @param {'degrees'|'radians'} [angleMode='degrees'] - The angle mode of the vector
         */
        constructor(x, y = null, angleMode = "degrees") {
            if(arguments.length < 2) y = 0;
            if(arguments.length < 1) x = 0;
            if(typeof y === "string") angleMode = y;
            if(typeof x === "string") angleMode = x;
            if(!["degrees", "radians"].includes(angleMode)) angleMode = "degrees";
            this.angleMode = angleMode;
            this.set(x, y);
        }
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {Vector} self
         */
        set(x, y = null) {
            if(x instanceof Array) {y = x[1];x = x[0]}
            else if(typeof x === "object") {y = x.y;x = x.x}
            this.x = Number(x);
            this.y = Number(y);
            return this;
        }
        /**
         * @method
         * @returns {Vector} clone
         */
        clone() {return new Vector(this.x, this.y)}
    
        /* -------- Operator Methods -------- */
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {Vector} self
         */
        add(x, y = null) {
            /** @type {Vector} */
            const vec = new this.constructor(x, y);
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {Vector} self
         */
        sub(x, y = null) {
            /** @type {Vector} */
            const vec = new this.constructor(x, y);
            return this.add(vec.negative);
        }
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {Vector} self
         */
        mult(x, y = null) {
            if(arguments.length == 1 && typeof x === "number") {
                this.x *= x;
                this.y *= x;
            }
            else {
                /** @type {Vector} */
                const vec = new this.constructor(x, y);
                this.x *= vec.x;
                this.y *= vec.y;
            }
            return this;
        }
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {Vector} self
         */
        div(x, y = null) {
            if(arguments.length == 1 && typeof x === "number") {
                this.x /= x;
                this.y /= x;
            }
            else {
                /** @type {Vector} */
                const vec = new this.constructor(x, y);
                this.x /= vec.x;
                this.y /= vec.y;
            }
            return this;
        }
        /**
         * @method
         * @param {number|number[]|{x: number, y: number}|Vector} x - The x coordinate
         * @param {number} [y=null] - The y coordinate
         * @returns {number} Result of the cross product
         */
        cross(x, y = null) {
            /** @type {Vector} */
            const vec = new this.constructor(x, y);
            return this.x*vec.y - this.y*vec.x;
        }
        /**
         * @method
         * @param {number} value - The exponent of the vector
         * @returns {Vector} self
         */
        pow(value) {
            value = Number(value);
            this.x **= value;
            this.y **= value;
            return this;
        }
        /**
         * @method
         * @param {number} value - The root to get from the vector
         * @returns {Vector} self
         */
        root(value) {
            value = Number(value);
            this.x **= 1/value;
            this.y **= 1/value;
            return this;
        }
        
        /* -------- Utility Methods -------- */
        /**
         * @method
         * @param {number} angle - Angle to rotate. The conversion to unit will be based on {@link Vector#angleMode}
         * @returns {Vector} self 
         */
        rotate(angle) {
            if(this.angleMode === "degrees") angle = radians(angle);
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            let x = round(this.x * cos - this.y * sin, 4);
            let y = round(this.x * sin + this.y * cos, 4);
            this.set(x, y);
            return this;
        }
        /**
         * @method
         * @param {number} value - The limit of the vector
         * @returns {Vector} self
         */
        limit(value) {
            let mag = this.length;
            if(mag > value) this.div(mag).mult(value);
            return this;
        }
        /**
         * @method
         * @returns {Vector} self
         */
        random() {
            return this.set(Math.random(), Math.random());
        }
        /**
         * @method
         * @param {Vector} vec - Vector to compare 
         * @returns {boolean} Whether its equal or not
         */
        equals(vec) {
            return this.x == vec.x && this.y == vec.y;
        }
    
        /* -------- Conversion Methods -------- */
        toArray() {return [...this]}
        toString() {return `<${this.constructor.name} [${this.toArray().join(", ")}]>`}
    
        /* -------- Symbolic Methods -------- */
        *[Symbol.iterator]() {
            yield this.x;
            yield this.y;
        }
    
        /* -------- Static Methods -------- */
        /** @returns {Vector} Random vector */
        static random() {return new this().random()}
        /**
         * @method
         * @param {Vector} avec - Point a
         * @param {Vector} bvec - Point b
         * @returns {number} The distance from point a to point b
         */
        static dist(avec, bvec) {
            if(!(avec instanceof this)) return null;
            if(!(bvec instanceof this)) return null;
            return Math.hypot(...avec.clone().sub(bvec));
        }
        /**
         * @method
         * @param {number} angle - The angle of the vector
         * @returns {Vector} Rotated by the given angle
         */
        static fromAngle(angle) {return new this(0,-1).rotate(angle)}
    }
    $.Vector = Vector;
})(window);