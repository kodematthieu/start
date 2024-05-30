module.exports = [printt, printb, load];
const util = require('util');
const ansiEscapes = require('ansi-escapes');
const {stdin, stdout} = process;
const ESC = '\x1B', BACK = '\x7F', ENTER = ['\n', '\r'];
const ARROW = ['A','B','C','D'].map(e => ESC + '[' + e);

function printb(text, opts) {
  text = text.toUpperCase().replace(/\x1B\[\d+m/ig, s1 => s1.toLowerCase());
  let copy = text;
  let ctext = text.replace(/\x1B\[\d+m/g, '');
  text = `>>${`<< ${ctext} >>`.padSide(process.stdout.columns-4, '=')}<<`;
  text = text.replace(/(<|>)+/g, s1 => chalk.grey.bold(s1)).replace(/=+/g, s1 => chalk.grey.dim.strikethrough(s1));
  text = text.replace(ctext, s1 => chalk.cyan.bold.dim(copy.replace(/\s+/g, s2 => chalk.grey.strikethrough(s2))));
  stdout.write(text);
}
function printt(...txt) {
  txt = ' ' + txt.map(e => typeof e !== 'string' ? util.inspect(e, {colors: true}) : e).join(' ');
  const time = Array.from(TimeNow.string).map(e => chalk.green(e));
  const frt = chalk.cyanBright(`[${time.join(chalk.cyanBright.bold(':'))}] `) + chalk.yellow.bold('>');
  stdout.write(frt + txt);
}

function load(text) {
  const ascii = '\u25e2\u25e3\u25e4\u25e5'.split('');
  let i = 0;
  stdout.write(ansiEscapes.cursorHide);
  let anim = setInterval(function() {
    stdout.write(ansiEscapes.eraseLine + ansiEscapes.cursorLeft);
    stdout.write(chalk`{yellow.bold [${ascii[i++]}]} ${text}`);
    i = i % ascii.length;
  }, 1000/ascii.length);
  return {
    done: text => new Promise(res => setTimeout(function() {
      clearInterval(anim);
      stdout.write(ansiEscapes.eraseLine + ansiEscapes.cursorLeft);
      stdout.write(chalk`{green.bold [\u2713]} ${text}\n`);
      stdout.write(ansiEscapes.cursorShow);
      res(true);
    }, 1000/ascii.length)),
    fail: text => new Promise(res => setTimeout(function() {
      clearInterval(anim);
      stdout.write(ansiEscapes.eraseLine + ansiEscapes.cursorLeft);
      stdout.write(chalk`{red.bold [\u2715]} ${text}\n`);
      stdout.write(ansiEscapes.cursorShow);
      res(false);
    }, 1000/ascii.length))
  };
}