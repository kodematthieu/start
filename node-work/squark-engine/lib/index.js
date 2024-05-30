var util = require('./util'),
    createClass = util.createClass,
    Define = util.define;
var version = require('../package').version;

var __squark__ = createClass('Squark', function() {Object.defineProperty(this, '__version__', {value: version, configurable: true, enumerable: true, writable: true})}),
    Squark = __squark__.class,
    define = __squark__.define;

require('./Math').call(Squark.prototype, define, createClass, Define);
require('./Vector').call(Squark.prototype, define, createClass, Define);

module.exports = new Squark();