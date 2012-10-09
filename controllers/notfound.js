/*!
 * nodebox - controllers/notfound.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

function notfound(req, res) {
  res.writeHead(404);
  res.end('Page Not Found');
}

module.exports = notfound;