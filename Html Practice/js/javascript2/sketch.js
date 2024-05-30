window.onerror = function(msg, url, line) {
  alert(msg + "\nUrl: " + url + "\nLine: " + line)
}
function init() {
  loadJSON(function(response) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    alert(actual_JSON);
  });
}
function loadJSON(callback) { 
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'image.json', true);
  xobj.onreadystatechange = function () {
    if(xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null); 
}
init();

alert(navigator.onLine);