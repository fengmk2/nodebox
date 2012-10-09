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

var MAX_SIZE = config.maxSize || 10 * 1024 * 1024;

http.createServer(function handle(req, res) {
  var contentLength = parseInt(req.headers['content-length'], 10);
  if (req.method.toLowerCase() === 'post') {
    if (isNaN(contentLength) || contentLength > MAX_SIZE) {
      res.writeHead(403, {'content-type': 'text/plain'});
      res.end(JSON.stringify({success: false, message: 'max file size is 200mb.'}));
      req.connection.destroy();
      return;
    }
    req.contentLength = contentLength;
  }

  router(req, res);

}).listen(config.port);
