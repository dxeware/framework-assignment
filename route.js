'use strict';

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

function handleGET(req, res, dawgs, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === dawgs.route) {
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

function handlePOST(req, res, dawgs, match) {
  if (match[0] === dawgs.route) {
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

function handlePUT(req, res, dawgs, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === dawgs.route) {
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

function handleDELETE(req, res, dawgs, match) {
  if (match === null) {
    sendResponse(res, 404);
  } else if (match[0] === dawgs.route) {
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

module.exports = { 
  processRoute: function(req, res, dawgs) {
    var re = new RegExp("^" + dawgs.route + "?(\/)?(.+)");
    var match = req.url.match(re);
    
    switch (req.method) {
      case 'GET':
        handleGET(req, res, dawgs, match); 
        break;
      case 'POST':
        handlePOST(req, res, dawgs, match); 
        break;
      case 'PUT':
        handlePUT(req, res, dawgs, match);
        break;
      case 'DELETE':
        handleDELETE(req, res, dawgs, match);
        break;
      default:
        sendResponse(res, 404);
    }
  }//,
  // sendResponse: function(res, status, data) {
  //   res.writeHead(status, {
  //       'Content-Type': 'text/html'
  //   });
  //   if (data !== undefined) {
  //     if (typeof data === 'string') {
  //       res.write(data);
  //     } else {
  //       res.write(JSON.stringify(data));
  //     }
  //   }
  //   res.end();
  //}
}