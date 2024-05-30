const Engine = require("./base");

/**
 * @type {Map<string, function(*): void>}
 */
const buttonFunctionNames = new Map();

class ButtonEngine extends Engine {
    /**
     * @constructor
     * @param {import('./base').Size} [size=null] 
     * @param {import('./base').Position} [offset=null] 
     */
    constructor(size, offset) {
        super([
            {name: "width", validation: data => typeof data === "number" || typeof data === "string"},
            {name: "height", validation: data => typeof data === "number" || typeof data === "string"},
            {name: "Xoffset", validation: data => typeof data === "number" || typeof data === "string"},
            {name: "Yoffset", validation: data => typeof data === "number" || typeof data === "string"},
            {name: "text", type: "string"},
            {name: "button_name", type: "string", validation: data => buttonFunctionNames.has(data)},
            {name: "default_texture", type: "string"},
            {name: "pressed_texture", type: "string"},
            {name: "hovered_texture", type: "string"},
        ]);
        this.text = "unnamed";
        if(arguments.length > 1) this.offset(offset);
        if(arguments.length > 0) this.size(size);
    }
    /**
     * @param {(string[]|number[]|import('./base.js').Size)} width 
     * @param {(string|null)} [height=null]
     * @returns {ButtonEngine}
     */
    size(width, height = null) {
        const data = {width:NaN,height:NaN};
        if(width instanceof Array) {
            data.width = width[0];
            data.height = width[1];
        }
        else if(typeof width === "object") {
            data.width = width.width;
            data.height = width.height;
        }
        else {
            data.width = width;
            data.height = height;
        }
        this.width = data.width;
        this.height = data.height;
        return this;
    }
    /**
     * @param {(string[]|number[]|import('./base.js').Position)} x 
     * @param {(string|null)} [y=null]
     * @returns {ButtonEngine}
     */
    offset(x, y = null) {
        const data = {x:NaN,y:NaN};
        if(x instanceof Array) {
            data.x = x[0];
            data.y = x[1];
        }
        else if(typeof x === "object") {
            data.x = x.x;
            data.y = x.y;
        }
        else {
            data.x = x;
            data.y = y;
        }
        this.Xoffset = data.x;
        this.Yoffset = data.y;
        return this;
    }
    /**
     * @param {string} name 
     * @param {function(*): void} fn 
     * @returns {boolean} Whether its succesful or not
     */
    static registerButtonName(name, fn) {
        if(!(/^[a-z0-9_]$/i).test(name)) return false;
        if(typeof fn !== "function") return false;
        buttonFunctionNames.set(name, fn);
        return true;
    }
    static get registeredButtonNames() {return buttonFunctionNames}
}
module.exports = ButtonEngine;
