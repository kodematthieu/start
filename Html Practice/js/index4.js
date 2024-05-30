window.onerror = function(msg, url, line) {
  alert(msg + "\nUrl: " + url + "\nLine: " + line)
}

const files = document.getElementById("file");
const Flabel = document.querySelector(".file")
const info = document.getElementById("info");
const grid = document.getElementById("grid");
let json;

function Extract(file) {
  let data;
  let reader = new FileReader(); 
  file = file.files[0];
  this.data = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  }
  reader.readAsText(file);
  reader.onload = () => {
    this.content = reader.result;
  }
}

files.addEventListener("change", function() {
  let ctx;
  json = new Extract(this);
  Flabel.innerText = json.data.fileName;
  ctx = json.content;
  setTimeout(() => {
    alert(json.content);
    ctx = JSON.parse(`${ctx}`)
    alert(ctx)
  }, 500);
});

info.addEventListener("click", () => {
  alert(`Size:    ${json.data.fileSize},
Type:    ${json.data.fileType}`);
});
