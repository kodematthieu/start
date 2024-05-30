const os = require('os');

const TimeNow = new Proxy({}, {
  get: (object, target) => {
    const date = new Date();
    const time = {t: +date,h: date.getHours(), m: date.getMinutes(), s: date.getSeconds(), ms: date.getMilliseconds()};
    switch(target) {
      case 't': case 'timestamp': return time.t;
      case 'h': case 'hour': return time.h;
      case 'm': case 'minute': return time.m;
      case 's': case 'second': return time.s;
      case 'ms': case 'millisecond': return time.ms;
      case 'string': return new Proxy(object, {
        get: (object, target) => {
          const date = new Date();
          const time = {t: +date,h: date.getHours(), m: date.getMinutes(), s: date.getSeconds(), ms: date.getMilliseconds()};
          switch(target) {
            case 't': case 'timestamp': return time.t;
            case 'h': case 'hour': return (time.h < 10 ? '0' : '')+time.h;
            case 'm': case 'minute': return (time.m < 10 ? '0' : '')+time.m;
            case 's': case 'second': return (time.s < 10 ? '0' : '')+time.s;
            case 'ms': case 'millisecond': return time.ms;
            case Symbol.iterator: return function*(){yield (time.h < 10 ? '0' : '')+time.h;yield (time.m < 10 ? '0' : '')+time.m;yield (time.s < 10 ? '0' : '')+time.s};
            default: object[target];
          }
        }
      });
      case Symbol.iterator: return function*(){yield time.h;yield time.m;yield time.s};
      default: return object[target];
    }
  }
});

module.exports = {
  chalk: require('chalk'),
  $HOME: os.homedir(),
  $PREFIX: process.env.PREFIX,
  $PWD: process.env.PWD,
  stdcout: process.stdout,
  stdcin: process.stdin,
  TimeNow
};