const {Command} = require('commander');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const cmd = module.exports = new Command();
const $CACHE = path.resolve($HOME, '.cache/squark');
const {file: fileConfig} = JSON.unflat(require($CACHE+'/config.json'));

cmd.arguments('<path> [args...]');
cmd.description('Execute a script.', {'path': 'Path to designated file', 'args': 'Arguments to be passed'});
cmd.option('--reload', 'Reload if change was made');
cmd.option('-v, --verbose', 'Set execution to verbose');
cmd.option('-t, --type <type>', 'The file type to be executed', 'auto');
cmd.option('-w, --watch <watchlist>', 'Files to detect change from', (v, p) => p.concat(v.split(',')), []);
cmd.allowUnknownOption(true);
cmd.action(function(filepath, args, opts) {
  filepath = path.resolve(process.cwd(), filepath.replace(/^\~\//, $HOME));
  if(!fs.existsSync(filepath)) return this.emit('error', `No such file or directory: '${filepath}'`);
  if(fs.lstatSync(filepath).isDirectory()) return this.emit('error', `'${filepath}' is a directory`);
  if(!(opts.type in fileConfig.ext)) opts.type = 'auto';
  if(opts.type === 'auto') {
    opts.type = path.extname(filepath).slice(1, Infinity);
    if(!Object.values(fileConfig.ext).map(e => e.split('|')).flat().includes(opts.type)) return this.emit('error', `Unsupported file extension '.${opts.type}'`);
    opts.type = opts.type;
  }
  else opts.type = fileConfig.ext[opts.type].split('|')[0];
  opts.type = Object.keys(fileConfig.ext).find(e => fileConfig.ext[e].split('|').includes(opts.type));
  if(!opts.reload) return exec.call(this, filepath, opts.type, opts, args);
  
});


async function exec(file, type, flags, args = []) {
  let child, data;
  console.log(args);
  if(fileConfig.run[type].startsWith('compile:')) {
    let cmd = fileConfig.run[type].slice(8, Infinity);
    if(!fs.existsSync(path.resolve($PREFIX, 'bin/'+cmd))) return this.emit('error', `No command '${cmd}' found`);
    await compile.call(this, cmd, file, [file, !!flags.verbose ? '-v' : '', '-o', $CACHE + `/${type}.out`]);
    fs.chmodSync($CACHE + `/${type}.out`, 0o100);
    child = cp.spawn($CACHE + `/${type}.out`, args, {stdio: 'inherit'});
  }
  else {
    let cmd = fileConfig.run[type];
    if(!fs.existsSync(path.resolve($PREFIX, 'bin/'+cmd))) return this.emit('error', `'${cmd}' package not installed`);
    child = cp.spawn(cmd, [file, ...args], {stdio: 'inherit'});
  }
  printb('start program');
  child.on('exit', () => (stdcout.write('\n'),printb('end program')));
  
}
function compile(cmd, file, args) {
  let anim = load(`Compiling '${file}'...`);
  let child = cp.spawn(cmd, args);
  child.stdout.setEncoding('Utf8');
  child.stderr.setEncoding('Utf8');
  return new Promise((res, rej) => {
    let err = '';
    child.on('close', code => {if(code == 0)return anim.done('Compilation done!').then(res);anim.fail(err).then(() => (res(err), process.exit(1)))});
    child.stderr.on('data', data => err += data);
  });
}
