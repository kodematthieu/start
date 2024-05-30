const fs = require("fs");
const {TensorFlow: tf} = require("./lib");

const TRAIN_TEXT = fs.readFileSync(__dirname + "/._.database._./shakespeare.txt").toString();
const TRAIN_VOCAB = Array.from(new Set(TRAIN_TEXT));


const Model = (async name => {
  "use strict";
  
  const model = tf.sequential({name});
  console.log(tf.Sequential.prototype);
  
  return this;
}).bind({});
Model("ii");