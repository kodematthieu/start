class Calculator {
  constructor(bol) {
    this.comma = bol || false;
  }
  eval(str) {
    this.str = null;
    if(str.match("×") && str.match("÷")) {
      this.str = str.replace(/×/g, "*").replace(/÷/g, "/");
    }
    else if(str.match("×")) {
      this.str = str.replace(/×/g, "*");
    }
    else if(str.match("÷")) {
      this.str = str.replace(/÷/g, "/");
    }
    else if(!str.match("×") && !str.match("÷")) {
      this.str = str;
    }
    else {
      return new Error("Syntax Error!");
    }
    this.result = eval(this.str);
    return eval(this.str);
  }
}
