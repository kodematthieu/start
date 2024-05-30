const html_temp = 
  '<!DOCTYPE html>\n' +
  '<html lang="en">\n  ' +
  '<head>\n    ' +
  '<meta charset="utf-8">\n    ' +
  '<meta name="viewport" content="width=device-width"/>\n    ' +
  '<title></title>\n  ' +
  '</head>\n  ' +
  '<body>\n    ' +
  '\n  ' +
  '</body>\n' +
  '</html>';

const web = [];
web[0] = document.querySelector("input[value = 'html']");
web[1] = document.querySelector("input[value = 'css']");
web[2] = document.querySelector("input[value = 'js']");
web[3] = document.querySelector("input[value = 'result']");

const editor = [];
editor[0] = document.querySelector(".html");
editor[1] = document.querySelector(".css");
editor[2] = document.querySelector(".js");
editor[3] = document.querySelector(".result");

const textarea = [];
textarea[0] = editor[0].querySelector("textarea");
textarea[1] = editor[1].querySelector("textarea");
textarea[2] = editor[2].querySelector("textarea");

const consoleTable = document.querySelector(".console");
const consoleTr = consoleTable.querySelectorAll("tr");
const consoleTd = [];
for(let i = 0; i < consoleTr.length; i++) {
  consoleTd.push(consoleTr[i].querySelectorAll("td"));
}

if(!textarea[0].value) {
  textarea[0].value = html_temp;
}

const run = document.querySelector(".runBtn");
const reset = document.querySelector(".resetBtn");

function loadAlways() {
  if(web[0].checked) {
    editor[0].style.display = "block";
  }
  else {
    editor[0].style.display = "none";
  }
  if(web[1].checked) {
    editor[1].style.display = "block";
  }
  else {
    editor[1].style.display = "none";
  }
  if(web[2].checked) {
    editor[2].style.display = "block";
  }
  else {
    editor[2].style.display = "none";
  }
  if(web[3].checked) {
    editor[3].style.display = "block";
  }
  else {
    editor[3].style.display = "none";
  }
  
}
setInterval(loadAlways, 0);

var html, css, js;
run.addEventListener("click", () => {
  if(textarea[0].value || textarea[1].value || textarea[2].value) {
    web[3].checked = "checked";
  }

  const iframe = editor[3].querySelector("iframe");
  const iframe_input = iframe.contentDocument;

  function reload() {
    html = textarea[0].value;
    css = textarea[1].value;
    js = textarea[2].value;
    setTimeout(reload, 0);
  }
  reload();

  function getSrc() {
    var src = '';

    src = html_temp.replace('</body>', html + '</body>');
    css = '<style>' + css + '</style>';
    src = src.replace('</head>', css + '</head>');
    js = '<script>' + js + '</script>';
    src = src.replace('</body>', js + '</body>');
    return src;
  }
  var src = getSrc();

  iframe_input.open();
  iframe_input.write(src);
  iframe_input.close();

  alert(src);
});
reset.addEventListener("click", () => {
  if(textarea[0].value || textarea[1].value || textarea[2].value) {
    textarea[0].value = html_temp;
    textarea[1].value = "";
    textarea[2].value = "";
    web[0].checked = "checked";
  }
});

