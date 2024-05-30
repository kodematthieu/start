const cosmotic = require('./lib');

cosmotic.timeTravel(Date.now())
// cosmotic.timeTravel(new Date(100, 10, 25))
console.log(cosmotic.Moon.phase(true));

console.log();