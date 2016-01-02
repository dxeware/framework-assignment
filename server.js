// "use strict";

// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var router = require('./index.js');

// app.use(express.static(__dirname + '/'));

// app.use(bodyParser.json());
// app.use('/', router);

// app.listen(3000, function() {
//   console.log('Listening on port 3000.....');
// });

// module.exports = app;

"use strict";

var http = require('http');
var Dawgs = require('./dawgs.js');

var dawgs = new Dawgs();

function sendResponse(res, status, data) {
  res.writeHead(status, {
      'Content-Type': 'text/html'
  });
  console.log(data);
  if (typeof data === 'string') {
    res.write(data);
  } else {
    res.write(JSON.stringify(data));
  }
  res.end();
}

function handleGET(req, res, route, match) {
  console.log('MATCH[0]', match[0], 'ROUTE', route);
  if (match[0] === route) {
    console.log('entering match 0');
     sendResponse(res, 200, dawgs.pack);
  } else if (match[1] !== undefined) { //URL === /dawgs with name attached
    var index = dawgs.findDawg(match[2]);
    if (-1 === index) {
      sendResponse(res, 200, 'NO DAWG');
    } else {
      sendResponse(res, 200, dawgs.pack[index]);
    }
  } else {
      sendResponse(res, 404);
  }
}
function handlePOST(req, res, route, match) {
  console.log('MATCH[0]', match[0], 'ROUTE', route);
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

function processRoute(req, res, route) {

  var re = new RegExp("^" + route + "?(\/)?(.+)");
  var match = req.url.match(re);
  console.log(req.method, 'MATCH', match);
  console.log('REGEX', re);
  //URL === /dawgs with no name attached 

  if (req.method === 'GET') {
    handleGET(req, res, route, match); 
  } else if (req.method == 'POST') {
    handlePOST(req, res, route, match); 
  }
  // if ((match === null) && (req.url === '/dawgs')) {

  //   if (req.method === 'GET') {
  //     handleGET(req, res, '/dawgs', match);
  //   }
  //   else if (req.method === 'POST') {
  //     var body = '';
  //     req.on('data', function (chunk) {
  //       body += chunk.toString();
  //     });
  //     req.on('end', function() {
  //       dawgs.addDawg(JSON.parse(body));
  //       sendResponse(res, 200, 'SUCCESS');
  //     }); 
  //   }
  // //URL === /dawgs with name attached 
  // } else {
  //   if (req.method === 'GET') {
  //     var index = dawgs.findDawg(match[1]);
  //     if (-1 === index) {
  //       sendResponse(res, 200, 'NO DAWG');
  //     } else {
  //       sendResponse(res, 200, dawgs.pack[index]);
  //     }
  //   }
    // handleGET(req, res, '/dawgs', match);

  // }

  // } else {

  //   var match = req.url.match(/^\/greet\/(.+)/);

  //   if ( (match !== null) && (req.method === 'GET') ) {
  //       writeString = 'How are you, ' + match[1] + '?';
  //       sendResponse(res, 200, writeString);
  //   } else {
  //     sendResponse(res, 404, writeString);
  //   }
  // }

}

var server = http.createServer(function (req, res) {
  processRoute(req, res, '/dawgs', sendResponse);
});

server.listen(3000, function () {
  console.log('listening on port 3000...');
});

module.exports = server;