var _Math = Math;

function random(min = 1, max = 0, d = Infinity) {
    var rand = Math.random() * (max - min) + min;
    if(isFinite(d)) rand = this.round(rand, d);
    return rand;
}
function degrees(v) {return v * (180/Math.PI)}
function radians(v) {return v * (Math.PI/180)}
function floor(v, d=0) {return Math.floor(v*(10**d)) / (10**d)}
function round(v, d=0) {return Math.round(v*(10**d)) / (10**d)}
function ceil(v, d=0) {return Math.ceil(v*(10**d)) / (10**d)}
function add() {return Array.from(arguments).reduce(function(a,b) {return a+b},  0)}
function sub() {return Array.from(arguments).reduce(function(a,b) {return a-b},  0)}
function mult() {return Array.from(arguments).reduce(function(a,b) {return a*b},  1)}
function div() {return Array.from(arguments).reduce(function(a,b) {return a/b},  1)}
function root(num, exp) {return Math.pow(num, (1/exp))}
function avg() {return this.add.apply(null, arguments)/arguments.length}

module.exports = function(sdefine, createClass, Define) {
    'use strict';
    
    var Math = Object.create(null);
    var define = Define.bind(Math);
    
    var fns = {random, degrees, radians, floor, round, ceil, add, sub, mult, div, root, avg};
    var arr = Object.getOwnPropertyNames(_Math).filter(function(e) {return _Math[e] instanceof Function});
    for(var i = 0;i < arr.length;i++) if(!(arr[i] in fns)) fns[arr[i]] = _Math[arr[i]];
    fns = Object.getOwnPropertyNames(fns).sort(function(a, b) {return a.localeCompare(b)}).reduce(function(a, b) {a[b] = fns[b];return a}, {});
    arr = Object.getOwnPropertyNames(fns);
    for(var i = 0;i < arr.length;i++) define(arr[i], fns[arr[i]]);
    
    var numconst = {PI2: _Math.PI*2};
    arr = Object.getOwnPropertyNames(_Math).filter(function(e) {return !(_Math[e] instanceof Function)});
    for(var i = 0;i < arr.length;i++) if(!(arr[i] in numconst)) numconst[arr[i]] = _Math[arr[i]];
    numconst = Object.getOwnPropertyNames(numconst).sort(function(a, b) {return a.localeCompare(b)}).reduce(function(a, b) {a[b] = numconst[b];return a}, {});
    arr = Object.getOwnPropertyNames(numconst);
    for(var i = 0;i < arr.length;i++) define(arr[i], numconst[arr[i]], {writable: false});
    sdefine('Math', Math);
};