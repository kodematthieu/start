if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const colors = require('colors');
const servestatic = require('serve-static');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const Util = require('../Util');

const app = express();
app.listen = app.listen(process.env.PORT || 5000, process.env.NODE_ENV !== 'production' ? '127.0.0.1' : null, () => Util.print('Server Started!'));
app.address = new Promise((res, rej) => app.listen.on('listening', () => res(`http://${app.listen.address().address === '::' ? '[::]' : app.listen.address().address}:${app.listen.address().port}`)));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const phoneId = req.headers['user-agent'].match(/\((.*?)\)/);
  const method = req.method;
  const url = req.url;
  Util.print(`${phoneId ? phoneId[1] : phoneId} ${'>'.yellow} ${method.green} ${url.cyan}`);
  next();
});

app.use(servestatic(process.env.PWD + '/front-end'));
app.use('/database', require('./database'));

module.exports = app;