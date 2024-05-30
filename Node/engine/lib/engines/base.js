
/** 
 * @typedef {Object} Property
 * @property {string} name - Property name
 * @property {*} [type=null] - Type of the property
 * @property {?RegExp} regex - Can only be used when {@link Property#type} is {@link String}
 * @property {?(function(*): boolean)} validation - Can only be used when {@link Property#type} is not specified or if null
 * @property {*} children - Can only be used when {@link Property#type} is {@link Array}
 * @property {boolean} [strict=false] - Refers if all properties of {@link Property} should be strict
 */
/**
 * @typedef {Object} Size
 * @property {(string|number)} width
 * @property {(string|number)} height
 */
/**
 * @typedef {Object} Position
 * @property {(string|number)} x
 * @property {(string|number)} y
 */


const props = new WeakMap();
const values = new WeakMap();

const typeVerify = {};
for(let e of ["string", "number", "boolean", "function", "object"]) typeVerify[e] = v => typeof v === e;

class Engine {
    /**
     * Parent engine
     * @constructor Engine
     * @param {Array<Property>} properties - Properties of the engine 
     */
    constructor(properties) {
        props.set(this, []);
        values.set(this, {});
        if(!(properties instanceof Array)) properties = [];
        properties = properties.filter(e => typeof e === "object");
        properties = properties.filter(e => "name" in e);
        properties.forEach(obj => {
            obj.name = String(obj.name);
            obj.type = obj.type == null || obj.type == undefined || !(obj.type.constructor || obj.type.prototype) || typeof obj.type !== "string" ? null : obj.type;
            obj.regex = !obj.regex ? null : new RegExp(obj.regex);
            obj.children = obj.children == null || obj.children == undefined || (!obj.children.constructor && !obj.children.prototype) ? null : obj.children;
            obj.min = typeof obj.min === "number" ? obj.min : -Infinity;
            obj.max = typeof obj.max === "number" ? obj.max : Infinity;
            obj.validation = !obj.validation ? null : new Function(obj.validation);
            obj.strict = Boolean(obj.strict);
            props.get(this).push({name: obj.name, type: obj.type, regex: obj.regex, children: obj.children, min: obj.min, max: obj.max, validation: obj.validation, strict: obj.strict});
            values.get(this)[obj.name] = null;
            obj = props.get(this).find(e => e.name === obj.name);
            /**
             * @property
             */
            Object.defineProperty(this, obj.name, {
                enumerable: true,
                get: () => values.get(this)[obj.name],
                set: v => {
                    if(obj.strict) {
                        if(obj.type != null) {
                            if(typeof obj.type === "string" && !!typeVerify[obj.type] && !typeVerify[obj.type](v)) return;
                            if(typeof obj.type !== "string" && v.constructor !== obj.type) return;
                        }
                        if(obj.regex != null && typeof v === "string" && !obj.regex.test(v)) return;
                        if(obj.children != null && v instanceof Array && v.some(e => !(e.constructor == obj.children))) return;
                        if(obj.validation != null && !obj.validation(v)) return;
                        if(typeof v === "number" && obj.min > v) return;
                        if(typeof v === "number" && obj.max < v) return;
                    }
                    else {
                        if(obj.type != null) {
                            if(typeof obj.type === "string" && !!typeVerify[obj.type] && !typeVerify[obj.type](v)) return;
                            if(typeof obj.type !== "string" && (v instanceof obj.type)) return;
                        }                        if(obj.regex != null && typeof v === "string" && !obj.regex.test(v)) return;
                        if(obj.children != null && v instanceof Array && v.some(e => !(e instanceof obj.children))) return;
                        if(obj.validation != null && !obj.validation(v)) return;
                        if(typeof v === "number" && obj.min > v) return;
                        if(typeof v === "number" && obj.max < v) return;
                    }
                    console.log("Passed");
                    values.get(this)[obj.name] = v;
                }
            })
        });
    }
}
module.exports = Engine;