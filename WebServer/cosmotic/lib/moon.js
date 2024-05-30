const Util = require('./Util');

const Moon = function Moon(...arguments) {
    return this;
};
Object.setPrototypeOf(Moon, Object.create(null));
let define = Util.define(Moon);
define('timeBased.get', function() {
    return ['phase'];
});
define('geoBased.get', function() {
    return [];
});

define = Util.define(Moon.prototype);

define('phase', function(time = Date.now(), string = false) {
    let c, e, jd, phase, year, month, day;
    time = new Date(time);
    c = e = jd = phase = 0;
    year = time.getFullYear();
    month = time.getMonth();
    day = time.getDate();
    if(month < 3) {
        year -= 1;
        month += 12;
    }
    month += 1;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    phase = parseInt(jd);
    jd -= phase;
    phase = jd * 8;
    if(phase >= 8) phase = 0;
    if(!Boolean(string)) return phase;
    switch(Math.round(phase)) {
        case 0: return 'New Moon';
        case 1: return 'Waxing Crescent Moon';
        case 2: return 'Quarter Moon';
        case 3: return 'Waxing Gibbous Moon';
        case 4: return 'Full Moon';
        case 5: return 'Waning Gibbous Moon';
        case 6: return 'Last Quarter Moon';
        case 7: return 'Waning Crescent Moon';
    }
});


module.exports = Moon;