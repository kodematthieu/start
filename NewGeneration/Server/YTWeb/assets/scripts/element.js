customElements.define("api-weather", class extends HTMLElement {
  #status = [];
  #statusElem = {};
  #validStatus = {
    "weather": "|data.weather[0].description|",
    "temperature": "|data.main.temp|°C"
  };
  constructor() {
    super();
    this.#status.toString = function() { return this.join(" ")};
    this.observedAttributes = ["status"];
    this.attachShadow({mode: "open"});
  }
  connectedCallback() {
    if(!("geolocation" in navigator)) return this.remove();
    this.attributeChangedCallback("status", "", this.getAttribute("status"));
    let style = document.createElement("style");
    let img = new Image();
    let div = document.createElement("div");
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    :host {
      display: flex;
      position: relative;
      flex-direction: column;
      height: auto;
      user-select: none;
    }
    :host > img {
      width: 40%;
      height: auto;
      margin: auto;
      position: relative;
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(284deg) brightness(101%) contrast(101%);
    }
    :host > div {
      position: relative;
      transform: translateY(-25%);
      margin-top: 10px;
    }
    :host > div > span {
      width: 75%;
      margin: auto;
      display: block;
      font-size: 15px;
      font-family: "Poppins", sans-serif;
      text-align: center;
      color: #fff;
    }
    `;
    img.oncontextmenu = () => false;
    this.shadowRoot.appendChild(style);
    if(this.showIcon) this.shadowRoot.appendChild(img);
    this.shadowRoot.appendChild(div);
    for(let status of this.status) {
      if(Object.keys(this.#validStatus).includes(status)) {
        let elem = this.#statusElem[status] = document.createElement("span");
        elem.dataset.info = status;
        div.appendChild(elem);
      }
    }
    this.update = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        fetch(`/api/weather/default?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
          .then(res => res.json())
          .then(data => {
            img.src = data.weather[0].icon;
            Object.values(this.#statusElem).forEach(e => {
              e.innerHTML = this.#validStatus[e.dataset.info].replace(/\|(.*)\|/g, c => eval(c.replace(/\|/g, ""))).replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
            });
            this.weather = data;
          })
          .catch(err => this.remove());
      });
    };
    this.update();
  }
  disconnectedCallback() {}
  attributeChangedCallback(attr, oldVal, newVal) {
    if(attr === "status") {
      this.#status.length = 0;
      this.status = newVal;
    }
  }
  get status() {return this.#status}
  set status(value) {this.setAttribute("status", value);this.#status.length = 0;for(let e of value.split(" ")) this.#status.push(e)}
  get showIcon() {return this.hasAttribute("show-icon")}
  set showIcon(value) {
    if (value) {
      this.setAttribute("show-icon", "");
    } else {
      this.removeAttribute("show-icon");
    }
  }
});