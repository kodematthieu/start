const worker = new Worker("worker.js");
worker.addEventListener("message", m => document.querySelector("p").innerHTML = m.data);
worker.postMessage(["test", true])