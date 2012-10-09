/*!
 * nodebox - reouter.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var send = require('./controllers/send');
var store = require('./controllers/store');
var home = require('./controllers/home');
var notfound = require('./controllers/notfound');

function router(req, res) {
  if (req.url === '/send') {
    return send(req, res);
  }
  if (req.url === '/store') {
    return store(req, res);
  }
  if (req.url === '/') {
    return home(req, res);
  }
  notfound(req, res);
}

module.exports = router;
