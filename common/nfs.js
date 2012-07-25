/*!
 * nodebox - common/nfs.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var config = require('../config');
var qiniu = require('qiniu');
var path = require('path');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var _conn = new qiniu.digestauth.Client();
var rs = new qiniu.rs.Service(_conn, config.qiniu.bucket);
var domain = config.qiniu.domain;
// rs.unpublish(domain, function (res) {
//   console.log('%s publish: %j', domain, res);
// });
rs.publish(domain, function (res) {
  console.log('%s publish: %j', domain, res);
});

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
  rs.putFile(key, mimeType, filename, function (res) {
    if (res.code !== 200) {
      var err = new Error(res.error);
      err.code = res.code;
      err.name = 'StoreFileError';
      return callback && callback(err);
    }
    callback && callback(null, res.data);
  });
};

exports.stat = function (key, callback) {
  if (key[0] === '/') {
    key = key.substring(1);
  }
  rs.get(key, path.basename(key), function (res) {
    if (res.code !== 200) {
      var err = new Error(res.error);
      err.code = res.code;
      err.name = 'StatFileError';
      return callback(err);
    }
    callback(null, res.data);
  });
};

// exports.store('/fawave.png', __dirname + '/fawave.png', 'image/png', function () {
//   console.log(arguments);
//   exports.stat('/fawave.png', function (err, stat) {
//     console.log(arguments);
//   });
// });

