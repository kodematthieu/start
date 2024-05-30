const Util = require('./Util');
const Moon = require('./moon');

const CosmoticTime = new WeakMap();
const CosmoticLocation = new WeakMap();
const Cosmotic = function Cosmotic(...arguments) {
    if(!('init' in this)) {
        let err = new TypeError('Illegal constructor');
        throw err;
    }
    this.init(...arguments);
    return this;
};
Object.setPrototypeOf(Cosmotic, Object.create(null));
const define = Util.define(Cosmotic.prototype);
define('Moon', new Moon());
define('init', function(time = Date.now(), geolocation = {}) {
    this.timeTravel(time);
    this.geoTravel(geolocation);
    return this;
});
define('time.get', function(){return CosmoticTime.get(this)});
define('location.get', function(){return CosmoticLocation.get(this)});
define('timeTravel', function(time = Date.now()) {
    CosmoticTime.set(this, new Date(time));
    this.Moon.timeTravel(this.time);
    return this;
});
define('geoTravel', function(lat, lon) {
    CosmoticTime.set(this, new Date(time));
    return this;
});
console.log(Object.getOwnPropertyNames(Moon.prototype));

module.exports = new Cosmotic();