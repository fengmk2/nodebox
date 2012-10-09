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
var fs = require('fs');
var nfs = require('../common/nfs');
var config = require('../config');
var IncomingForm = require('formidable').IncomingForm;
var common = require('./common');

function store(req, res) {
  var uploadStream = null;
  // parse a file upload
  var form = new IncomingForm();
  form.parse(req, function (err, fields, files) {
    var file = files.file;
    if (!file) {
      res.writeHead(403, {'content-type': 'text/plain'});
      return res.end(JSON.stringify({success: false, message: 'no input file'}));
    }

    var name = path.basename(file.path);
    var ext = path.extname(file.name);
    var storePath = common.formatStorePath(name, ext);
    
    nfs.store(storePath, file.path, file.type, function (err, data) {
      common.sendResult(storePath, file.size, file.type, err, data, res);
      fs.unlink(file.path);
    });
  });
}

module.exports = store;