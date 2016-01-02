"use strict";

var http = require('http');
var Dawgs = require('./dawgs.js');
var dawgs = new Dawgs();

function sendResponse(res, status, data) {
  res.writeHead(status, {
      'Content-Type': 'text/html'
  });
  if (data !== undefined) {
    if (typeof data === 'string') {
      res.write(data);
    } else {
      res.write(JSON.stringify(data));
    }
  }
  res.end();
}

function handleGET(req, res, route, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === route) {
    sendResponse(res, 200, dawgs.pack);
  } else if (match[1] !== undefined) { //URL === /dawgs with name attached
    var index = dawgs.findDawg(match[2]);
    if (-1 === index) {
      sendResponse(res, 200, 'NO DAWG');
    } else {
      sendResponse(res, 200, dawgs.pack[index]);
    }
  } 
}

function handlePOST(req, res, route, match) {
  if (match[0] === route) {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      dawgs.addDawg(JSON.parse(body));
      sendResponse(res, 200, 'SUCCESS');
    }); 
  } else {
      sendResponse(res, 404);
  }
}

function handlePUT(req, res, route, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === route) {
    sendResponse(res, 404);
  } else if (match[1] !== undefined) { //URL === /dawgs with name attached
    var body = '';
    req.on('data', function (chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      if (body !== '') { 
        var updated = dawgs.updateDawg(JSON.parse(body));
        if (-1 === updated) {
          sendResponse(res, 200, 'NO DAWG');
        } else {
          sendResponse(res, 200, updated);
        } 
      } else {
          sendResponse(res, 404);
      }
    }); 
  }
}

function handleDELETE(req, res, route, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === route) {
    sendResponse(res, 404);
  } else if (match[1] !== undefined) { //URL === /dawgs with name attached
    var removed = dawgs.deleteDawg(match[2]);
    if (-1 === removed) {
      sendResponse(res, 200, 'NO DAWG');
    } else {
      sendResponse(res, 200, removed[0]);
    }
  } 
}

function processRoute(req, res, route) {
  var re = new RegExp("^" + route + "?(\/)?(.+)");
  var match = req.url.match(re);
  
  switch (req.method) {
    case 'GET':
      handleGET(req, res, route, match); 
      break;
    case 'POST':
      handlePOST(req, res, route, match); 
      break;
    case 'PUT':
      handlePUT(req, res, route, match);
      break;
    case 'DELETE':
      handleDELETE(req, res, route, match);
      break;
    default:
      sendResponse(res, 404);
  }
}

var server = http.createServer(function (req, res) {
  processRoute(req, res, dawgs.route, sendResponse);
});

server.listen(3000, function () {
  console.log('listening on port 3000...');
});

module.exports = server;