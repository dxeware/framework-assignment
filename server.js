"use strict";

var http = require('http');

var Dawgs = require('./dawgs.js');
var route = require('./route.js');
var dawgs = new Dawgs('/dawgs');

var server = http.createServer(function (req, res) {
  route.processRoute(req, res, dawgs);
});

server.listen(3000, function () {
  console.log('listening on port 3000...');
});

module.exports = server;