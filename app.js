var formidable = require('formidable')
  , http = require('http')
  , util = require('util')
  , fs = require('fs')
  , path = require('path')
  , static = require('connect').static;

var tpl = fs.readFileSync('./index.html');

var chars = '0123456789abcdef';
function mkdirSync(dir) {
    if(!path.existsSync(dir)) {
        fs.mkdirSync(dir, '0777');
    }
}

var store_dir_pre = __dirname + '/files';

mkdirSync(store_dir_pre);

for(var i = 0, l = chars.length; i < l; i++) {
    var p1 = store_dir_pre + '/' + chars[i];
    mkdirSync(p1);
    for(var j = 0; j < l; j++) {
        var p2 = p1 + '/' + chars[j];
        mkdirSync(p2);
    }
}

var static_handle = static(store_dir_pre, {maxAge: 3600000 * 24 * 365 * 10});
var max_size = 1024 * 1024 * 20; // 20mb

http.createServer(function(req, res) {
    if (req.url === '/store' && req.method.toLowerCase() == 'post') {
        var content_length = parseInt(req.headers['content-length']);
        if(isNaN(content_length) || content_length > max_size) {
            res.writeHead(403, {'content-type': 'text/plain'});
            return res.end(JSON.stringify({success: false, message: 'max file size is 20mb.'}));
        }
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var file = files.file;
            if(!file) {
                res.writeHead(403, {'content-type': 'text/plain'});
                return res.end(JSON.stringify({success: false, message: 'no input file'}));
            }
            var name = path.basename(file.path)
              , ext = path.extname(file.name)
              , store_path =  '/' + name[0] + '/' + name[1] + '/' + name + ext;
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end(JSON.stringify({success: true, payload: {
                size: file.size
              , url: 'http://' + req.headers['host'] + store_path
              , type: file.type
            }}));
            fs.rename(file.path, store_dir_pre + store_path);
        });
        return;
    } else if(req.url === '/') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(tpl);
    } else {
        static_handle(req, res, function() {
            res.writeHead(404);
            res.end('Page not found');
        });
    }
}).listen(80);
