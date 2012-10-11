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
  if (req.method === 'POST') {
    if (req.pathname === '/send') {
      return send(req, res);
    }
    if (req.pathname === '/store') {
      return store(req, res);
    }
    res.writeHead(302, {
      Location: '/'
    });
    return res.end();
  }
  
  if (req.pathname === '/') {
    return home(req, res);
  }
  notfound(req, res);
}

module.exports = router;
