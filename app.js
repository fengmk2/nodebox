/*!
 * nodebox - app.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var config = require('./config');
var router = require('./router');
var urlparse = require('url').parse;
var auth = require('./middleware/auth');

var MAX_SIZE = config.maxSize || 10 * 1024 * 1024;

http.createServer(function handle(req, res) {
  var contentLength = parseInt(req.headers['content-length'], 10) || 0;
  if (req.method.toLowerCase() === 'post') {
    var forbidden = contentLength > MAX_SIZE;
    if (forbidden) {
      res.writeHead(403, { 'content-type': 'text/plain' });
      res.end(JSON.stringify({success: false, message: 'max file size is 200mb.'}));
      req.connection.destroy();
      return;
    }
  }

  var urlinfo = urlparse(req.url, true);
  req.pathname = urlinfo.pathname;
  req.query = urlinfo.query || {};
  
  auth({
    user: config.user,
    password: config.password,
  })(req, res, function () {
    router(req, res);
  });

}).listen(config.port);
