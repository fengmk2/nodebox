var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var path = require('path');
var nfs = require('./common/nfs');
var config = require('./config');

var HOME_PAGE = fs.readFileSync('./index.html');
var MAX_SIZE = 1024 * 1024 * 200; // 200mb

http.createServer(function handle(req, res) {
  if (req.url === '/store' && req.method.toLowerCase() === 'post') {
    var contentLength = parseInt(req.headers['content-length'], 10);
    if (isNaN(contentLength) || contentLength > MAX_SIZE) {
      res.writeHead(403, {'content-type': 'text/plain'});
      res.end(JSON.stringify({success: false, message: 'max file size is 200mb.'}));
      req.connection.destroy();
      return;
    }
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var file = files.file;
      if (!file) {
        res.writeHead(403, {'content-type': 'text/plain'});
        return res.end(JSON.stringify({success: false, message: 'no input file'}));
      }
      var name = path.basename(file.path);
      var ext = path.extname(file.name);
      var store_path =  '/' + name[0] + '/' + name[1] + '/' + name + ext;
      nfs.store(store_path, file.path, file.type, function () {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end(JSON.stringify({success: true, payload: {
          size: file.size,
          // url: 'http://' + req.headers.host + '/get' + store_path,
          url: 'http://' + config.qiniu.domain + store_path,
          type: file.type
        }}));
        fs.unlink(file.path);
      });
    });
    return;
  }

  if (req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(HOME_PAGE);
    return;
  }

}).listen(config.port);
