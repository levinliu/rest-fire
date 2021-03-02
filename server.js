const restify = require('restify');
const APP_NAME = 'REST-Fire'
const server = restify.createServer({name: APP_NAME, version: '1.0.0'});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
});

server.post('/test', function(req, res, next) {
  // console.log('params=' + JSON.stringify(req.params));
  console.log('request query= ' + req.query);
  console.log('request is json ? ' + req.is('json'));
  var body = req.body;
  console.log(body);
  var data = body;
  var url = data.site;
  console.log('site=' + url);
  try {
    callUrl(data, res);
  } catch (e) {
    console.log('fail to call site %s with error %j', url, e);
    res.send('fail to call site ' + url + ' with error:' + e);
  }
  return next();
});
function handleServiceResponse(res, obj, originRes) {
  if (res) {
    console.log('%d -> %j', res.statusCode, res.headers);
    console.log('service return: %j', obj);
    if (res.body) {
      originRes.send(res.body);
    } else {
      originRes.send(err);
    }
  } else {
    console.error('Target service is probably down.');
    originRes.send('Target service is probably down.');
  }
}
function callUrl(body, originRes) {
  var site = body.site;
  var uri = body.apiUri;
  var clients = require('restify-clients');
  var client = clients.createJsonClient({url: site, version: '~1.0'});
  var meth = body.meth;
  console.log('meth ' + meth + ', uri:' + uri);
  var data = body.data;
  if (meth === 'GET') {
    client.get(uri, function(err, req, res, obj) {
      handleServiceResponse(res, obj, originRes);
    });
  } else if (meth === 'POST') {
    client.post(uri, data, function(err, req, res, obj) {
      handleServiceResponse(res, obj, originRes);
    });
  } else if (meth === 'PUT') {
    client.put(uri, data, function(err, req, res, obj) {
      handleServiceResponse(res, obj, originRes);
    });
  } else if (meth === 'DEL' || method === 'DELETE') {
    client.del(uri, function(err, req, res, obj) {
      handleServiceResponse(res, obj, originRes);
    });
  } else {
    console.log('method [' + meth + '] do not support');
    originRes.send('Sorry, meth ' + meth + ' is currently not supported by RESTFly.');
  };
}

const dir = __dirname;
server.get('/*', restify.plugins.serveStaticFiles(dir, {
  maxAge: 3600000, // this is in millisecs
  etag: false,
  setHeaders: function setCustomHeaders(response, requestedPath, stat) {
    response.setHeader('Server', APP_NAME);
  }
}));

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});
var static = require('node-static');
var http = require('http');
var bodyParser = require('body-parser')
