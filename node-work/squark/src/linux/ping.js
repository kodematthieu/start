const {Command} = require('commander');
const cp = require('child_process');
const dns = require('dns');
const ansiEscapes = require('ansi-escapes');
const cmd = module.exports = new Command();

cmd.arguments('<destination>');
cmd.description('Ping a web server.', {destination: 'The destination to the web server.'});
cmd.option('-c, --count <count>', 'Amount of iterations');
cmd.option('-i, --interval <interval>', 'Delay in milliseconds before the next iteration');
cmd.option('-t, --timeout <timeout>', 'Timeout in milliseconds');
cmd.option('-T, --ttl <ttl>', 'Amount of time that a packet is set to exist inside a network before being discarded by a router');
cmd.option('-r, --raw', 'Output only the ping');
cmd.allowUnknownOption(false);
cmd.action(async function(destination, opts) {
  opts.count = !opts.count ? Infinity : opts.count;
  opts.interval = !opts.interval ? 500 : opts.interval;
  opts.timeout = !opts.timeout ? 10000 : opts.timeout;
  
  let ip = await new Promise((res, rej) => dns.lookup(destination, (err, addr) => err ? rej(err) : res(addr))).catch(e => e);
  if(ip instanceof Error) return this.emit('error', `Unknown host '${destination}'`);
  destination = ip;
  stdcout.write(ansiEscapes.cursorHide);
  printb('start ping');
  stdcin.on('data', ch => /^(\x03)$/.test(ch) ? process.exit(0) : null);
  process.on('exit', () => (printb('end ping'),stdcout.write(ansiEscapes.cursorShow)));
  return ping.call(this, destination, 0);
  function ping(destination, iter) {
    const child = cp.spawn('ping', ['-c', '1', destination], {stdio: 'pipe'});
    const start = Date.now();
    let data = '', err = '', timedout, timer = setTimeout(() => {timedout = true;child.kill('SIGINT')}, opts.timeout);
    stdcin.resume().setRawMode(true);
    child.stdout.setEncoding('Utf8');
    child.stderr.setEncoding('Utf8');
    child.stdout.on('data', chunk => data += chunk+'\n');
    child.stderr.on('data', chunk => err += chunk+'\n');
    child.stdout.on('close', code => {
      clearTimeout(timer);
      let res;
      if(!!err) {
        if(err.startsWith('ping:')) return this.emit('error', err);
        if(err.startsWith('connect:')) {
          if(iter == 0) return this.emit('error', err.split('\n').filter(e => !!e)[0].slice(9, Infinity));
          res = chalk.red.bold.dim(err.split('\n').filter(e => !!e)[0].slice(9, Infinity));
        }
        else return console.log(err);
      }
      else if(!timedout) {
        data = data.split('\n').filter(e => !!e).pop();
        data = +data.match(/^(\S+\s+){3}(\d+\.\d+)/)[2];
        res = (data >= 500 ? chalk.red : data > 100 ? chalk.yellow : chalk.green)(data)+chalk.cyan(' ms');
      }
      else {
        if(iter == 0) return this.emit('error', 'Connection Timeout');
        res = chalk.bold.dim.red.strikethrough('Timeout');
      }
      if(!opts.raw) printt(chalk`{grey.dim -${iter+1}-} {cyan Ping} from {grey.underline ${destination}}{cyanBright :}`, res, '\n');
      else stdcout.write(res.replace(/\x1b\[\d+m/g, '')+'\n');
      reload.call(this);
      function reload() {
        if(Date.now()-start < opts.interval) return setTimeout(() => reload.call(this), 1);
        if(iter+1 < opts.count) ping.call(this, destination, iter+1);
      }
    });
  }
});