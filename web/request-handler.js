var path = require('path');
var archive = require('../helpers/archive-helpers');
var serveAssets = require('./http-helpers').serveAssets;
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.url === "/"){
    if(req.method === "GET") {
      serveAssets(null, path.join(__dirname, '/public/index.html'), function(err, content) {
        if(err){
            res.statusCode = 500;
            res.end('Unknown server error');     
          } else {
            res.statusCode = 200;
            res.end(content);
          }
        });
    } else if (req.method === "POST") {
      var body = '';  
      var Url;
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        Url = JSON.parse(body).url;
        archive.isUrlInList(Url, function(err, isInList){
          if(isInList){
            res.statusCode = 200;
            res.end('Content is already archived');
          } else {
            archive.addUrlToList(Url, function(err){
              res.statusCode = 201;
              res.end(JSON.stringify({redirectUrl: 'loading.html'}));
            });
          }
        });
      });
    }
  } else {
    var site = req.url.substring(1);
    if(site === 'loading.html') {
      serveAssets(null,path.join(__dirname, 'public/loading.html'), function(err, content){
          if(err){
            res.statusCode = 500;
            res.end('Unknown server error');     
          } else {
            res.statusCode = 200;
            res.end(content);
          }
        });
    } else {
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
        } else {
          res.statusCode = 404;
          res.end('Bad request');
        }
      }); 
    }

  }

  // res.statusCode = 500;
  // res.end('You shouldn\'t be here');
};
