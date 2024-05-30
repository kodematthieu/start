import Piece from './Piece.js'; 
import Board from './Board.js'; 

const chess = function chess() {
    if(!(this instanceof chess)) throw new TypeError("Invalid constructor");
    Object.setPrototypeOf(this.constructor, Object.create(null));
    return this;
};

const define = function(name, value, opts = {}) {
    if(value instanceof Function && Object.getOwnPropertyNames(value)[1] !== 'prototype') {
        value = value.bind(this);
        Object.defineProperty(value, "name", {value: name});
    }
    if(typeof name === 'string' && name.split(".").length == 2 && (name.split(".")[1] === "get" || name.split(".")[1] === "set")) {
        var type = name.split(".")[1];
        name = name.split(".")[0];
        delete opts.value;
        Object.defineProperty(this, name, Object.assign({enumerable: true, configurable: true}, opts, {[type]: value}));
    } 
    else Object.defineProperty(this, name, Object.assign({enumerable: true, writable: true, configurable: true}, opts, {value}));
    return value;
}.bind(chess.prototype);

define(Symbol.toStringTag, 'chess');
define('Piece', Piece);
define('Board', Board);

export default new chess();