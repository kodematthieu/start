//Result Containers
const resultOne = document.querySelector('.result1');
const resultTwo = document.querySelector('.result2');

//Numbers
const zero = document.querySelector('.zeroBtn');
const one = document.querySelector('.oneBtn');
const two = document.querySelector('.twoBtn');
const three = document.querySelector('.threeBtn');
const four = document.querySelector('.fourBtn');
const five = document.querySelector('.fiveBtn');
const six = document.querySelector('.sixBtn');
const seven = document.querySelector('.sevenBtn');
const eight = document.querySelector('.eightBtn');
const nine = document.querySelector('.nineBtn');
const point = document.querySelector('.decimalBtn');

//Clear, More and Delete
const clear = document.querySelector('.clrBtn');
const del = document.querySelector('.delBtn');
const moreBtn = document.querySelector('.moreBtn');

//Operations
const plus = document.querySelector('.plusBtn');
const minus = document.querySelector('.minusBtn');
const times = document.querySelector('.timesBtn');
const divide = document.querySelector('.divideBtn');
const equal = document.querySelector('.equalBtn');

//More Section
const more = document.querySelector('.more');
const parenOpen = document.querySelector('.more > .parenOpen');
const parenClose = document.querySelector('.more > .parenClose');

//Calculate
let output1 = new String();
let output2 = new String();
let input = new String();
let paren0 = false;
let paren1 = false;
let dot = false;

//Click Events for Clear, More and Deletes Buttons
clear.addEventListener("click", () => {
  output1 = "";
  output2 = "";
  paren0 = false;
  paren1 = false;
  resultOne.value = output1;

  input = "";
});
moreBtn.addEventListener("click", () => {
  if(more.style.display === "none" || more.style.display === "") {
    more.style.display = "block";
  }
  else {
    more.style.display = "none";
  }
});
del.addEventListener("click", () => {
  var splited = output1.split("");
  delete splited[splited.length - 1];
  output1 = splited.join("");
  splited = output2.split("");
  delete splited[splited.length - 1];
  output2 = splited.join("");
  paren0 = false;
  paren1 = false;
  resultOne.value = output1;
});

//Click Events for Digits Buttons
nine.addEventListener("click", () => {
  output1 += "9";
  output2 += paren1 ? "*9" : "9";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
eight.addEventListener("click", () => {
  output1 += "8";
  output2 += paren1 ? "*8" : "8";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
seven.addEventListener("click", () => {
  output1 += "7";
  output2 += paren1 ? "*7" : "7";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
six.addEventListener("click", () => {
  output1 += "6";
  output2 += paren1 ? "*6" : "6";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
five.addEventListener("click", () => {
  output1 += "5";
  output2 += paren1 ? "*5" : "5";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
four.addEventListener("click", () => {
  output1 += "4";
  output2 += paren1 ? "*4" : "4"
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
three.addEventListener("click", () => {
  output1 += "3";
  output2 += paren1 ? "*3" : "3";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
two.addEventListener("click", () => {
  output1 += "2";
  output2 += paren1 ? "*2" : "2";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
one.addEventListener("click", () => {
  output1 += "1";
  output2 += paren1 ? "*1" : "1";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
zero.addEventListener("click", () => {
  output1 += "0";
  output2 += paren1 ? "*0" : "0";
  paren0 = true;
  paren1 = false;
  resultOne.value = output1;
});
point.addEventListener("click", () => {
  if(!dot) {
    output1 += ".";
    output2 += ".";
    paren0 = false;
    paren1 = false;
    dot = true;
  }
  resultOne.value = output1;
});
plus.addEventListener("click", () => {
  output1 += "+";
  output2 += "+";
  paren0 = false;
  paren1 = false;
  dot = false;
  resultOne.value = output1;
});
minus.addEventListener("click", () => {
  output1 += "-";
  output2 += "-";
  paren0 = false;
  paren1 = false;
  dot = false;
  resultOne.value = output1;
});
times.addEventListener("click", () => {
  output1 += "×";
  output2 += "*";
  paren0 = false;
  paren1 = false;
  dot = false;
  resultOne.value = output1;
});
divide.addEventListener("click", () => {
  output1 += "÷";
  output2 += "/";
  paren0 = false;
  paren1 = false;
  dot = false;
  resultOne.value = output1;
});
parenOpen.addEventListener("click", () => {
  output1 += "(";
  output2 += paren0 ? "*(" : "(";
  paren0 = false;
  paren1 = false;
  dot = false;
  resultOne.value = output1;
});
parenClose.addEventListener("click", () => {
  output1 += ")";
  output2 += ")";
  paren0 = true;
  paren1 = true;
  dot = false;
  resultOne.value = output1;
});
equal.addEventListener("click", () => {
  if(output2 !== "") {
    output1 = "";
    dot = false;
    resultOne.value = eval(output2) === Infinity ? "Math Error!" : eval(output2);
  }
  output2 = "";
});
setInterval(() => {
  resultTwo.value = eval(output2) === Infinity ? "Math Error!" : eval(output2) || "0";
}, 0);
