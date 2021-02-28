var static = require('node-static');
var http = require('http');
var bodyParser = require('body-parser')

var dir=__dirname;
console.log('will serve ' + dir);
var file = new(static.Server)(dir);
/**
http.get({
  hostname: 'localhost',
  port: 8081,
  path: '/test'
}, (res) => {
 console.log('testing');
 //res.write('testing');
 console.log(res);
 //res.end('');
});
*/
var server = http.createServer(function (req, res) {
  file.serve(req, res);
});
// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser.json());
server.on('request', function(req,res){
  console.log('visiting '+req.url);
  var url = req.url
  if(url === '/test' || url.startsWith('/test?') ){ 
    try{
    console.log('req param:' + req.query);
    console.log('req method:' + req.method + ', body:'+ req.body);
    // res.setHeader('Content-Type','text/html;charset=utf-8'); 
    res.end("testing");
    }catch(e){
      console.error(e);
    }
  }
});
server.listen(8081);
