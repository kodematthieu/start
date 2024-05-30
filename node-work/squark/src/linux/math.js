const {Command} = require('commander');
const cp = require('child_process');
const dns = require('dns');
const ansiEscapes = require('ansi-escapes');
const cmd = module.exports = new Command();

cmd.description('Initiate math interpreter.');
cmd.option('-s, --show', 'Show solution');
cmd.allowUnknownOption(false);
cmd.action(async function(destination, opts) {
    const plen = 13;
    const mlen = process.stdout.columns - plen;
    let tmp = '';
    let curpos = tmp.length + plen;
    let exit = false;
    update();
    stdcin.setRawMode(true);
    stdcin.setEncoding('Utf8');
    stdcin.on('data', chr => {
        if(chr === '\x03' || chr === '\x04') {
            if(exit || chr === '\x04') return stdcin.pause();
            console.log('\n(To exit, press Ctrl+C again or Ctrl+D)');
            exit = true;
            return update();
        }
        else exit = false;
        if(chr === '\x7F') {
            tmp = tmp.split('');
            delete tmp[curpos-plen-1];
            tmp = tmp.filter(e => !!e).join('');
            curpos = Math.max(plen, curpos - 1);
        }
        else if(chr === '\x7F\x7F') {
            tmp = tmp.split('');
            tmp.splice(0, curpos-plen);
            tmp = tmp.filter(e => !!e).join('');
            curpos = plen;
        }
        else if(chr === '\x1B[A') curpos = plen;
        else if(chr === '\x1B[B') curpos = tmp.length+plen;
        else if(chr === '\x1B[H') curpos = plen;
        else if(chr === '\x1B[F') curpos = tmp.length+plen;
        else if(chr === '\x1B[C') curpos = Math.min(curpos+1, tmp.length+plen);
        else if(chr === '\x1B[D') curpos = Math.max(curpos-1, plen);
        else if(chr === '\r' || chr === '\n') {
            stdcout.write(ansiEscapes.cursorTo(tmp.length+plen));
            stdcout.write(chalk.bgWhite.black.dim('%') + '\n');
            stdcout.write(parseString(tmp) + '\n');
            tmp = '';
            curpos = plen;
            update();
            return;
        }
        else if(tmp.length + chr.length <= mlen) {
            tmp = tmp.split('');
            tmp.splice(curpos-plen, 0, ...chr.split(''));
            tmp = tmp.join('');
            curpos += chr.length;
        }
        update();
        // console.log([chr]);
    });
    function update() {
        stdcout.write(ansiEscapes.cursorHide + ansiEscapes.cursorLeft + ansiEscapes.eraseLine);
        const time = Array.from(TimeNow.string).map(e => chalk.green(e));
        const frt = chalk.cyanBright(`[${time.join(chalk.cyanBright.bold(':'))}] `) + chalk.yellow.bold('>');
        stdcout.write(frt + ' ' + tmp + ansiEscapes.cursorTo(curpos) + ansiEscapes.cursorShow);
    }
});
function parseString(txt) {
    let tokens = [];
    lexer: {
        let tid = '';
        let tmp = [];
        for(let chr of txt) {
            if(chr === '$') {
            // console.log([chr]);
                if(tid === '') {
                    tid = 'function';
                    tmp.push(chr);
                }
                else tmp.push(chr);
            }
            else if(/[a-z]/i.test(chr)) {
                if(tid === '') {
                    tid = 'variable';
                    tmp.push(chr);
                }
                else tmp.push(chr);
            }
            else if(/[0-9]/.test(chr)) {
                if(tid === '') {
                    tid = 'constant';
                    tmp.push(chr);
                }
                else tmp.push(chr);
            }
            else if(/[\+\-\/\*\^\%\=]/.test(chr)) {
                if(tid !== '') {
                    tokens.push({id: tid, value: tmp.join('')});
                    tid = '';tmp = [];
                }
                tokens.push({id: 'operator', value: chr});
            }
            else if(/[\(\)\[\]\{\}]/.test(chr)) {
                if(tid !== '') {
                    tokens.push({id: tid, value: tmp.join('')});
                    tid = '';tmp = [];
                }
                tokens.push({id: 'scope', value: chr});
            }
            else if(' ' === chr) {
                if(tid !== '') tokens.push({id: tid, value: tmp.join('')});
                tid = '';tmp = [];
            }
            else return `Unexpected character '${chr}'`;
        }
        if(tmp.length !== 0 && tid !== '') {
            tokens.push({id: tid, value: tmp.join('')});
            tid = '';tmp = [];
        }
        for(let e of tokens) {
            if(e.id === 'constant' && isNaN(e.value)) return `Invalid number format '${e.value}'`
        }
    }
    let tree = [];
    parseTree: {
        let slabel = 0;
        for(let p,c,n,i = 0; i < tokens.length;i++,p=tokens[i-1],c=tokens[i],n=tokens[i+1]) {
            
        }
    }
    console.log(tokens);
    return '';
}
