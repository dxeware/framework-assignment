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

function processRoute(req, res) {

  var match = req.url.match(/^\/dawgs\/(.+)/);
  //URL === /dawgs with no name attached 
  if ((match === null) && (req.url === '/dawgs')) {

    if (req.method === 'GET') {
      sendResponse(res, 200, dawgs.pack);
    }
    else if (req.method === 'POST') {
      var body = '';
      req.on('data', function (chunk) {
        body += chunk.toString();
      });
      req.on('end', function() {
        dawgs.addDawg(JSON.parse(body));
        sendResponse(res, 200, 'SUCCESS');
      }); 
    }
  //URL === /dawgs with name attached 
  } else {
    console.log('MATCH =', match[1]);
    if (req.method === 'GET') {
      var index = dawgs.findDawg(match[1]);
      if (-1 === index) {
        sendResponse(res, 200, 'NO DAWG');
      } else {
        sendResponse(res, 200, dawgs.pack[index]);
      }
    }

  }

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
  processRoute(req, res, sendResponse);
});

server.listen(3000, function () {
  console.log('listening on port 3000...');
});

module.exports = server;