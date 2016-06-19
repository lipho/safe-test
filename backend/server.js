var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var host = isProduction ? 'safe.lipho.com' : 'localhost';
var port = isProduction ? 9999 : 3000;
var publicPath = path.resolve(__dirname, '..', 'public');
var sql = require('mssql');

if (!isProduction) {
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server
  app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
    proxy.web(req, res, {
      target: 'http://' + host + ':3001'
    });
  });
}

app.use(express.static(publicPath));

// place your handlers here
app.get('/api/', function(req, res) {
  'use strict'
  let config = {
    user: 'x',
    password: 'x',
    server: 'x',
    port: 4443,
    database: 'x'
  };
  
  sql.connect(config).then(function(){
    new sql.Request().query('select * from MemberSession').then(function(x) {
      return res.json(x);
    }).catch(function(err) {
      console.log(err);
      return res.status(500).json({success : false, data : err});
    });
  });
})

app.get('/membersession', function(req, res) {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});