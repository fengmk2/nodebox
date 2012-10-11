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
// var qiniu = require('qiniu');
var qiniu = require('../../qiniu');
var path = require('path');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var _conn = new qiniu.digestauth.Client();
var rs = new qiniu.rs.Service(_conn, config.qiniu.bucket);
var domain = config.qiniu.domain;

rs.publish(domain, function (res) {
  console.log('%s publish: %j', domain, res);
});

function convertCallback(callback, errorName) {
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

function formatKey(k) {
  return k[0] === '/' ? k.substring(1) : k;
}

/**
 * Store a file to nfs.
 * 
 * @param {String} key, nfs store path
 * @param {String} filename, local file path
 * @param {Function(err, data)} callback
 */
exports.store = function (key, filename, mimeType, callback) {
  rs.putFile(formatKey(key), mimeType, filename, convertCallback(callback, 'StoreFileError'));
};

exports.upload = function (key, filename, mimeType, stream, requestCallback, callback) {
  rs.putAuth(function (res) {
    if (res.code !== 200) {
      var err = new Error(res.error);
      err.code = res.code;
      err.name = 'PutAuthError';
      return callback(err);
    }
    var token = res.data.url;
    var req = rs.upload(token, key, mimeType, filename, stream, convertCallback(callback, 'UploadError'));
    requestCallback(req);
  });
};

exports.pipe = function (key, mimeType, stream, size, callback) {
  rs.put(formatKey(key), mimeType, stream, size, convertCallback(callback, 'PipeError'));
};

exports.stat = function (key, callback) {
  rs.get(formatKey(key), path.basename(key), convertCallback(callback, 'StatFileError'));
};
