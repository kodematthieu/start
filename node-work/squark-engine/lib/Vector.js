var util = require('util');
module.exports = function(sdefine, createClass, Define) {
    'use strict';
    
    var Math = this.Math;
    
    var __vector__ = createClass('Vector', function(x, y = null, angleMode = 'degrees') {
        if(arguments.length < 2) y = 0;
        if(arguments.length < 1) x = 0;
        if(typeof y === 'string') {angleMode=y;y=0}
        if(typeof x === 'string') {angleMode=x;x=0;y=0}
        if(!['degrees', 'radians'].includes(angleMode)) angleMode = 'degrees';
        if(arguments[0] instanceof Array) {
            this.angleMode = arguments[0][2] || angleMode;
            this.set(arguments[0][0] || x, arguments[0][1] || y);
        }
        else if(typeof arguments[0] === 'object') {
            this.angleMode = arguments[0].angleMode || angleMode;
            this.set(arguments[0].x || x, arguments[0].y || y, arguments[0].angleMode || angleMode);
        }
        else {
            this.angleMode = angleMode;
            this.set(x, y);
        }
    }, {privates: ['x', 'y', 'am']}),
        Vector = __vector__.class,
        define = __vector__.define,
        __x__ = __vector__.privates.x,
        __y__ = __vector__.privates.y,
        anglemode = __vector__.privates.am;
    
    /* -------- Constructor Properties -------- */
    define('clone', function(){return new this.constructor(this.x, this.y, this.angleMode)});
    define('set', function(x, y = null) {
        if(x instanceof Array) {y = x[1];x = x[0]}
        else if(typeof x === 'object') {y = x.y;x = x.x}
        this.x = Number(x);
        this.y = Number(y);
        return this;
    });
    
    /* -------- Accessor Properties -------- */
    define('x.get', function(){if(!__x__.has(this)) return null;return __x__.get(this)});
    define('x.set', function(v){__x__.set(this,Number(v))});
    define('y.get', function(){if(!__y__.has(this)) return null;return __y__.get(this)});
    define('y.set', function(v){__y__.set(this,Number(v))});
    define('angleMode.get', function(){if(!anglemode.has(this)) return null;return anglemode.get(this)});
    define('angleMode.set', function(v){if(!['degrees', 'radians'].includes(v)) return;anglemode.set(this, v)});
    define('angle.get', function(){var a = Math.atan2(this.x, -this.y);a = a * 360 / (Math.PI2) % 360;if(this.angleMode === 'radians')return Math.radians(a);return a});
    define('angle.set', function(v){var rotation = Number(v) - this.angle;this.rotate(rotation)});
    define('length.get', function(){return Math.hypot(this.x, this.y)});
    define('length.set', function(v){this.set(this.normal.mult(v))});
    define('negative.get', function(){return new this.constructor(-this.x, -this.y)});
    define('normal.get', function(){return this.clone().div(this.length)});
    define('absolute.get', function(){return this.clone().pow(2).root(2)});
    
    /* -------- Operator Methods -------- */
    define('add.self', function(x,y){var vec = new this.constructor(x, y);this.x=this.x+vec.x;this.y=this.y+vec.y});
    define('sub.self', function(x,y){var vec = new this.constructor(x, y);this.x=this.x-vec.x;this.y=this.y-vec.y});
    define('mult.self', function(n){this.x=this.x*n;this.y=this.y*n});
    define('div.self', function(n){this.x=this.x/n;this.y=this.y/n});
    define('dot.self', function(x,y){var vec = new this.constructor(x, y);this.x=this.x*vec.x;this.y=this.y*vec.y});
    define('cross', function(x,y){var vec = new this.constructor(x, y);return (this.x*vec.y) - (this.y*vec.x)});
    define('pow.self', function(n){this.x=Math.pow(this.x, n);this.y=Math.pow(this.y, n)});
    define('root.self', function(n){this.x=Math.root(this.x, n);this.y=Math.root(this.y, n)});
    
    /* -------- Utility Methods -------- */
    define('rotate.self', function(a) {
        if(this.angleMode === 'degrees') a = Math.radians(a);
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var x = Math.round(this.x * cos - this.y * sin, 4);
        var y = Math.round(this.x * sin + this.y * cos, 4);
        this.set(x, y);
    });
    define('limit.self', function(v) {
        var mag = this.length;
        if(mag > v) this.div(mag).mult(v);
    });
    define('random', function(min, max) {
        return this.set(Math.random(min, max), Math.random(min, max));
    });
    define('equals', function(vec) {
        return this.x == vec.x && this.y == vec.y;
    });
    
    /* -------- Conversion Methods -------- */
    define('toString', function(){return `<${this.constructor.name} [${this.toArray().join(', ')}]>`}, {enumerable: false});
    
    /* -------- Symbolic Methods -------- */
    define(Symbol.iterator, function*(){yield this.x;yield this.y});
    if(typeof util.inspect.custom === 'symbol') define(util.inspect.custom, function(depth, opts) {
        if(arguments.length == 0) depth = 1;
        if(depth < 1) return '\x1B[36m'+('['+this.constructor.name+']')+'\x1B[39m';
        var _this = this;
        var first = this.constructor.name + '(' + util.inspect(this.x, {colors: true}) + ', ' + util.inspect(this.y, {colors: true}) + ') ' + '[' + this.angleMode + ']';
        var second = {length: this.length};
        Object.defineProperty(second, 'normal', {value: this.normal, enumerable: true});
        Object.defineProperty(second, 'negative', {value: this.negative, enumerable: true});
        Object.defineProperty(second, 'absolute', {value: this.absolute, enumerable: true});
        delete second.x; delete second.y;
        return first + ' ' + util.inspect(second, Object.assign(opts, {depth: depth}));
    });
    
    /* -------- Static Methods -------- */
    define = Define.bind(Vector);
    define('random', function(min, max) {
        return new this().random(min, max);
    });
    define('dist', function(a, b) {
        if(!(a instanceof this)) return null;
        if(!(b instanceof this)) return null;
        var x = avec.clone().sub(bvec).x;
        var y = avec.clone().sub(bvec).y;
        return Math.hypot(x, y);
    });
    define('average', function() {
        var vec = new this();
        for(var i = 0; i < arguments.length; i++) {
            if(!(arguments[i] instanceof this)) continue;
            vec.x = vec.x + arguments[i].x;
            vec.y = vec.y + arguments[i].y;
        }
        vec.x = vec.x/arguments.length;
        vec.y = vec.y/arguments.length;
        return vec;
    });
    define('fromAngle', function(a) {
        return new this(0,-1).rotate(angle);
    });
    
    sdefine('Vector.get', function(){return Vector});
};