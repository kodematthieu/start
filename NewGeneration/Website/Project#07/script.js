window.onerror = () => alert(Array.from(arguments).join('\n'))

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [2], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

const net = new brain.NeuralNetwork(config);

net.train([
  { input: ["zero", "zero"], output: ["zero"] },
  { input: ["zero", "one"], output: ["one"] },
  { input: ["one", "zero"], output: ["one"] },
  { input: ["one", "zero"], output: ["zero"] },
]);
alert(net.run(["one", "zero"]))

$(() => {
  const player = document.createElement("video");
  player.autoplay = true
  player.controls = true
  const handleSuccess = function(stream) {
    if (window.URL) {
      player.srcObject = stream;
    } else {
      player.src = stream;
    }
  };
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(handleSuccess);
  document.body.appendChild(player)
})