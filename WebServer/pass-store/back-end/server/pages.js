const express = require('express');
const fs = require('fs');
const path = require('path');

const router = module.exports = express.Router();

for(let dir of fs.readdirSync(process.env.PWD + '/front-end')) {
  router.use('/'+dir, express.static(process.env.PWD + '/front-end/' + dir));
}