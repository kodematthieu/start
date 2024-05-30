import {schema} from "./Util.js";
import Button from "./Button.js";
import Checkbox from "./Checkbox.js";
import Progress from "./Progress.js";

export default class UI {
  static get Button() {return Button}
  static get Checkbox() {return Checkbox}
  static get Progress() {return Progress}
  static from(data) {
    data = schema({namespace: {type: String}, args: {type: Array, default: []}}, data, "data");
    let {namespace: name, args} = data;
    if(!(name in this)) throw new TypeError(`${name} class does not exist`);
    return new this[name](...args);
  }
  constructor() {throw new TypeError("Invalid constructor")}
}