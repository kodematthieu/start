!(function(global, factory) {
    'use strict';
    
    var version = '0.0.1';
    var fn = Array.from(arguments).slice(2, Infinity);
    
    if(typeof module === 'object' && typeof module.exports === 'object') module.exports = factory(global, version, fn, true);
    else factory(global, version, fn);
})(typeof window !== 'undefined' ? window : this, function(window, version, addons, noGlobal) {
    'use strict';
    
    var Define = function(name, value, opts = {}) {
        opts = Object.assign({enumerable: true, configurable: true}, opts);
        if(typeof value === 'function') {
            var decor = function() {return value.apply(this, arguments)};
            if(typeof name === 'string') {
                if((/^([a-zA-Z0-9_]+)\.self$/).test(name)) {
                    name = name.match(/^([a-zA-Z0-9_]+)\.self$/)[1];
                    decor = function() {
                       value.call(this, ...arguments);
                       return this;
                    };
                }
                else if((/^([a-zA-Z0-9_]+)\.(set|get)$/).test(name)) {
                    var method = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[2];
                    name = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[1];
                    Object.defineProperty(this, name, opts);
                    Object.defineProperty(this, name, {[method]: value});
                    return value;
                }
                Object.defineProperty(decor, 'name', {value: name, writable: true, configurable: true});
            }
            Object.defineProperty(this, name, Object.assign({value: decor, writable: true}, opts));
            return decor;
        }
        Object.defineProperty(this, name, Object.assign({value, writable: true}, opts));
        return value;
    };
    var createClass = function(name, constructor, opts = {}) {
        var inherited = new WeakMap();
        var fnCall = opts.fnCall;if(!(fnCall instanceof Function)) fnCall = null;
        var readable = !!opts.readable;
        var inherits = opts.inherits;if(!(inherits instanceof Function) || !('prototype' in inherits)) inherits = null;
        var privates = opts.privates;if(!(privates instanceof Array)) privates = [];
        privates = privates.map(String).reduce(function(a, b) {a[b] = new WeakMap();return a}, {});
        var cls = function() {
            if(!(this instanceof cls) && !(fnCall instanceof Function)) throw new TypeError('Invalid constructor');
            else if(fnCall instanceof Function && !(this instanceof cls)) return fnCall.apply(undefined, arguments);
            if(inherits != null) inherits.apply(this, arguments);
            this.privates = Object.assign({}, privates);
            if(constructor instanceof Function) constructor.apply(this, arguments);
            delete this.privates;
        };
        if(!readable) Object.setPrototypeOf(cls, Object.create(inherits));
        Object.defineProperty(cls, 'name', {value: name, writable: false, enumerable: false, configurable: true});
        return {class: cls, privates: Object.assign({}, privates), define: Define.bind(cls.prototype)};
    };

    var SquarkBase = createClass('Squark', function() {
        Object.defineProperty(this, '__version__', {value: version, configurable: true, enumerable: true, writable: true});
    });
    
    var Squark = SquarkBase.class;
    var define = SquarkBase.define;

    // Based on https://easings.net/
    var easings = {
        'sine-in': function(x) {return 1-Math.cos((x*Math.PI)/2)},
        'sine': function(x) {return -(Math.cos(Math.PI*x)-1)/2},
        'sine-out': function(x) {return Math.sin((x*Math.PI)/2)},
        'quad-in': function(x) {return Math.pow(x,2)},
        'quad': function(x) {if(x<0.5)return 2*Math.pow(x,2);return 1-Math.pow(-2*x+2,2)/2},
        'quad-out': function() {return 1-Math.pow(1-x,2)},
        'cubic-in': function(x) {return Math.pow(x,3)},
        'cubic': function(x) {if(x<0.5)return 4*Math.pow(x,3);return 1-Math.pow(-2*x+2,3)/2},
        'cubic-out': function(x) {return 1-Math.pow(1-x,3)},
        'quart-in': function(x) {return Math.pow(x,4)},
        'quart': function(x) {if(x<0.5)return 8*Math.pow(x,4);return 1-Math.pow(-2*x+2,4)/2},
        'quart-out': function(x) {return 1-Math.pow(1-x,4)},
        'quint-in': function(x) {return Math.pow(x,5)},
        'quint': function(x) {if(x<0.5)return 16*Math.pow(x,5);return 1-Math.pow(-2*x+2,5)/2},
        'quint-out': function(x) {return 1-Math.pow(1-x,5)},
        'expo-in': function(x) {if(x==0)return 0;Math.pow(2,10*x-10)},
        'expo': function(x) {if(x==0)return 0;if(x==1)return 1;if(x<0.5)return Math.pow(2,20*x-10)/2;return (2-Math.pow(2,-20*x+10))/2},
        'expo-out': function(x) {if(x==1)return 1;return 1-Math.pow(2,-10*x)},
        'circ-in': function(x) {return 1-Math.sqrt(1-Math.pow(x,2))},
        'circ': function(x) {if(x<0.5)return (1-Math.sqrt(1-Math.pow(2*x,2)))/2;return (Math.sqrt(1-Math.pow(-2*x+2,2))+1)/2},
        'circ-out': function(x) {return Math.sqrt(1-Math.pow(x-1,2))},
        'back-in': function(x) {var c1=1.70158,c3=c1+1;return c3*x*x*x-c1*x*x},
        'back': function(x) {var c1=1.70158,c2=c1*1.525;if(x<0.5)return (Math.pow(2*x,2)*((c2+1)*2*x-c2))/2},
        'back-out': function(x) {var c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)},
        'elastic-in': function(x) {var c4=(2*Math.PI)/3;if(x==0)return 0;if(x==1)return 1;return -Math.pow(2,10*x-10)*sin((x*10-10.75)*c4)},
        'elastic': function(x) {var c5=(2*Math.PI)/4.5;if(x==0)return 0;if(x==1)return 1;if(x<0.5)return -(Math.pow(2,20*x-10)*Math.sin((20*x-11.125)*c5))/2;return (Math.pow(2,-20*x+10)*Math.sin((20*x-11.125)*c5))/2+1},
        'elastic-out': function(x) {var c4=(2*Math.PI)/3;if(x==0)return 0;if(x==1)return 1;return Math.pow(2,-10*x)*Math.sin((x*10-0.75)*c4)+1},
        'bounce-in': function(x) {return 1-this['bounce-out'](1-x)},
        'bounce': function(x) {if(x<0.5)return (1-this['bounce-out'](1-2*x))/2;return (1+this['bounce-out'](2*x-1))/2},
        'bounce-out': function(x) {var n1=7.5625,d1=2.75;if(x<1/d1)return n1*x*x;if(x<2/d1)return n1*(x-=1.5/d1)*x+0.75;if(x<2.5/d1)return n1*(x-=2.25/d1)*x+0.9375;return n1*(x-=2.625/d1)*x+0.984375},
        'linear': function(x) {return x},
    };
    
    for(var i = 0; i < addons.length; i++) addons[i].call(Squark.prototype, define, createClass, Define);
    if(!noGlobal) {
        if('Squark' in window) console.warn('`window.Squark` will be overriden!');
        Object.defineProperty(window, 'Squark', {value: new Squark(), configurable: true, enumerable: true, writable: false});
    }

    return Squark;
}, function(sdefine, createClass, Define) {
    'use strict';

    function random(min = 1, max = 0, d = Infinity) {
        var rand = window.Math.random() * (max - min) + min;
        if(isFinite(d)) rand = this.round(rand, d);
        return rand;
    }
    function degrees(v) {return v * (180/window.Math.PI)}
    function radians(v) {return v * (window.Math.PI/180)}
    function floor(v, d=0) {return window.Math.floor(v*(10**d)) / (10**d)}
    function round(v, d=0) {return window.Math.round(v*(10**d)) / (10**d)}
    function ceil(v, d=0) {return window.Math.ceil(v*(10**d)) / (10**d)}
    function add() {return Array.from(arguments).reduce(function(a,b) {return a+b},  0)}
    function sub() {return Array.from(arguments).reduce(function(a,b) {return a-b},  0)}
    function mult() {return Array.from(arguments).reduce(function(a,b) {return a*b},  1)}
    function div() {return Array.from(arguments).reduce(function(a,b) {return a/b},  1)}
    function root(num, exp) {return Math.pow(num, (1/exp))}
    function avg() {return this.add.apply(null, arguments)/arguments.length}
    
    var Math = Object.create(null);
    var define = Define.bind(Math);
    
    var fns = {random, degrees, radians, floor, round, ceil, add, sub, mult, div, root, avg};
    var arr = Object.getOwnPropertyNames(window.Math).filter(function(e) {return window.Math[e] instanceof Function});
    for(var i = 0;i < arr.length;i++) if(!(arr[i] in fns)) fns[arr[i]] = window.Math[arr[i]];
    fns = Object.getOwnPropertyNames(fns).sort(function(a, b) {return a.localeCompare(b)}).reduce(function(a, b) {a[b] = fns[b];return a}, {});
    arr = Object.getOwnPropertyNames(fns);
    for(var i = 0;i < arr.length;i++) define(arr[i], fns[arr[i]]);
    
    var numconst = {PI2: window.Math.PI*2};
    arr = Object.getOwnPropertyNames(window.Math).filter(function(e) {return !(window.Math[e] instanceof Function)});
    for(var i = 0;i < arr.length;i++) if(!(arr[i] in numconst)) numconst[arr[i]] = window.Math[arr[i]];
    numconst = Object.getOwnPropertyNames(numconst).sort(function(a, b) {return a.localeCompare(b)}).reduce(function(a, b) {a[b] = numconst[b];return a}, {});
    arr = Object.getOwnPropertyNames(numconst);
    for(var i = 0;i < arr.length;i++) define(arr[i]+'.get', function(){return numconst[arr[i]]});
    
    sdefine('Math', Math);
}, function(sdefine, createClass, Define) {
    'use strict';
    
    var Math = this.Math;
    
    var VectorBase = createClass('Vector', function(x, y = null, angleMode = 'degrees') {
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
    }, {privates: ['x', 'y', 'am']});
    var Vector = VectorBase.class;
    var _x = VectorBase.privates.x;
    var _y = VectorBase.privates.y;
    var anglemode = VectorBase.privates.am;
    var define = VectorBase.define;
    
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
    define('x.get', function(){if(!_x.has(this)) return null;return _x.get(this)});
    define('x.set', function(v){_x.set(this,Number(v))});
    define('y.get', function(){if(!_y.has(this)) return null;return _y.get(this)});
    define('y.set', function(v){_y.set(this,Number(v))});
    define('angleMode.get', function(){if(!anglemode.has(this)) return null;return anglemode.get(this)});
    define('angleMode.set', function(v){if(!['degrees', 'radians'].includes(v)) return;anglemode.set(this, v)});
    define('angle.get', function(){var a = Math.atan2(this.x, -this.y);if(a > 0)a=(Math.PI2 + a);a = a * 360 / (Math.PI2) % 360;if(this.angleMode === 'radians')return Math.radians(a);return a});
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
    define('toArray', function(){return [this.x, this.y]}, {enumerable: false});
    
    /* -------- Symbolic Methods -------- */
    define(Symbol.iterator, function*(){yield this.x;yield this.y});
    
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
}, function(sdefine, createClass) {
    'use strict';
    
    var Vector = this.Vector;
    
    var PolygonBase = createClass('Polygon', function() {
        var points = Array.from(arguments);
        if(points.length < 2 && points[0] instanceof Array && points[0].some(function(e){return typeof e !== 'number'})) points = points[0];
        if(points.length < 3) return this.privates.points.set(this, []);
        points = points.map(function(e){if(e instanceof Vector)return e;return new Vector(e)});
        this.privates.points.set(this, points);
    }, {privates: ['points']});
    var _points = PolygonBase.privates.points;
    var Polygon = PolygonBase.class;
    var define = PolygonBase.define;
    
    /* -------- Constructor Properties -------- */
    define('clone', function(){return new this.constructor(this.points.map(function(e){return e.clone()}))});
    
    /* -------- Accessor Properties -------- */
    define('center.get', function(){return Vector.average.call(Vector, this.points)});
    define('center.set', function(v){if(!(v instanceof Vector))return;var offset = v.clone().sub(this.center);this.points.forEach(function(e){e.add(offset)})});
    define('points.get', function(){if(!_points.has(this))return null;return _points.get(this)});
    define('points.set', function(){if(arguments.length < 2)return _points.set(this, []);var vecs = Array.from(arguments).map(function(e){if(!(e instanceof Vector))return new Vector(e);return e});_points.set(this, vecs)});
    
    /* -------- Utility Methods -------- */
    define('rotate.self', function(angle, angleMode) {
        if(!['degrees', 'radians'].includes(angleMode)) angleMode = 'degrees';
        var center = this.center;
        for(var i = 0; i < this.points.length; i++) {
            var vec = this.points[i];
            var cache = vec.angleMode;
            vec.angleMode = angleMode;
            vec.sub(center).rotate(angle).add(center);
            vec.angleMode = cache;
        }
    });
    
    /* -------- Symbolic Methods -------- */
    define(Symbol.iterator, function*(){for(var i = 0; i < this.points.length; i++) yield this.points[i]});
    
    sdefine('Polygon.get', function(){return Polygon});
}, function(sdefine, createClass) {
    'use strict';
    
    var Polygon = this.Polygon;
    var Vector = this.Vector;
    
    function L2L(vec1, vec2, vec3, vec4) {
        vec1 = new Vector(vec1);vec2 = new Vector(vec2);
        vec3 = new Vector(vec3);vec4 = new Vector(vec4);
        var x1 = vec1.x, y1 = vec1.y;var x2 = vec2.x, y2 = vec2.y;
        var x3 = vec3.x, y3 = vec3.y;var x4 = vec4.x, y4 = vec4.y;
        var d1 = (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1),
            d2 = x1-x3, d3 = y1-y3;
        var uA = ((x4-x3)*d3 - (y4-y3)*d2) / d1;
        var uB = ((x2-x1)*d3 - (y2-y1)*d2) / d1;
        if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true;
        return false;
    }
    function P2p(vertices, point) {
        vertices = Array.from(vertices).map(function(e){return new Vector(e)});
        point = new Vector(point);
        var px = point.x, py = point.y;
        var collision = false;
        var next = 0;
        for(var i = 0; i < vertices.length; i++) {
            next = i+1;
            if(next == vertices.length) next = 0;
            var vc = vertices[i];
            var vn = vertices[next];
            var c1 = ((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py));
            var c2 = (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x);
            if(c1 && c2) collision = !collision;
        }
        return collision;
    }
    function P2L(vertices, lpoint1, lpoint2) {
        vertices = Array.from(vertices).map(function(e){return new Vector(e)});
        lpoint1 = new Vector(lpoint1), lpoint2 = new Vector(lpoint2);
        var x1 = lpoint1.x, y1 = lpoint1.y;
        var x2 = lpoint2.x, y2 = lpoint2.y;
        var next = 0;
        for(var i = 0; i < vertices.length; i++) {
            next = i+1;
            var hit = L2L(lpoint1, lpoint2, vertices[i], vertices[next]);
            if(hit) return true;
        }
        return false;
    }
    function P2P(p1, p2) {
        p1 = Array.from(p1).map(function(e){return new Vector(e)});
        p2 = Array.from(p2).map(function(e){return new Vector(e)});
        var next = 0;
        for(var i = 0; i < p1.length; i++) {
            next = i+1;
            if(next == p1.length) next = 0;
            var collision = P2L(p2, p1[i], p1[next]);
            if(collision) return true;
            collision = P2p(p1, p2[i]);
            if(collision) return true;
        }
        return false;
    }
    
    var BodyBase = createClass('Body', function(opts) {
        if(typeof opts !== 'object') opts = {};
        if(!(opts.hitArea instanceof Polygon)) opts.hitArea = new Polygon(new Vector(-1, -1), new Vector(1, -1), new Vector(1, 1), new Vector(-1, 1));
        if(!(opts.position instanceof Vector)) opts.position = new Vector(opts.position);
        opts.hasPhysics = Boolean(opts.hasPhysics);
        this.privates.opts.set(this, opts);
    }, {privates: ['opts']});
    var Body = BodyBase.class;
    var _opts = BodyBase.privates.opts;
    var define = BodyBase.define;
    
    /* -------- Accessor Properties -------- */
    define('position.get', function(){if(!_opts.has(this))return null;return _opts.get(this).position});
    define('position.set', function(v){if(!(v instanceof Vector))v = new Vector(v);_opts.get(this).position = v});
    define('hitArea.get', function(){if(!_opts.has(this))return null;return _opts.get(this).hitArea});
    define('hitArea.set', function(v){if(!(v instanceof Polygon) || v.points.length < 3)return;_opts.get(this).hitArea = v});
    define('hasPhysics.get', function(){if(!_opts.has(this))return null;return _opts.get(this).hasPhysics});
    
    /* -------- Utility Methods -------- */
    define('move', function(where, duration, easing) {
        where = new Vector(where);

    });
    define('hasCollide', function(body) {
        if(!(body instanceof this.constructor)) return false;
        var p1 = this.position.clone();
        var p2 = body.position.clone();
        var poly1 = this.hitArea.clone().center.add(p1);
        var poly2 = body.hitArea.clone().center.add(p2);
        return P2P(poly1.points, poly2.points);
    });
    
    sdefine('Body.get', function(){return Body});
});