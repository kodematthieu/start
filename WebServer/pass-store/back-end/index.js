const {promise: {probe: ping}} = require('ping');
const colors = require('colors');
const Util = require('./Util');
const server = require('./server');

Util.def('print', (...data) => {
  const regex = {
    version: /^\s*\d+(\.\d+){1,}[a-z\-\s]*$/i,
    text: /^[a-z\-]+$/i,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  };
  const maxchar = data.map(e => e[0].length).reduce((a, b) => Math.max(a,b));
  for(let [name, value] of data) {
    let color = null;
    if(regex.text.test(value)) color = colors.cyan;
    if(regex.version.test(value)) color = colors.green;
    if(regex.url.test(value)) color = colors.underline.grey;
    name = name.padEnd(maxchar, ' ');
    value = regex.version.test(value) ? 'v'+value : value;
    value = color ? color(value) : value;
    Util.print(`${name} ${':'.brightMagenta} ${value}`);
  }
});
ping('www.google.com').then(async ({time}) => Util.def('print', [
  ['Platform', process.platform],
  ['Engine Name', process.release.name],
  ['Engine Version', process.versions[process.release.name]],
  ['Pack Name', process.env.npm_package_name],
  ['Pack Version', process.env.npm_package_version],
  ['Ping Check', (time <= 100 ? colors.green : time <= 500 ? colors.yellow : colors.red)(`${time !== 'unknown' ? time + 'ms' : 'No Internet Connection'}`)],
  ['Server Address', await server.address]
]));