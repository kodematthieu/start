class Extract {
  #multiple = false;
  #elem = null;
  #files = null;
  onload = () => {};
  constructor(elem, multiple = false) {
    this.#multiple = multiple;
    this.#elem = ((elem instanceof HTMLInputElement) && (elem.type === "file")) ? elem : undefined;
  }
  process(ftype = "txt") {
    this.#elem.addEventListener("change", (event) => {
      const reader = new FileReader();
      this.#files = this.#multiple ? event.target.files : event.target.files[0];
      reader.readAsText(this.#files);
      reader.onload = () => {
        this.onload({
          fileInfo: {
            name: this.#files.name,
            size: this.#files.size,
            type: this.#files.type
          },
          fileData: reader.result
        })
      }
    })
  }
  static BinToString(bin) {
    return bin.replace(/[01]{8}/g, function(s){ 
      return String.fromCharCode(parseInt(s, 2)); 
    });
  }
  static StringToBin(str) {
    const bin = [];
    str.split("").forEach(function(e) { 
      bin.push(e.charCodeAt().toString(2));
    });
    return bin.join("");
  }
}