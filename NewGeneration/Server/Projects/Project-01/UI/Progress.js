import "../jquery.js";
import "../util.js";
import {schema} from "./Util.js";
import Base from "./Base.js";

class Progress extends Base {
  constructor(selector, style) {
    super(selector);
    style = schema({
      width: {type: [Number, String], default: this.css("width")},
      height: {type: [Number, String], default: this.css("height")},
      color: {type: [Array, String], default: "white"},
      background: {type: String, default: this.css("background-color")},
      vertical: {type: Boolean, default: false},
      reverse: {type: Boolean, default: false}
    }, style || {}, "style");
    const padding = Math.min(parseFloat(style.width), parseFloat(style.height))/10;
    this.css({
      width: parseFloat(style.width),// - padding*2,
      height: parseFloat(style.height),// - padding*2,
      padding: padding,
      "background-color": style.background,
      "box-shadow": `0 1px 4px ${style.background}`,
      display: "block",
      "border-radius": padding/2,
      position: this.css("position") === "absolute" ? "absolute" : (this.css("position") === "fixed" ? "fixed" : "relative")
    });
    this.on("change.UI", (e) => {
      let values = this.values;
      for(let bar of values) {
        let value = bar.sort((a, b) => a - b);
        let width = bar[1] - bar[0];
        let index = values.indexOf(bar);
        let color = Util.isType(style.color, Array) ? style.color[index] || "white" : style.color;
        let elem = this.children(".UI.bar"+index)[0] ? this.children(".UI.bar"+index) : $(`<span class="UI bar${index}"/>`);
        elem.data("value", bar.join("-")).css({
          top: padding,
          bottom: padding,
          height: `fill-available`,
          display: "block",
          position: "absolute",
          "background-color": color,
          "border-radius": parseFloat(this.css("border-radius"))/1.1,
          width: `calc(${width}% - ${padding}px)`,
          left: `calc((${bar[0]}% - ${(padding/2)*index}px) + ${padding}px)`
        });
        if(elem.children("input").length == 0) elem.append($("<input type='radio' name='UI-progress-radio' hidden/>"));
        this.append(elem);
        elem.on("select.UI", () => this.css("outline", "1px dotted gold"));
      }
      let self = this;
      this.bars.on("click.UI", function() {
        $(this).children("input")[0].click();
      });
    });
    this.trigger("change.UI");
  }
  get min() {return parseFloat(this.data("min"))}
  set min(val) {this.data("min", Number(val));this.trigger("change")}
  get max() {return parseFloat(this.data("max"))}
  set max(val) {this.data("max", Number(val));this.trigger("change")}
  get values() {return this.data("values").split(";").map(e => e.split("-").map(Number))}
  set values(val) {this.data("values", val.filter(e => e.length == 2 && Util.inArray(e, Number)).map(e => e.map(String).join("-")).join(";"));this.trigger("change")}
  get bars() {return $(this.children().toArray().filter(e => Array.from(e.classList).some(e => (/^bar(\d+)$/).test(e))))}
  get selected() {return $(Array.from(this.bars.children("input")).find(e => e.checked)).parent()}
}
export default Progress;