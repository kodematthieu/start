// let ring, touch = false;
// let i = 0;

// function setup() {
//     createCanvas(windowWidth,windowWidth);
//     frameRate(60);
//     ring = new Ring([width/2, height/2], 300, 5);
//     ring.rot = 180;
//     // setInterval(interval, 500);
// }
// function draw() {
//     clear();
//     stroke(255);
//     fill(255);
//     ring.show();
//     // saveCanvas('colored-logo', 'png');
//     noLoop();
// }
// function interval() {
//     if(ring.rot !== 180 || i === 0) {
//         saveCanvas(`loading_frame_${i.toString().padStart(3,'0')}`, 'png');
//         i += 1;
//         ring.update(2);
//     }
// }
navigator.getUserMedia({audio: true}, function(stream) {
    var audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.srcObject = stream;
    audio.onloadedmetadata = () => audio.play();
    console.log('hello');
}, function(e) {
    console.log(e);
});