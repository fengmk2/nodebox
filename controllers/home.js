/*!
 * nodebox - controllers/home.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var projectdir = path.dirname(__dirname);
var version = require('../package.json').version;

var HOME_PAGE = fs.readFileSync(path.join(projectdir, './index.html'), 'utf8');
HOME_PAGE = HOME_PAGE.replace('{version}', version);

function home(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(HOME_PAGE);
}

module.exports = home;