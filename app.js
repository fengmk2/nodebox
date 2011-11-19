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

http.createServer(function(req, res) {
    if (req.url === '/store' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var file = files.file;
            if(!file) {
                res.writeHead(403, {'content-type': 'text/plain'});
                return res.end(JSON.stringify({success: false, error: 'no input file'}));
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
}).listen(3000);
