const {Command} = require('commander');
const fs = require('fs');

const squark = new Command();

squark.version(require('../../package.json').version);
squark.description('Utility command line application');
squark.option('-v, --verbose', 'Explain what is being done');
for(let cname of fs.readdirSync(__dirname).filter(e => e !== 'index.js')) {
  let cmd = require('./'+cname);
  cmd.name(cname.replace(/\.js$/, ''));
  squark.addCommand(cmd);
  cmd.configureOutput({outputError: (msg, write) => write(msg.replace(/^error\:/, `${squark.name()}: ${cmd.name()}:`))});
  cmd.on('error', msg => {
    cmd._displayError(1, `${squark.name()}.${cmd.name()}`, 'error: '+msg);
  });
}

squark.on('option:verbose', () => process.env.VERBOSE = squark.opts().verbose);
squark.on('command:*', ([ucmd]) => {
  console.error(`squark: Unknown command '${ucmd}'`);
  const acmds = squark.commands.map(cmd => cmd.name());
  let similar = acmds.map(e=>[e,ucmd.dist(e)]).sort((a,b)=>a[1]-b[1]);
  similar = similar.filter(e=>e[1]<4).reduce((a,b)=>{a[b[0]]=b[1];return a}, {});
  if(Object.keys(similar).length > 0) {
    console.info(`\nMost similar command${Object.keys(similar).length > 1 ? 's' : ''}:`);
    for(let i = 0; i < Object.keys(similar).length; i++) console.info(chalk`  {dim.grey [-${i+1}-]}  ${Object.keys(similar)[i]}`);
    console.info('\n');
  }
  process.exit(1);
});

module.exports = squark.parse.bind(squark);
module.exports();