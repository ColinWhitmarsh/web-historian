var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log("Req url", req.url);
  console.log('Req method', req.method);

  if(req.url === "/"){
    if(req.method === "GET") {
      console.log("/ GET");
    } else if (req.method === "POST") {
      console.log("/ POST");
    }
  } else {
    //assuming GET request with website
    var site = req.url.substring(1);
    if(archive.isUrlArchived(site)) {
      // res.end()
    } else {
      res.statusCode = 404;
      res.end('failure');
    }
  }







  res.end(archive.paths.list);
};
