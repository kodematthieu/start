self.addEventListener("message", ({data}) => {
  self.postMessage(data);
  self.close()
});