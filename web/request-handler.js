var path = require('path');
var archive = require('../helpers/archive-helpers');
var serveAssets = require('./http-helpers').serveAssets;
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.url === "/"){
    if(req.method === "GET") {
      console.log("/ GET");
    } else if (req.method === "POST") {
      console.log("/ POST");
    }
  } else {
    var site = req.url.substring(1);
    archive.isUrlArchived(site, function(err, isArchived) {
      if(err) {
        res.statusCode = 500;
        res.end('Unknown server error');
      }
      if(isArchived) {
        serveAssets(null,path.join(archive.paths.archivedSites, site), function(err, content){
          if(err){
            res.statusCode = 500;
            res.end('Unknown server error');     
          } else {
            res.statusCode = 200;
            res.end(content);
          }
        });
        // res.statusCode = 200;
        // res.end('google');
      } else {
        res.statusCode = 404;
        res.end('failure');
      }
    }); 
  }

  // res.statusCode = 500;
  // res.end('You shouldn\'t be here');
};
