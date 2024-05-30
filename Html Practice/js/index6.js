if(navigator.onLine7) {
  //alert("Sorry but this App requires internet to run.");
}
else {
  head();
}
function head() {
  const MainBtn = document.querySelectorAll("header > nav > span");
  const DropDown = document.querySelectorAll("header > #dropdown > div");
  checkbox(DropDown[0].querySelector("label#checkbox > input"));
  button(DropDown[0].querySelector("label#button"));
  MainBtn[0].addEventListener("click", () => {
    MainBtn[1].classList.remove("active");
    MainBtn[2].classList.remove("active");
    MainBtn[0].classList.toggle("active");
    highlight(MainBtn);
  });
  MainBtn[1].addEventListener("click", () => {
    MainBtn[0].classList.remove("active");
    MainBtn[2].classList.remove("active");
    MainBtn[1].classList.toggle("active");
    highlight(MainBtn);
  });
  MainBtn[2].addEventListener("click", () => {
    MainBtn[0].classList.remove("active");
    MainBtn[1].classList.remove("active");
    MainBtn[2].classList.toggle("active");
    highlight(MainBtn);
  });
  function highlight(e) {
    if(!e[0].classList.contains("active") && !e[1].classList.contains("active") && !e[2].classList.contains("active")) {
      e[0].classList.add("highlight");
      e[1].classList.add("highlight");
      e[2].classList.add("highlight");
    }
    else {
      e[0].classList.remove("highlight");
      e[1].classList.remove("highlight");
      e[2].classList.remove("highlight");
    }
  }
  function checkbox(e,y=()=>{},n=()=>{}) {
    if(e.checked) {
      e.parentNode.classList.add("green");
      e.parentNode.classList.remove("red");
      y(e);
    }
    else {
      e.parentNode.classList.add("red");
      e.parentNode.classList.remove("green");
      n(e);
    }
    e.addEventListener("change", () => {
      if(e.checked) {
        e.parentNode.classList.add("green");
        e.parentNode.classList.remove("red");
        y(e);
      }
      else {
        e.parentNode.classList.add("red");
        e.parentNode.classList.remove("green");
        n(e);
      }
    });
  }
  function button(e,c=()=>{}) {
    e.classList.add("green");
    e.addEventListener("pointerenter", () => {
      e.classList.add("red");
      e.classList.remove("green");
    });
    e.addEventListener("pointerleave", () => {
      e.classList.add("green");
      e.classList.remove("red");
    });
    e.addEventListener("click", () => {
      c(e);
    });
  }
}
function generator() {
  const Results = document.querySelectorAll("#results > span");
  Results[0].innerText = [generate(8),generate(4),generate(4),generate(4),generate(12)].join("-");
  function generate(num = 1) {
    let result = [];
    for(let i = 0; i < num; i++) {
      result.push((Math.round(Math.random()*15)).toString(16));
    }
    return result.join("");
  }
  copy(Results[0]);
  function copy(e) {
    let text = e.innerText;
    let input = document.querySelector("#copier");
    input.value = text;
    input.select();
    document.execCommand("copy");
  }
} 
generator();