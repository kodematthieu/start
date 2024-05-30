if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const colors = require('colors');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const Util = require('../Util');

const app = module.exports = express();
app.listen = app.listen(process.env.PORT || 5000, null, () => Util.print('Server Started!'));
app.address = new Promise((res, rej) => app.listen.on('listening', () => res(`http://${app.listen.address().address === '::' ? '[::]' : app.listen.address().address}:${app.listen.address().port}`)));

app.use(cookieParser({secret: process.env.SECRET}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const phoneId = req.headers['user-agent'].match(/\((.*?)\)/);
  const method = req.method;
  const url = req.url;
  Util.print(`${phoneId ? phoneId[1] : phoneId} ${'>'.yellow} ${method.green} ${url.cyan}`);
  next();
});

app.use(require('./pages'));