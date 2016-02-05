var path = require('path');
var archive = require('../helpers/archive-helpers');
var serveAssets = require('./http-helpers').serveAssets;
var Promise = require('bluebird');
var archiveAsync = Promise.promisifyAll(require('../helpers/archive-helpers'));
var serveAssetsAsync = Promise.promisify(serveAssets);

exports.handleRequest = function (req, res) {
  
  if(req.url === "/"){
    rootResponse(req, res);
  } else if (req.url === '/loading.html') {
    loadingResponse(req, res);
  } else {
    siteResponse(req, res);
  }
};

var rootResponse = function (req, res) {
    if(req.method === "GET") {
      serveAssets(res, path.join(__dirname, '/public/index.html'), function(err, content){serveSiteContent(content,res);});
        
    } else if (req.method === "POST") {
      var body = '';  
      var Url;
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        Url = JSON.parse(body).url;
        archiveAsync.isUrlInListAsync(Url)
          .then(function(isInList){
            if(isInList){
              archiveAsync.isUrlArchivedAsync(Url)
              .then(function(isArchived){
                if(isArchived) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({redirectUrl: Url}));
                } else {
                  res.statusCode = 201;
                  res.end(JSON.stringify({redirectUrl: 'loading.html'}));  
                }
              })
              .catch(function(err){
                console.log(err);
                res.statusCode = 500;
                res.end('Unknown server error');    
              });
          } else {
            archiveAsync.addUrlToListAsync(Url)
            .then(function(){
              res.statusCode = 201;
              res.end(JSON.stringify({redirectUrl: 'loading.html'}));
            })
            .catch(function(err){
              console.log(err);
              res.statusCode = 500;
              res.end('Unknown server error');    
            });
          }
        });
      });
    }
  };

  var loadingResponse = function (req, res) {
    serveAssets(res, path.join(__dirname, 'public/loading.html'), function(err, content){serveSiteContent(content,res);});
  };

  var siteResponse = function (req, res) {
    var site = req.url.substring(1);
    archiveAsync.isUrlArchivedAsync(site)
      .then(function(isArchived) {
        if(isArchived) {
          serveAssetsAsync(res, path.join(archive.paths.archivedSites, site))
            .then(function (siteContent) {
              serveSiteContent(siteContent, res);
            })
            .catch(function(err){
              console.log(err);
              res.statusCode = 500;
              res.end('Unknown server error');     
            });
        } else {
          res.statusCode = 404;
          res.end('Bad request');
        }
      })
      .catch(function(err){
        console.log(err);
        res.statusCode = 500;
        res.end('Our bad');
      }); 
      console.log('end of function');
  };

  var serveSiteContent = function(content, res) {
    res.statusCode = 200;
    console.log('served content');
    res.end(content);
  };

