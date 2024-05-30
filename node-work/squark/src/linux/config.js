const {Command} = require('commander');
const cp = require('child_process');
const ansiEscapes = require('ansi-escapes');
const path = require('path');
const fs = require('fs');
const os = require('os');
const $CACHE = path.resolve($HOME, '.cache/squark');
const config = require($CACHE+'/config.json');
const cmd = module.exports = new Command();

cmd.description('Configure the CLI');
($ => {
  const cmd = $.command('set <key>');
  
  cmd.usage('<key>=<value> [option]');
  cmd.description('Set value to the config file');
  cmd.action(function(rawArg) {
    if(!(/^(.*?)=(.*)$/).test(rawArg)) return this.help({error: true});
    let [key, val] = rawArg.match(/^(.*?)=(.*?)$/).slice(1, 3);
    val = isNaN(val) || !val ? val : Number(val);
    val = (t => val in t?t[val]:val)({undefined:undefined,null:null,true:true,false:false});
    if(!config.hasOwnProperty(key)) return this.emit('error', `No property '${key}' found in config.json`);
    config[key] = val;
    fs.writeFileSync($HOME+'/.cache/squark/config.json', JSON.flat(config).stringify(null, 2));
  });
  cmd.on('error', msg => $.emit('error', cmd.name() + ': ' + msg));
})(cmd);