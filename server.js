var restify = require('restify');

const server = restify.createServer({
  name: 'restfly',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
// server.use(restify.urlEncodedBodyParser({ mapParams : false }));

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});
server.post('/test', function(req, res, next) {
  // console.log('params=' + JSON.stringify(req.params));
  console.log('request query=' + req.query);
  // console.log('req header=' + req.header('Content-Type'));
  console.log('request is json' + req.is('json'));
  var body = req.body;
  console.log(body);
  var data = body;
  var url = data.site;
  console.log('site=' + url);
  // res.send('result='+url);
  callUrl(data, res);
  return next();
});
function callUrl(body, res) {
  var site = body.site;
  var uri = body.apiUri;
  var clients = require('restify-clients');
  var client = clients.createJsonClient({
    url: site,
    version: '~1.0'
   });
var meth = body.meth;
console.log('meth ' + meth + ', uri:' + uri);
var data = body.data;
if(meth === 'GET'){
client.get(uri, function (err, req, res2, obj) {
  console.log('Server returned: %j', obj);
  console.log(res2);
  res.send(res2.body);  
});
}else if (meth === 'POST'){
client.post(uri,data, function (err, req, res2, obj){
  console.log('server return: %j', obj);
  console.log(res2);
  if(res2 && res2.body){
  res.send(res2.body);
  }else{
    res.send(err);
  }
});
}else{
  res.send("Do not support method");
}
}
/*
server.get('/*', restify.plugins.serveStatic({
  directory: './',
  default: 'index.html'
}));*/
server.get('/*',
     restify.plugins.serveStaticFiles('./', {
     maxAge: 3600000, // this is in millisecs
     etag: false,
     setHeaders: function setCustomHeaders(response, requestedPath, stat) {
             response.setHeader('restify-plugin-x', 'awesome');
         }
     })
);

server.listen(8081, function () {
  console.log('%s listening at %s', server.name, server.url);
});
var static = require('node-static');
var http = require('http');
var bodyParser = require('body-parser')

var dir=__dirname;
