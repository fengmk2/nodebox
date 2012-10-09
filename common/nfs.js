/*!
 * nodebox - common/nfs.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var util = require('util');
var config = require('../config');
var qiniu = require('qiniu');
var path = require('path');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var _conn = new qiniu.digestauth.Client();
var rs = new qiniu.rs.Service(_conn, config.qiniu.bucket);
var domain = config.qiniu.domain;

rs.publish(domain, function (res) {
  console.log('%s publish: %j', domain, res);
});

function handleCallback(callback, errorName) {
  return function (res) {
    if (res.code !== 200) {
      var err = new Error(res.error);
      err.code = res.code;
      err.name = errorName || 'NFSError';
      return callback(err);
    }
    callback(null, res.data);
  };
}

/**
 * Store a file to nfs.
 * 
 * @param {String} key, nfs store path
 * @param {String} filename, local file path
 * @param {Function(err, data)} callback
 */
exports.store = function (key, filename, mimeType, callback) {
  if (key[0] === '/') {
    key = key.substring(1);
  }
  rs.putFile(key, mimeType, filename, handleCallback(callback, 'StoreFileError'));
};

exports.pipe = function (key, mimeType, stream, size, callback) {
  rs.put(key, mimeType, stream, size, handleCallback(callback, 'PipeError'));
};

exports.stat = function (key, callback) {
  if (key[0] === '/') {
    key = key.substring(1);
  }
  rs.get(key, path.basename(key), handleCallback(callback, 'StatFileError'));
};
