/*!
 * nodebox - controllers/store.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require('path');
var parseStream = require('pause-stream');
var fs = require('fs');
var nfs = require('../common/nfs');
var config = require('../config');
var IncomingForm = require('formidable').IncomingForm;
var common = require('./common');
var utils = require('../lib/utils');


function store(req, res) {
  var uploadStream = null;
  // parse a file upload
  var form = new IncomingForm();
  var stream = null;
  form.onPart = function (part) {
    if (part.name !== 'file') {
      return;
    }
    var size = 0;
    part.on('data', function (chunk) {
      size += chunk.length;
    });
    
    var name = path.basename(part.filename);
    var storeName = utils.md5(Date.now() + name + Math.random() + Math.random() + part.mime);
    var storePath = common.formatStorePath(storeName, path.extname(name));
    stream = parseStream().pause();
    part.pipe(stream);
    
    var request = null;
    nfs.upload(storePath, name, part.mime, stream, function (req) {
      request = req;
    }, function (err, data) {
      common.sendResult(storePath, size, part.mime, err, data, res);
    });

    // TODO: limit max size
    part.on('end', function () {
      if (size > config.maxSize) {
        request && request.abort();
      }
    });
  };
  form.parse(req, function (err) {
    if (stream) {
      return;
    }
    res.writeHead(403, { 'content-type': 'text/plain' });
    res.end(JSON.stringify({success: false, message: 'no input file'}));
  });
}

module.exports = store;