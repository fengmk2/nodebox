/*!
 * nodebox - controllers/common.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require('path');
var config = require('../config');
var homeurl = 'http://' + config.qiniu.domain;

exports.formatStorePath = function (name, ext) {
  return '/' + name[0] + '/' + name[1] + '/' + name + ext;
};

exports.sendResult = function (storePath, size, type, err, data, res) {
  if (err) {
    res.writeHead(500, {'content-type': 'text/plain'});
    return res.end(err.message);
  }

  res.writeHead(200, {'content-type': 'text/plain'});
  res.end(JSON.stringify({success: true, payload: {
    size: size,
    // url: 'http://' + req.headers.host + '/get' + store_path,
    url: homeurl + storePath,
    type: type
  }}));
};