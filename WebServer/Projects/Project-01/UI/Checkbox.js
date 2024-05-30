import "../jquery.js";
import "../util.js";
import {schema} from "./Util.js";
import Base from "./Base.js";

class Checkbox extends Base {
  constructor(selector, style) {
    super("<span class='UI-checkbox'/>");
    const check = $(selector);
    style = schema({
      width: {type: [Number, String], default: check.css("width")},
      height: {type: [Number, String], default: check.css("height")},
      borderstyle: {type: String, default: check.css("border-color")},
      borderwidth: {type: String, default: ""},
      bordered: {type: Boolean, default: true},
      background: {type: String, default: check.css("background-color")}
    }, style || {}, "style");
    if(style.borderwidth === "") style.borderwidth = parseFloat(style.width)/8+"px";
    check.parent().append(this);
    this.append(check);
    (typeof check.attr("class") === "string" ? check.attr("class").split(" ") : []).forEach(e => this.addClass(e));
    check.attr("class", "");
    this.attr("id", check.attr("id"));
    check.attr("id", "");
    check.css("display", "none");
    this.css({
      border: `${style.borderwidth} solid ${style.borderstyle}`,
      width: style.width,
      height: style.height,
      display: "block",
      "background-color": style.background
    });
    this.append($("<span class='UI check'/>").css({
      "border-right": this.css("border-right"),
      "border-bottom": this.css("border-bottom"),
      width: parseFloat(this.css("width"))/2,
      height: this.css("height"),
      transform: "translate(30%,-20%) rotate(55deg)",
      display: "block",
      opacity: 0
    }));
    this.on("click.UI", () => this.checked = !this.checked);
    this.on("change.UI", () => {
      check.attr("checked", this.checked);
      if(this.checked) {
        if(!style.bordered) this.css("border-color", "#0000");
        this.children(".UI.check").css("opacity", 1);
      }
      else {
        if(!style.bordered) this.css("border-color", check.css("border-color"));
        this.children(".UI.check").css("opacity", 0);
      }
    });
    this.checked = check.attr("checked") === "checked";
  }
  get checked() {return this.attr("checked") === "checked"}
  set checked(val) {this.attr("checked", val);this.trigger("change")}
}
export default Checkbox;