import "../jquery.js";
import "../util.js";
import {schema} from "./Util.js";
import Base from "./Base.js";

class Button extends Base {
  constructor(selector, style) {
    super(selector);
    style = schema({
      width: {type: [Number, String], default: this.css("width")},
      height: {type: [Number, String], default: this.css("height")},
      color: {type: String, default: this.css("background-color")},
      text: {type: String, default: "normal"},
      font: {type: String, default: "sans-serif"},
      fontsize: {type: [Number, String], default: 18},
      ripple: {type: Boolean, default: this.toArray().some(e => ["SPAN", "P", "A", "DIV"].includes(e.tagName))}
    }, style || {}, "style");
    this.css({
      width: style.width,
      height: style.height,
      "background-color": style.color,
      "text-transform": style.text,
      "font-family": style.font,
      "font-size": typeof style.fontsize === "number" ? style.fontsize+"px" : style.fontsize,
      padding: parseFloat(this.css("padding")) !== 0 ? parseFloat(style.fontsize)/2+"px" : this.css("padding"),
      "border-radius": "3px",
      color: "#fff",
      border: "none",
      outline: "none",
      "box-shadow": `0 1px 4px ${style.color}`,
      display: "block",
      "text-align": "center"
    });
    if(style.ripple) this.on("click.UI", event => {
      const ripple = $("<span class='UI-ripple'/>");
      const size = Math.max(parseFloat(this.css("width")),parseFloat(this.css("height"))) * 1.1;
      const pos = {x:event.clientX,y:event.clientY};
      this.css("position", this.css("position") === "absolute" ? "absolute" : (this.css("position") === "fixed" ? "fixed" : "relative"));
      this.css("overflow", "hidden");
      ripple.css({width: 10, height: 10, position: "absolute", left: pos.x - parseFloat(this.offset().left), top: pos.y - parseFloat(this.offset().top), background: "rgba(255,255,255,0.5)", "border-radius": size*10 + "px", opacity: 1, transform: "translate(-50%, -50%)", display: "block"});
      this.append(ripple);
      ripple.animate({width: size*2, height: size*2, opacity: 0}, 500, () => ripple.remove());
    });
  }
}
export default Button;