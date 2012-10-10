/*!
 * nodebox - middleware/auth.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

function auth(options) {
  options = options || {};
  var user = options.user;
  var password = options.password;
  return function (req, res, next) {
    var auth = req.headers.authorization;
    if (!auth) {
      return next();
    }
    auth = auth.split(' ')[1];
    if (auth) {
      try {
        auth = new Buffer(auth, 'base64').toString().split(':');
      } catch (e) {
        auth = null;
      }
      if (auth) {
        auth = { user: auth[0], password: auth[1] }; 
      }
    }
    if (!auth || auth.user !== user || auth.password !== password) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    req.user = user;
    next();
  };
}

module.exports = auth;