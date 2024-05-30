function GUIMenu(a) {
  //Assign some elements
  var body = document.body;
  body.innerHTML += "<div id='GUIMenuContent'></div>";
  var content = body.querySelector('#GUIMenuContent');
  content.innerHTML += "<h1 id='title'></h1>";
  var title = content.querySelector('#title');;

  //Styles of the elements
  this.background = a.container.background || "white";
  this.width = a.container.width || "90%";
  this.height = a.container.height || "92%";
  this.borderRadius = a.container.corners || "5px";
  this.title = a.title.text || "";
  this.titleFontFamily = a.title.fontFamily || "sans-serif";
  this.titleSize = a.title.fontSize || "20px";
  this.titleFontWeight = a.title.fontWeight || 600;
  this.titleColor = a.title.color || "black";
  title.innerText = this.title;
  
  content.style.position = "fixed";
  content.style.display = "none";
  content.style.background = this.background;
  content.style.width = this.width;
  content.style.height = this.height;
  content.style.borderRadius = this.borderRadius;
  content.style.top = "50%";
  content.style.left = "50%";
  content.style.transform = "translate(-50%, -50%)";
  content.style.zIndex = "5";
  content.style.boxShadow = "0px 0px 0px 4000px rgba(0, 0, 0, 0.3)";

  title.style.fontFamily = this.titleFontFamily;
  title.style.fontSize = this.titleSize;
  title.style.marginLeft = "4%";
  title.style.fontWeight = this.titleFontWeight;
  title.style.color = this.titleColor;

  addEventListener('dblclick', () => {
    if(content.style.display === "none") {
      content.style.display = "block";
    }
    else if(content.style.display === "block") {
      content.style.display = "none";
    }
  });
}
