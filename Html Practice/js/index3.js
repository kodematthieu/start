const selectAll = document.querySelector(".select-all");
selectAll.addEventListener('click', () => {
  var checkbox = selectAll.querySelector("input");
  var names = localStorage.list.split(";");
  names.pop();
  if(names.length !== 0) {
    if(checkbox.checked) {
      checkbox.checked = null;
      for(let i = 0; i < check.length; i++) {
        check[i].checked = null;
      }
    }
    else {
      checkbox.checked = "yes"
      for(let i = 0; i < check.length; i++) {
        check[i].checked = "yes";
      }
    }
  }
});

const addBTN = document.querySelector(".addBtn");
addBTN.addEventListener('click', () => {
  name = document.querySelector("input[ name = 'itemName' ]").value || "unnamed";
  div.push(document.createElement("div"));
  check.push(document.createElement("input"));
  label.push(document.createElement("label"));
  check[check.length-1].type = "checkbox";
  check[check.length-1].name = name;
  label[label.length-1].innerText = name;
  label[label.length-1].for = name;
  div[div.length-1].appendChild(check[check.length-1])
  div[div.length-1].appendChild(label[label.length-1]);
  section.appendChild(div[div.length-1]);
  localStorage.list += name + ";";
  document.querySelector("input[ name = 'itemName' ]").value = "";
  document.querySelector("input[ name = 'itemName' ]").focus();
});

const del = document.querySelector(".delete");
del.addEventListener('click', () => {
  var names = localStorage.list.split(";");
  names.pop();
  check.forEach((checkbox, i) => {
    if(names.length !== 0) {
      if(check[0].checked) {
        names.splice(0, 1);
        div[0].parentNode.removeChild(div[0]);
        div.splice(0, 1);
        check.splice(0, 1);
      }
      if(checkbox.checked) {
        names.splice(i, 1);
        div[i].parentNode.removeChild(div[i]);
        div.splice(i, 1);
        check.splice(i, 1);
      }
      if(check[i+1].checked) {
        names.splice(i+1, 1);
        div[i+1].parentNode.removeChild(div[i+1]);
        div.splice(i+1, 1);
        check.splice(i+1, 1);
      }
      if(check[check.length-1].checked) {
        names.splice(check.length-1, 1);
        div[check.length-1].parentNode.removeChild(div[check.length-1]);
        div.splice(check.length-1, 1);
        check.splice(check.length-1, 1);
      }
      localStorage.list = names.join(";");
    }
  });
});

const deleteAll = document.querySelector(".delete-all");
deleteAll.addEventListener('click', () => {
  if(div.length !== 0) {
    var ask = confirm("Delete All Items?");
    if(!ask) {
      for(let i = 0; i < div.length; i++) {
        check[i].checked = "yes"
      }
    }
    else {
      for(let i = 0; i < div.length; i++) {
        div[i].parentNode.removeChild(div[i]);
        localStorage.list = "";
      }
      check = [];
      div = [];
    }
  }
  else {
    alert("No Items To Delete");
  }
});

(function() {
  section = document.querySelector("section")
  div = []
  check = []
  label = []
  var names = localStorage.list.split(";");
  names.splice(names.length - 1, 1);
  //names.reverse();
  for(let i = 0; i < names.length; i++) {
    div.push(document.createElement("div"));
    check.push(document.createElement("input"));
    label.push(document.createElement("label"));
    check[i].type = "checkbox";
    check[i].name = names[i];
    label[i].innerText = names[i];
    label[i].for = names[i];
    div[i].appendChild(check[i])
    div[i].appendChild(label[i]);
    section.appendChild(div[i]);;
    //alert(names)
  }
}());

function style() {
  div.forEach((Div) => {
    Div.style.borderBottom = "0.25px solid #aaa";
    Div.style.borderTop = "0.25px solid #aaa";
    Div.style.width = "92%";
    Div.style.margin = "0px auto";
    Div.style.height = "30px";
  });
  check.forEach((checkbox) => {
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.style.margin = "5px";
    checkbox.style.verticalAlign = "middle";
  });
  label.forEach((lab) => {
    lab.style.verticalAlign = "middle";
    lab.style.textAlign = "center";
    //lab.style.background = "red";
    lab.style.fontSize = "15px";
    lab.style.fontFamily = "courier";
    lab.style.fontWeight = "bold";
    lab.style.letterSpacing = "2px";
  });
}
setInterval(style, 0);
