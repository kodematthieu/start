head();
function head() {
  const title = document.querySelector("header > #title");
  const selection = document.querySelector("header > .menu");
  calculation(selection.value);
  selection.onchange = () => {
    calculation(selection.value);
  };
}
function calculation(type) {
  const contain = document.querySelector("section > #calculation > .inputs");
  const used = [];
  const btn = document.querySelector("section > #calculation > input");
  const formula = {
    // Energy
    "ek": {"e":"(:given.m: * :given.v: * :given.v:) / 2","m":"(2 * :given.e:) / (:given.v: * :given.v:)","v":"Math.sqrt((2 * :given.e:) / :given.m:)"},
    "ep": {"e":":given.m: * :given.g: * :given.h:","m":":given.e: / (:given.g: * :given.h:)","g":":given.e: / (:given.m: * :given.h:)","h":":given.e: / (:given.m: * :given.g:)"},
    "em": {"em":":given.ek: + :given.ep:","ek":":given.em: - :given.ep:","ep":":given.em: - :given.ek:"},
    // Force
    "F": {"F":":given.m: * :given.a:","m":":given.F: / :given.a:","a":":given.F: / :given.m:"},
    
  };
  const definition = {
    "e": ["Energy (J)"],
    "m": ["Mass (kg)"],
    "v": ["Velocity (m/s)"],
    "g": ["Gravity (m/s²)", "9.8"],
    "h": ["Height (m)"],
    "ek": ["Kenetic Energy (J)"],
    "ep": ["Potential Energy (J)"],
    "em": ["Mechanical  Energy (J)"],
    "F": ["Force (N)"],
    "a": ["Acceleration (m/s²)"]
  };
  contain.innerHTML = "";
  Object.keys(formula[type]).forEach((e,i,a) => {
    let input = document.createElement("input");
    input.type = "number";
    input.hidden = false;
    input.dataset.variable = e;
    input.placeholder = definition[e][0];
    input.value = definition[e][1];
    contain.appendChild(input);
    used.push(input);
  });
  btn.onclick = () => {
    let missing;
    let given = {};
    used.forEach((e,i) => {
      if(e.value === "") {
        missing = [e.dataset.variable,e];
      }
      else {
        given[e.dataset.variable] = e.value;
      }
    });
    missing[1].value = eval((formula[type][missing[0]]).split(":").join("")).toFixed(1);
  };
}
function watch(f) {
  return setInterval(f, 1000/60);
}