import UI from "./UI/index.js";
import "./Music.js";


const plusbtn = new UI.Button("main > span", {width: 350, height: 50, color: "#8e40ff"});
plusbtn.on("click", () => $("main > #tracks").append(new UI.Progress('<span class="ui progress" data-min="0" data-max="300" data-values=""/>', {width: 350, height: 50, background: "hsl(264.5,100%,50%)"})));
  
for(let progress of document.querySelectorAll(".ui.progress")) {
  progress = new UI.Progress(progress, {width: 350, height: 50, background: "hsl(264.5,100%,50%)"});
  
}