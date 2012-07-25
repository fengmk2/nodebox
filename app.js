var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var path = require('path');
var connect = require('connect');
var nfs = require('./common/nfs');
var config = require('./config');

fs.existsSync = fs.existsSync || path.existsSync;

var tpl = fs.readFileSync('./index.html');

var chars = '0123456789abcdef';
function mkdirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

var store_dir_pre = __dirname + '/files';

mkdirSync(store_dir_pre);

for (var i = 0, l = chars.length; i < l; i++) {
  var p1 = store_dir_pre + '/' + chars[i];
  mkdirSync(p1);
  for (var j = 0; j < l; j++) {
    var p2 = p1 + '/' + chars[j];
    mkdirSync(p2);
  }
}

var static_handle = connect.static(store_dir_pre, {maxAge: 3600000 * 24 * 365 * 10});
var max_size = 1024 * 1024 * 20; // 20mb

http.createServer(function(req, res) {
  if (req.url === '/store' && req.method.toLowerCase() === 'post') {
    var content_length = parseInt(req.headers['content-length'], 10);
    if (isNaN(content_length) || content_length > max_size) {
      res.writeHead(403, {'content-type': 'text/plain'});
      return res.end(JSON.stringify({success: false, message: 'max file size is 20mb.'}));
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
      // var store_path =  '/' + name[0] + '/' + name[1] + '/' + name + '/' + file.name;
      var store_path =  '/' + name[0] + '/' + name[1] + '/' + name + ext;
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end(JSON.stringify({success: true, payload: {
        size: file.size,
        // url: 'http://' + req.headers.host + '/get' + store_path,
        url: 'http://' + config.qiniu.domain + store_path,
        type: file.type
      }}));
      nfs.store(store_path, file.path, file.type);
      // fs.rename(file.path, store_dir_pre + store_path);
    });
    return;
  } else if (req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(tpl);
  } else if (req.url.indexOf('/get') === 0) {
    var key = req.url.substring(req.url.indexOf('/get') + 4);
    nfs.stat(key, function (err, stat) {
      if (err) {
        res.writeHead(500);
        res.end(err.message);
        return;
      }
      res.writeHead(302, {
        Location: stat.url
      });
      res.end();
    });
  } else {
    static_handle(req, res, function () {
      res.writeHead(404);
      res.end('Page not found');
    });
  }
}).listen(config.port);
