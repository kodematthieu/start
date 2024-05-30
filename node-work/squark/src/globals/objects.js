process.stdout.curpos = function curpos() {
  const cp = require('child_process');
  const ret = cp.execSync(`bash ${__dirname}/curpos.sh`).toString('utf8');
  return JSON.parse(ret);
};

String.prototype.padSide = function(width, chr) {
  const arm = width-this.length;
  const left = Math.ceil(arm/2);
  const right = Math.floor(arm/2);
  chr += '';
  return chr.padStart(left, chr)+this+chr.padEnd(right, chr);
};
String.prototype.dist = function(b) {
  let a = this;
  let al = a.length;
  let bl = b.length;
  let weight, stemp, ltemp;
  const matrix = [];
  matrix[0] = [];
  if(al < bl) {
    stemp = a; a = b; b = stemp;
    ltemp = al; al = bl; bl = ltemp;
  }
  for(let i = 0; i < bl+1; i++) matrix[0][i] = i;
  for(let i = 1; i < al+1; i++) {
    matrix[i] = [];
    matrix[i][0] = i;
    for(let j = 1; j < bl+1; j++) {
      weight = (a.charAt(i-1) == b.charAt(j-1)) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i-1][j]+1,
        matrix[i][j-1]+1,
        matrix[i-1][j-1] + weight
      ); 
    }
  }
  return matrix[al][bl];
};
JSON.unflat = function(data) {
  if(typeof data !== 'object' || Array.isArray(data)) return data;
  let result = {}, cur, prop, idx, last, temp;
  for(let p in data) {
    cur = result, prop = "", last = 0;
    do {
      idx = p.indexOf(".", last);
      temp = p.substring(last, idx !== -1 ? idx : undefined);
      cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
      prop = temp;
      last = idx + 1;
    } while(idx >= 0);
    cur[prop] = data[p];
  }
  return result[""];
};
JSON.flat = function(data) {
    let result = {};
    function recurse(cur, prop) {
      if(typeof cur !== 'object') result[prop] = cur;
      else if(Array.isArray(cur)) {
        for(var i=0, l=cur.length; i<l; i++) recurse(cur[i], prop ? prop+"."+i : ""+i);
        if(l == 0) result[prop] = [];
      }
      else {
        let isEmpty = true;
        for(let p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop+"."+p : p);
        }
        if(isEmpty) result[prop] = {};
      }
    }
    recurse(data, "");
    for(let prop of Object.getOwnPropertyNames(JSON)) {
      Object.defineProperty(result.__proto__, prop, {value: JSON[prop].bind(null, result), enumerable: false, configurable: true});
    }
    return result;
};