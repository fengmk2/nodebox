/*!
 * nodebox - test/app.test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var app = require('../app');
var pedding = require('pedding');
var request = require('supertest');

describe('app.test.js', function () {
  
  describe('/home', function () {

    it('should GET / 200', function (done) {
      request(app)
      .get('/')
      .expect(200)
      .expect(/<h2>Upload a file<\/h2>/, done);
    });

    it('should POST /anyurl 302 to /', function (done) {
      done = pedding(2, done);
      request(app)
      .post('/')
      .expect(302)
      .expect('Location', '/', done);

      request(app)
      .post('/anysurl/sdf/sdf/werwer/sdfsdf/pqwe')
      .expect(302)
      .expect('Location', '/', done);
    });
    
  });

});
